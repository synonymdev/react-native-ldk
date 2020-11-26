import { NativeEventEmitter, NativeModules, NativeModulesStatic, Platform } from 'react-native';
import GrpcAction from './grpc';
import confString from './lns.conf';
import { Result, ok, err } from './result';

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
  async genSeed(): Promise<Result<Array<string>, Error>> {
    try {
      const seed = await this.lnd.genSeed();
      return ok(seed);
    } catch (e) {
      return err(e);
    }
  }

  /**
   * Once LND is started then the wallet can be created and unlocked with this.
   * @param  {string} wallet password
   * @param  {Array<string>} wallet seed phrase
   * @return {Promise<Result<string, Error>>}
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
   * @param  {string} wallet password
   * @return {Promise<Result<string, Error>>}
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
   * @param  {string} Network (bitcoin, testnet, regtest)
   * @return {Promise<Result<boolean, Error>>}
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
   * @return {Promise<Result<object, Error>>}
   */
  async currentState(): Promise<Result<object, Error>> {
    try {
      const res = await this.lnd.currentState();
      return ok(res);
    } catch (e) {
      return err(e);
    }
  }
}

export default new LND();
