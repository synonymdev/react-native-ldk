/**
 * @fileOverview a low level action to proxy GRPC api calls to and from lnd
 * mobile via a native module. This module should not be invokes directly
 * from the UI but rather used within other higher level actions.
 */
import "../../shim";
import { Platform } from "react-native";
import base64 from "base64-js";
import { lnrpc } from "./rpc";
import { toCaps } from "./helpers";

const { Duplex } = require("readable-stream");
const OS = Platform.OS;

class GrpcAction {
  constructor(NativeModules, NativeEventEmitter) {
    this._lnd = NativeModules.LndReactModule;
    this._lndEvent = new NativeEventEmitter(this._lnd);
    this._streamCounter = 0;
  }

  //
  // WalletUnlocker grpc client
  //

  /**
   * The first GRPC api that is called to initialize the wallet unlocker.
   * Once `unlockerReady` is set to true on the store GRPC calls can be
   * made to the client.
   * @return {Promise<undefined>}
   */
  async initUnlocker() {
    try {
      try {
        if (OS === "android") {
          await this._lnd.start();
        } else {
          this._lnd.start();
          this._lndEvent.addListener("streamEvent", (response) => {
            return Promise.resolve(response.data);
          });
        }
      } catch (e) {console.log(e);}
      if (__DEV__) {
        this._lndEvent.addListener("logs", res => {
          if (res) console.log(res);
        });
      }
      return { error: false, data: "" };
    } catch (e) {
      console.log(e);
      return { error: true, data: e };
    }
  }

  /**
   * Once `unlockerReady` is set then the wallet can be created and unlocked with this.
   * made to the client.
   * @param  {string} wallet password
   * @param  {Array<string>} wallet seed phrase
   * @return {Promise<undefined>}
   */
  async initWallet(password, seed) {
    try {
      try {
        await this._lnd.init(password, seed);
      } catch (e) {
        console.log(e);
        return { error: true, data: e };
      }

      return { error: false, data: "" };
    } catch (e) {
      console.log(e);
      return { error: true, data: e };
    }
  }

  /**
   * This GRPC api is called after the wallet is unlocked to close the grpc
   * client to lnd before the main lnd client is re-opened
   * @return {Promise<undefined>}
   */
  async closeUnlocker() {
    //await this._sendIpc('unlockClose', 'unlockClosed');

    // TODO: restart is not required on mobile
    // await this._lnd.closeUnlocker();
    console.log("GRPC unlockerClosed");
  }

  /**
   * Wrapper function to execute calls to the wallet unlocker.
   * @param  {string} method The unlocker GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Promise<Object>}
   */
  async sendUnlockerCommand(method, body) {
    try {
      return await this._lnrpcRequest(method, body);
    } catch (e) {
      console.log(e);
    }
  }

  //
  // Autopilot grpc client
  //

  /**
   * This is called to initialize the GRPC client to autopilot. Once `autopilotReady`
   * is set to true on the store GRPC calls can be made to the client.
   * @return {Promise<undefined>}
   */
  async initAutopilot() {
    console.log("GRPC autopilotReady");
  }

