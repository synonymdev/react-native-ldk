import { NativeEventEmitter, NativeModules, NativeModulesStatic, Platform } from 'react-native';
import base64 from 'base64-js';
import GrpcAction from './grpc';
import confString from './lnd.conf';
import { Result, ok, err } from './result';
import { CurrentLndState, GenericRequest, GrpcMethods } from './interfaces';
import { lnrpc } from './rpc';

class LND {
  private readonly grpc: GrpcAction;
  private readonly lnd: NativeModulesStatic;
  private readonly lndEvent: NativeEventEmitter;

  constructor() {
    this.lnd = NativeModules.LndReactModule;
    this.grpc = new GrpcAction(this.lnd);

    // TODO try expose the iOS event emitter in the same native module.
    this.lndEvent =
      Platform.OS === 'ios'
        ? new NativeEventEmitter(NativeModules.LightningEventEmitter)
        : new NativeEventEmitter(NativeModules.LndReactModule);
  }

  /**
   * Starts the LND service
   * @return {Promise<Result<boolean, Error>>}
   */
  async start(): Promise<Result<string, Error>> {
    try {
      if (__DEV__) {
        this.lndEvent.addListener('logs', (res) => {
          if (res) {
            console.log(res);
          }
        });
      }

      const res = await this.lnd.start(confString);
      return ok(res);
    } catch (e) {
      return err(e);
    }
  }

  /**
   * Generates wallet seed phrase which can be used in createWallet
   * @return {Promise<Result<string, Error>>}
   */
  async genSeed(): Promise<Result<string[], Error>> {
    try {
      const seed = await this.lnd.genSeed();
      return ok(seed);
    } catch (e) {
      return err(e);
    }
  }

  /**
   * Once LND is started then the wallet can be created and unlocked with this.
   * @return {Promise<Result<string, Error>>}
   * @param password
   * @param seed
   */
  async createWallet(password: string, seed: string[]): Promise<Result<string, Error>> {
    try {
      const res = await this.lnd.createWallet(password, seed);
      return ok(res);
    } catch (e) {
      return err(e);
    }
  }

  /**
   * Once LND is started then the wallet can be unlocked with this.
   * @return {Promise<Result<string, Error>>}
   * @param password
   */
  async unlockWallet(password: string): Promise<Result<string, Error>> {
    try {
      const res = await this.lnd.unlockWallet(password);
      return ok(res);
    } catch (e) {
      return err(e);
    }
  }

  /**
   * Determines if a wallet has already been initialized for the network specified.
   * @return {Promise<Result<boolean, Error>>}
   * @param network
   */
  async walletExists(network: string): Promise<Result<boolean, Error>> {
    try {
      const exists = await this.lnd.walletExists(network);
      return ok(exists);
    } catch (e) {
      return err(e);
    }
  }

  /**
   * Provides the current state of LND from the native module
   * @return {Promise<Result<CurrentLndState, Error>>}
   */
  async currentState(): Promise<Result<CurrentLndState, Error>> {
    try {
      return ok(await this.lnd.currentState());
    } catch (e) {
      return err(e);
    }
  }

  /**
   * LND GetInfo
   * @returns {Promise<Err<lnrpc.GetInfoResponse, any> | Ok<any, Error>>}
   */
  async getInfo(): Promise<Result<lnrpc.GetInfoResponse, Error>> {
    try {
      const message = lnrpc.GetInfoRequest.create();
      const serializedResponse = await this.grpc.sendCommand(
        GrpcMethods.getInfo,
        lnrpc.GetInfoRequest.encode(message).finish()
      );

      return ok(lnrpc.GetInfoResponse.decode(serializedResponse));
    } catch (e) {
      return err(e);
    }
  }

  /**
   * LND GetAddress
   * @returns {Promise<Err<lnrpc.NewAddressResponse, any> | Ok<any, Error>>}
   */
  async getAddress(type?: lnrpc.AddressType): Promise<Result<lnrpc.NewAddressResponse, Error>> {
    try {
      const message = lnrpc.NewAddressRequest.create({ type });
      const serializedResponse = await this.grpc.sendCommand(
        GrpcMethods.newAddress,
        lnrpc.NewAddressRequest.encode(message).finish()
      );

      return ok(lnrpc.NewAddressResponse.decode(serializedResponse));
    } catch (e) {
      return err(e);
    }
  }

  /**
   * LND GetWalletBalance
   * @returns {Promise<Err<lnrpc.WalletBalanceResponse, any> | Ok<any, Error>>}
   */
  async getWalletBalance(): Promise<Result<lnrpc.WalletBalanceResponse, Error>> {
    try {
      const message = lnrpc.WalletBalanceRequest.create();
      const serializedResponse = await this.grpc.sendCommand(
        GrpcMethods.getWalletBalance,
        lnrpc.WalletBalanceRequest.encode(message).finish()
      );

      return ok(lnrpc.WalletBalanceResponse.decode(serializedResponse));
    } catch (e) {
      return err(e);
    }
  }

  /**
   * LND GetChannelBalance
   * @returns {Promise<Err<lnrpc.ChannelBalanceResponse, any> | Ok<any, Error>>}
   */
  async getChannelBalance(): Promise<Result<lnrpc.ChannelBalanceResponse, Error>> {
    try {
      const message = lnrpc.ChannelBalanceRequest.create();
      const serializedResponse = await this.grpc.sendCommand(
        GrpcMethods.getChannelBalance,
        lnrpc.ChannelBalanceRequest.encode(message).finish()
      );

      return ok(lnrpc.ChannelBalanceResponse.decode(serializedResponse));
    } catch (e) {
      return err(e);
    }
  }
}

export default new LND();
