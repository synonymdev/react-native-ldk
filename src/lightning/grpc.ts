import { NativeModulesStatic } from 'react-native';

class GrpcAction {
  private readonly lnd: NativeModulesStatic;

  constructor(lndModule: NativeModulesStatic) {
    this.lnd = lndModule;
  }

  /**
   * Wrapper function to execute calls to the lnd grpc client.
   * @param  {string} method The lnd GRPC api to call
   * @param  {Object} body   The payload passed to the api
   * @return {Promise<Object>}
   */
  // sendCommand(method: string, body: Object) {
  //   return this._lnrpcRequest(method, body);
  // }

  // async _lnrpcRequest(method: string, body: Object) {
  //   try {
  //     method = toCaps(method);
  //     const req = this._serializeRequest(method, body);
  //     const response = await this.lnd.sendCommand(method, req);
  //
  //     let data = response.data;
  //     if (data == undefined) { //Some responses can be empty strings
  //       throw new Error("Invalid response");
  //     }
  //
  //     return this._deserializeResponse(method, data);
  //   } catch (err) {
  //     if (typeof err === 'string') {
  //       throw new Error(err);
  //     } else {
  //       throw err;
  //     }
  //   }
  // }
}

export default GrpcAction;
