import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { err, ok, Result } from './utils/result';
import {
	EEventTypes,
	ELdkLogLevels,
	TAddPeerReq,
	TChannel,
	TInvoice,
	TFeeUpdateReq,
	TInitChannelManagerReq,
	TInitConfig,
	TLogListener,
	TPaymentReq,
	TSyncTipReq,
	TCreatePaymentReq,
	TSetTxConfirmedReq,
	TSetTxUnconfirmedReq,
} from './utils/types';

const LINKING_ERROR =
	"The package 'react-native-ldk' doesn't seem to be linked. Make sure: \n\n" +
	Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
	'- You rebuilt the app after installing the package\n' +
	'- You are not using Expo managed workflow\n';

const NativeLDK =
	NativeModules?.Ldk ??
	new Proxy(
		{},
		{
			get(): void {
				throw new Error(LINKING_ERROR);
			},
		},
	);

class LDK {
	private readonly logListeners: TLogListener[];
	private readonly ldkEvent: NativeEventEmitter;

	constructor() {
		this.logListeners = [];
		this.ldkEvent = new NativeEventEmitter(NativeModules.LdkEventEmitter);
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
	async loadChannelMonitors(
		channelMonitors: string[],
	): Promise<Result<string>> {
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
		minChannelHandshakeDepth,
	}: TInitConfig): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initConfig(
				acceptInboundChannels,
				manuallyAcceptInboundChannels,
				announcedChannels,
				minChannelHandshakeDepth,
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
		bestBlock,
	}: TInitChannelManagerReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initChannelManager(
				network,
				serializedChannelManager,
				bestBlock.hash,
				bestBlock.height,
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
	async setLogLevel(
		level: ELdkLogLevels,
		active: boolean,
	): Promise<Result<string>> {
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
	async updateFees({
		highPriority,
		normal,
		background,
	}: TFeeUpdateReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.updateFees(highPriority, normal, background);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Sets current best block on channelManager and chainMonitor
	 * @param header
	 * @param height
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async syncToTip({ header, height }: TSyncTipReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.syncToTip(header, height);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Connect to remote peer
	 * @param pubKey
	 * @param address
	 * @param port
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async addPeer({
		pubKey,
		address,
		port,
	}: TAddPeerReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.addPeer(address, port, pubKey);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Updates a watched transaction as confirmed
	 * @param txId
	 * @param transaction
	 * @param height
	 * @param pos
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async setTxConfirmed({
		header,
		transaction,
		height,
		pos,
	}: TSetTxConfirmedReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.setTxConfirmed(
				header,
				transaction,
				pos,
				height,
			);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Updates a watched transaction as unconfirmed in the event of a reorg
	 * @param txId
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async setTxUnconfirmed({
		txId,
	}: TSetTxUnconfirmedReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.setTxUnconfirmed(txId);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Decodes a bolt11 payment request
	 * @param paymentRequest
	 * @returns {Promise<Ok<any> | Err<unknown>>}
	 */
	async decode({ paymentRequest }: TPaymentReq): Promise<Result<TInvoice>> {
		try {
			const res = await NativeLDK.decode(paymentRequest);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Creates bolt11 payment request
	 * @param amountSats
	 * @param description
	 * @returns {Promise<Ok<Ok<TInvoice> | Err<TInvoice>> | Err<unknown>>}
	 */
	async createPaymentRequest({
		amountSats,
		description,
	}: TCreatePaymentReq): Promise<Result<TInvoice>> {
		try {
			const res = await NativeLDK.createPaymentRequest(amountSats, description);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Pays a bolt11 payment request
	 * @param paymentRequest
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async pay({ paymentRequest }: TPaymentReq): Promise<Result<string>> {
		//TODO allow for setting amount if invoice amount is zero
		try {
			const res = await NativeLDK.pay(paymentRequest);
			return ok(res);
		} catch (e) {
			//TODO error can be drilled down in native code to provide better feedback and/or retry options.
			return err(e);
		}
	}

	//TODO pay_zero_value_invoice
	//TODO pay_pubkey

	/**
	 * Listen on LDK events
	 * @param event
	 * @param callback
	 */
	onEvent(event: EEventTypes, callback: (res: any) => void): void {
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

	/**
	 * Node public key
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async nodeId(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.nodeId();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * List of peer node IDs
	 * @returns {Promise<Ok<Ok<string[]> | Err<string[]>> | Err<unknown>>}
	 */
	async listPeers(): Promise<Result<string[]>> {
		try {
			const res = await NativeLDK.listPeers();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Returns array of channels
	 * https://docs.rs/lightning/latest/lightning/ln/channelmanager/struct.ChannelDetails.html
	 * @returns {Promise<Ok<Ok<TChannel[]> | Err<TChannel[]>> | Err<unknown>>}
	 */
	async listChannels(): Promise<Result<TChannel[]>> {
		try {
			const res = await NativeLDK.listChannels();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Returns array of usable channels
	 * https://docs.rs/lightning/latest/lightning/ln/channelmanager/struct.ChannelDetails.html
	 * @returns {Promise<Ok<Ok<TChannel[]> | Err<TChannel[]>> | Err<unknown>>}
	 */
	async listUsableChannels(): Promise<Result<TChannel[]>> {
		try {
			const res = await NativeLDK.listUsableChannels();
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
		//TODO
		// try {
		// 	const content: string[] = await this.ldk.logFileContent(network, limit);
		// 	return ok(content);
		// } catch (e) {
		// 	return err(e);
		// }
		if (__DEV__) {
			console.log(limit);
		}

		return ok([]);
	}
}

export default new LDK();