  /**
   * Wrapper function to execute calls to the autopilot grpc client.
   * @param  {string} method The autopilot GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Promise<Object>}
   */
  async sendAutopilotCommand(method, body) {
    try {
      return this._lnrpcRequest(method, body);
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  //
  // Lightning (lnd) grpc client
  //

  /**
   * This is called to initialize the main GRPC client to lnd. Once `lndReady`
   * is set to true on the store GRPC calls can be made to the client.
   * @return {Promise<undefined>}
   */
  async initLnd() {
    // TODO: restart is not required on mobile
    // await this._lnd.start();
    console.log("GRPC lndReady");
    //this._store.lndReady = true;
  }

  /**
   * Closes the main GRPC client to lnd. This should only be called upon exiting
   * the application as api calls need to be throughout the lifetime of the app.
   * @return {Promise<undefined>}
   */
  async closeLnd() {
    // TODO: add api on mobile
    // await this._lnd.close();
    console.log("GRPC lndClosed");
  }

  /**
   * This is called to restart the lnd process, after closing the main gRPC
   * client that's connected to it.
   * @return {Promise<undefined>}
   */
  async restartLnd() {
    await this.closeLnd();
    // TODO: handle restart in native module
  }

  /**
   * Wrapper function to execute calls to the lnd grpc client.
   * @param  {string} method The lnd GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Promise<Object>}
   */
  sendCommand(method, body) {
    try {
      return this._lnrpcRequest(method, body);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Wrapper function to execute GRPC streaming api calls to lnd. This function
   * proxies data to and from lnd using a duplex stream which is returned.
   * @param  {string} method The lnd GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Duplex}        The duplex stream object instance
   */
  sendStreamCommand(method, body) {
    try {
      method = toCaps(method);
      const self = this;
      const streamId = self._generateStreamId();
      const stream = new Duplex({
        write(data) {
          data = JSON.parse(data.toString("utf8"));
          const req = self._serializeRequest(method, data);
          self._lnd.sendStreamWrite(streamId, req);
        },
        read() {},
      });
      self._lndEvent.addListener("streamEvent", res => {
        if (res.streamId !== streamId) {
          return;
        } else if (res.event === "data") {
          try {stream.emit("data", self._deserializeResponse(method, res.data));} catch (e) {
            console.log(e);
          }
        } else {
          try {stream.emit(res.event, res.error || res.data);} catch (e) {
            console.log(e);
          }
        }
      });
      const req = self._serializeRequest(method, body);
      self._lnd.sendStreamCommand(method, streamId, req);
      return stream;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  //
  // Helper functions
  //

  async _lnrpcRequest(method, body) {
    try {
      method = toCaps(method);
      const req = this._serializeRequest(method, body);
      if (OS === "android") {
        const response = await this._lnd.sendCommand(method, req);
        return this._deserializeResponse(method, response.data);
      } else {
        this._lnd.sendCommand(method, req);
        this._lndEvent.addListener("streamEvent", (response) => {
          if (response.event === 'data') {
            return this._deserializeResponse(method, response.data);
          } else {
            return Promise.reject(response.error);
          }
        });
      }
    } catch (err) {
      if (typeof err === 'string') {
        throw new Error(err);
      } else {
        throw err;
      }
    }
  }

  _serializeRequest(method, body = {}) {
    const req = lnrpc[this._getRequestName(method)];
    const message = req.create(body);
    const buffer = req.encode(message).finish();
    return base64.fromByteArray(buffer);
  }

  _deserializeResponse(method, response) {
    const res = lnrpc[this._getResponseName(method)];
    const buffer = base64.toByteArray(response);
    return res.decode(buffer);
  }

  _serializeResponse(method, body = {}) {
    const res = lnrpc[this._getResponseName(method)];
    const message = res.create(body);
    const buffer = res.encode(message).finish();
    return base64.fromByteArray(buffer);
  }

  _generateStreamId() {
    this._streamCounter = this._streamCounter + 1;
    return String(this._streamCounter);
  }

  _getRequestName(method) {
    const map = {
      AddInvoice: "Invoice",
      DecodePayReq: "PayReqString",
      ListInvoices: "ListInvoiceRequest",
      SendPayment: "SendRequest",
      SubscribeTransactions: "GetTransactionsRequest",
      SubscribeInvoices: "InvoiceSubscription",
      SubscribeChannelBackups: "ChannelBackupSubscription",
      StopDaemon: "StopRequest",
      TrackPayment: "TrackPaymentRequest"
    };
    return map[method] || `${method}Request`;
  }

  _getResponseName(method) {
    const map = {
      DecodePayReq: "PayReq",
      GetTransactions: "TransactionDetails",
      ListInvoices: "ListInvoiceResponse",
      SendPayment: "SendResponse",
      OpenChannel: "OpenStatusUpdate",
      CloseChannel: "CloseStatusUpdate",
      SubscribeTransactions: "Transaction",
      SubscribeInvoices: "Invoice",
      SubscribeChannelBackups: "ChanBackupSnapshot",
      StopDaemon: "StopResponse",
      TrackPayment: "TrackPaymentResponse"
    };
    return map[method] || `${method}Response`;
  }
}

export default GrpcAction;
