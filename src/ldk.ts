import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { err, ok, Result } from './utils/result';
import {
	EEventTypes,
	ELdkLogLevels,
	ENetworks,
	TAddPeerReq,
	TFeeUpdateReq,
	TInitChannelManagerReq,
	TInitConfig,
	TLogListener
} from './utils/types';

const LINKING_ERROR =
	`The package 'react-native-ldk' doesn't seem to be linked. Make sure: \n\n` +
	Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
	'- You rebuilt the app after installing the package\n' +
	'- You are not using Expo managed workflow\n';

const NativeLDK = NativeModules.Ldk
	? NativeModules.Ldk
	: new Proxy(
			{},
			{
				get() {
					throw new Error(LINKING_ERROR);
				}
			}
	  );

class LDK {
	private readonly logListeners: TLogListener[];
	private readonly ldkEvent: NativeEventEmitter;

	constructor() {
		this.logListeners = [];
		this.ldkEvent = new NativeEventEmitter(NativeModules.LdkEventEmitter);
	}

	/**
	 * https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.FeeEstimator.html
	 * @returns {Promise<Ok<any> | Err<unknown>>}
	 */
	async initFeeEstimator(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.inititlize('fee_estimator');
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * https://docs.rs/lightning/latest/lightning/util/logger/index.html
	 * @returns {Promise<Ok<any> | Err<unknown>>}
	 */
	async initLogger(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.inititlize('logger');
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * persist_new_channel and update_persisted_channel events triggered when
	 * https://docs.rs/lightning/latest/lightning/chain/chainmonitor/trait.Persist.html
	 * @returns {Promise<Ok<any> | Err<unknown>>}
	 */
	async initPersister(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.inititlize('persister');
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * broadcast_transaction event will be triggered when a tx needs to be sent
	 * https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.BroadcasterInterface.html
	 * @returns {Promise<Ok<any> | Err<unknown>>}
	 */
	async initBroadcaster(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.inititlize('broadcaster');
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Connected and disconnected blocks must be provided
	 * https://docs.rs/lightning/latest/lightning/chain/chainmonitor/struct.ChainMonitor.html
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initChainMonitor(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initChainMonitor();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Private key for node. Used to derive node public key. 32-byte entropy.
	 * https://docs.rs/lightning/latest/lightning/chain/keysinterface/struct.KeysManager.html
	 * @param seed
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initKeysManager(seed: string): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initKeysManager(seed);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Accepts array of hex encoded channel monitors from storage.
	 * If blank array is set then initChannelManager will init new channelManager.
	 * @param channelMonitors
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async loadChannelMonitors(channelMonitors: string[]): Promise<Result<string>> {
		try {
			const res = await NativeLDK.loadChannelMonitors(channelMonitors);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * https://docs.rs/lightning/latest/lightning/routing/network_graph/struct.NetworkGraph.html
	 * @param genesisHash
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initNetworkGraph(genesisHash: string): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initNetworkGraph(genesisHash);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Builds UserConfig, ChannelConfig, ChannelHandshakeConfig and ChannelHandshakeLimits.
	 * More settings can be added to configure the below structs.
	 * https://docs.rs/lightning/latest/lightning/util/config/struct.UserConfig.html
	 * https://docs.rs/lightning/latest/lightning/util/config/struct.ChannelConfig.html
	 * https://docs.rs/lightning/latest/lightning/util/config/struct.ChannelHandshakeConfig.html
	 * https://docs.rs/lightning/latest/lightning/util/config/struct.ChannelHandshakeLimits.html
	 *
	 * @param acceptInboundChannels
	 * @param manuallyAcceptInboundChannels
	 * @param announcedChannels
	 * @param minChannelHandshakeDepth
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initConfig({
		acceptInboundChannels,
		manuallyAcceptInboundChannels,
		announcedChannels,
		minChannelHandshakeDepth
	}: TInitConfig): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initConfig(
				acceptInboundChannels,
				manuallyAcceptInboundChannels,
				announcedChannels,
				minChannelHandshakeDepth
			);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Starts channel manager for current network and best block
	 * https://docs.rs/lightning/latest/lightning/ln/channelmanager/index.html
	 * @param network
	 * @param bestBlock
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initChannelManager({
		network,
		serializedChannelManager,
		bestBlock
	}: TInitChannelManagerReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initChannelManager(
				network,
				serializedChannelManager,
				bestBlock.hash,
				bestBlock.height
			);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Switch different log levels on/off
	 * https://docs.rs/lightning/latest/lightning/util/logger/enum.Level.html
	 * @param level
	 * @param active
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async setLogLevel(level: ELdkLogLevels, active: boolean): Promise<Result<string>> {
		try {
			const res = await NativeLDK.setLogLevel(level, active);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Provide fee rate information on a number of time horizons.
	 * https://docs.rs/lightning/latest/lightning/chain/chaininterface/enum.ConfirmationTarget.html
	 * @param high
	 * @param normal
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async updateFees({ highPriority, normal, background }: TFeeUpdateReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.updateFees(highPriority, normal, background);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	async addPeer({ pubKey, address, port }: TAddPeerReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.addPeer(address, port, pubKey);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	onEvent(event: EEventTypes, callback: (res: any) => void) {
		this.ldkEvent.addListener(event, callback);
	}

	/**
	 * Fetches LDK and c bindings version
	 * @returns {Promise<Ok<any> | Err<unknown>>}
	 */
	async version(): Promise<Result<{ c_bindings: string; ldk: string }>> {
		try {
			const res = await NativeLDK.version();
			return ok(JSON.parse(res));
		} catch (e) {
			return err(e);
		}
	}

	async nodeId(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.nodeId();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	async listPeers(): Promise<Result<string[]>> {
		try {
			const res = await NativeLDK.listPeers();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Callback passed though will get triggered for each LND log item
	 * @param callback
	 * @returns {string}
	 */
	addLogListener(callback: (log: string) => void): string {
		const id = new Date().valueOf().toString() + Math.random().toString();
		this.logListeners.push({ id, callback });
		return id; // Developer needs to use this ID to unsubscribe later
	}

	/**
	 * Removes a log listener once dev no longer wants to receive updates.
	 * e.g. When a component has been unmounted
	 * @param id
	 */
	removeLogListener(id: string): void {
		let removeIndex = -1;
		this.logListeners.forEach((listener, index) => {
			if (listener.id === id) {
				removeIndex = index;
			}
		});

		if (removeIndex > -1) {
			this.logListeners.splice(removeIndex, 1);
		}
	}

	/**
	 * Triggers every listener that has subscribed
	 * @param log
	 */
	private processLogListeners(log: string): void {
		if (!log) {
			return;
		}

		if (__DEV__) {
			console.log(log);
		}

		this.logListeners.forEach((listener) => listener.callback(log));
	}

	/**
	 * Gets LND log file content
	 * @param limit
	 * @returns {Promise<Err<unknown> | Ok<string[]>>}
	 */
	async getLogFileContent(limit: number = 100): Promise<Result<string[]>> {
		// try {
		// 	const content: string[] = await this.lnd.logFileContent(network, limit);
		// 	return ok(content);
		// } catch (e) {
		// 	return err(e);
		// }

		return ok([]);
	}
}

export default new LDK();
