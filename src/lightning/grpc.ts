import { NativeModulesStatic } from 'react-native';
import base64 from 'base64-js';
import { CurrentLndState, GrpcMethods } from './interfaces';

class GrpcAction {
  private readonly lnd: NativeModulesStatic;

  constructor(lndModule: NativeModulesStatic) {
    this.lnd = lndModule;
  }

  /**
   * Throws an error if LND is not in a state to be queried via GRPC
   * @throws Error
   * @returns {Promise<void>}
   */
  async checkGrpcReady(): Promise<void> {
    const res: CurrentLndState = await this.lnd.currentState();

    if (!res) {
      throw new Error('Unable to determine LND state');
    }

    if (!res.lndRunning) {
      throw new Error('LND not started');
    }

    if (!res.grpcReady) {
      throw new Error('GRPC not ready');
    }
  }

  /**
   * Wrapper function to execute calls to the lnd grpc client.
   * @param method
   * @return {Promise<Uint8Array>}
   * @param buffer
   */
  async sendCommand(method: GrpcMethods, buffer: Uint8Array): Promise<Uint8Array> {
    await this.checkGrpcReady(); // Throws an exception if LND is not ready to be queried via grpc

    const serialisedReq = base64.fromByteArray(buffer);
    const { data: serializedResponse } = await this.lnd.sendCommand(method, serialisedReq);
    if (serializedResponse === undefined) {
      throw new Error('Missing response');
    }

    return base64.toByteArray(serializedResponse);
  }
}

export default GrpcAction;
