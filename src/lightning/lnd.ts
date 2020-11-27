import { NativeEventEmitter, NativeModules, NativeModulesStatic, Platform } from 'react-native';
import GrpcAction from './grpc';
import confString from './lnd.conf';
import { Result, ok, err } from './result';
import { CurrentLndState } from './interfaces';
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
   * Throws an error if LND is not in a state to be queried via GRPC
   * @throws Error
   * @returns {Promise<void>}
   */
  async checkGrpcReady(): Promise<void> {
    const res = await this.currentState();

    if (res.isErr()) {
      throw new Error('Unable to determine LND state');
    }

    if (!res.value.lndRunning) {
      throw new Error('LND not started');
    }

    if (!res.value.grpcReady) {
      throw new Error('GRPC not ready');
    }
  }

  /**
   * Provides the current state of LND from the native module
   * @return {Promise<Result<CurrentLndState, Error>>}
   */
  async currentState(): Promise<Result<CurrentLndState, Error>> {
    try {
      const res = await this.lnd.currentState();
      return ok(res);
    } catch (e) {
      return err(e);
    }
  }

  /**
   * LND GetInfo
   * @returns {Promise<Err<unknown, any> | Ok<any, Error>>}
   */
  async getInfo(): Promise<Result<lnrpc.GetInfoResponse, Error>> {
    try {
      await this.checkGrpcReady();
      console.log('HERE 2');

      // const req = new lnrpc.GetInfoRequest();
      //
      // console.log(req);

      // const response = await this.lnd.sendCommand(method, req);

      const res = new lnrpc.GetInfoResponse();
      res.identityPubkey = 'Heyo';

      return ok(res);
    } catch (e) {
      return err(e);
    }
  }
}

export default new LND();
