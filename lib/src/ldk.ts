import {
	NativeModules,
	NativeEventEmitter,
	Platform,
	EmitterSubscription,
} from 'react-native';
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
	TInitNetworkGraphReq,
	TCloseChannelReq,
	TSpendOutputsReq,
	TNetworkGraphChannelInfo,
	TNetworkGraphNodeInfo,
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
	 * Sets the wallet storage path. Will create directories if they do not exist.
	 * @param path
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async setAccountStoragePath(path: string): Promise<Result<string>> {
		try {
			const res = await NativeLDK.setAccountStoragePath(path);
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
	 * Inits the network graph from previous cache or syncs from scratch using genesis block hash.
	 * https://docs.rs/lightning/latest/lightning/routing/network_graph/struct.NetworkGraph.html
	 * @param genesisHash
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initNetworkGraph({
		genesisHash,
	}: TInitNetworkGraphReq): Promise<Result<string>> {
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
	 * Starts channel manager for current network and best block.
	 * Accepts array of hex encoded channel manager and channel monitors from storage.
	 * NOTE: If empty channelManagerSerialized string then initChannelManager will create a new channel manager.
	 * https://docs.rs/lightning/latest/lightning/ln/channelmanager/index.html
	 * @param network
	 * @param channelManagerSerialized
	 * @param channelMonitorsSerialized
	 * @param bestBlock
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initChannelManager({
		network,
		bestBlock,
	}: TInitChannelManagerReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initChannelManager(
				network,
				bestBlock.hash,
				bestBlock.height,
			);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Unsets all LDK components. Can be used to safely shutdown node.
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async reset(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.reset();
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
	 * If set will write all LDK logging to file.
	 * @param level
	 * @param active
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async setLogFilePath(path: string): Promise<Result<string>> {
		try {
			const res = await NativeLDK.setLogFilePath(path);
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
	 * @param timeout (Android only)
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async addPeer({
		pubKey,
		address,
		port,
		timeout,
	}: TAddPeerReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.addPeer(address, port, pubKey, timeout);
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
		txData,
		height,
	}: TSetTxConfirmedReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.setTxConfirmed(header, txData, height);
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
	 * Close channel cooperatively or use force=true to force close channel
	 * https://docs.rs/lightning/0.0.109/lightning/ln/channelmanager/struct.ChannelManager.html#method.close_channel
	 * @param channelId
	 * @param counterpartyNodeId
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async closeChannel({
		channelId,
		counterPartyNodeId,
		force,
	}: TCloseChannelReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.closeChannel(
				channelId,
				counterPartyNodeId,
				!!force,
			);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Use LDK key manager to spend spendable outputs
	 * https://docs.rs/lightning/latest/lightning/chain/keysinterface/struct.KeysManager.html#method.spend_spendable_outputs
	 * @param descriptors
	 * @param outputs
	 * @param change_destination_script
	 * @param feerate_sat_per_1000_weight
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>} (Hex string of the transaction)
	 */
	async spendOutputs({
		descriptorsSerialized,
		outputs,
		change_destination_script,
		feerate_sat_per_1000_weight,
	}: TSpendOutputsReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.spendOutputs(
				descriptorsSerialized,
				outputs,
				change_destination_script,
				feerate_sat_per_1000_weight,
			);
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
		expiryDeltaSeconds,
	}: TCreatePaymentReq): Promise<Result<TInvoice>> {
		//TODO confirm we have enough incoming capacity
		try {
			const res = await NativeLDK.createPaymentRequest(
				(amountSats || 0) * 1000,
				description,
				expiryDeltaSeconds,
			);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * https://docs.rs/lightning/latest/lightning/ln/channelmanager/struct.ChannelManager.html#method.process_pending_htlc_forwards
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async processPendingHtlcForwards(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.processPendingHtlcForwards();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * https://docs.rs/lightning/latest/lightning/ln/channelmanager/struct.ChannelManager.html#method.claim_funds
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 * @param paymentPreimage
	 */
	async claimFunds(paymentPreimage: string): Promise<Result<string>> {
		try {
			const res = await NativeLDK.claimFunds(paymentPreimage);
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
	async pay({
		paymentRequest,
		amountSats,
	}: TPaymentReq): Promise<Result<string>> {
		//If no usable channels don't even attempt payment
		const channelsRes = await this.listUsableChannels();
		if (channelsRes.isOk() && channelsRes.value.length === 0) {
			return err('No usable channels found');
		}

		try {
			const res = await NativeLDK.pay(paymentRequest, amountSats || 0);

			return ok(res);
		} catch (e) {
			let resultError = err(e);
			//Add additional context to the error message for debugging if routing is failing.
			if (resultError.code === 'invoice_payment_fail_routing') {
				const decodedRes = await this.decode({ paymentRequest });
				if (decodedRes.isErr()) {
					//Return original payment error if we can't decode
					return err(e);
				}

				const { route_hints, recover_payee_pub_key, amount_satoshis } =
					decodedRes.value;

				let useFullMessage = `${resultError.error.message}.`;

				//Check route hints
				if (route_hints.length === 0) {
					useFullMessage = `${useFullMessage} No route hints found in payment request.`;
				}

				//Check if node is in our network graph
				const graphRes = await this.networkGraphListNodes();
				if (graphRes.isOk()) {
					let nodeInNetworkGraph = false;
					graphRes.value.forEach((node) => {
						if (node === recover_payee_pub_key) {
							nodeInNetworkGraph = true;
						}
					});

					if (!nodeInNetworkGraph) {
						useFullMessage = `${useFullMessage} Node not found in network graph.`;
					}
				}

				//Check we have enough outgoing balance in a single usable channel
				if (channelsRes.isOk()) {
					let highestOutgoing = 0;
					channelsRes.value.forEach(({ outbound_capacity_sat }) => {
						if (outbound_capacity_sat > highestOutgoing) {
							highestOutgoing = outbound_capacity_sat;
						}
					});

					let amountToSendSats = amountSats || amount_satoshis || 0;
					if (amountToSendSats > highestOutgoing) {
						useFullMessage = `${useFullMessage} Not enough outgoing capacity.`;
					}
				}

				return err(useFullMessage);
			}

			return err(e);
		}
	}

	//TODO pay_pubkey

	/**
	 * Listen on LDK events
	 * @param event
	 * @param callback
	 */
	onEvent(
		event: EEventTypes,
		callback: (res: any) => void,
	): EmitterSubscription {
		return this.ldkEvent.addListener(event, callback);
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
	 * Fetches list of node IDs in network graph
	 * https://docs.rs/lightning/latest/lightning/routing/gossip/struct.ReadOnlyNetworkGraph.html#method.nodes
	 * @returns {Promise<Ok<Ok<string[]> | Err<string[]>> | Err<unknown>>}
	 */
	async networkGraphListNodes(): Promise<Result<string[]>> {
		try {
			const res = await NativeLDK.networkGraphListNodes();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Fetches node details from network graph
	 * https://docs.rs/lightning/latest/lightning/routing/gossip/struct.ChannelInfo.html
	 * @param shortChannelId
	 * @returns {Promise<Ok<Ok<string> | Err<string>> | Err<unknown>>}
	 */
	async networkGraphNode(
		nodeId: string,
	): Promise<Result<TNetworkGraphNodeInfo>> {
		try {
			const res = await NativeLDK.networkGraphNode(nodeId);
			return ok({ ...res, nodeId });
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Fetches full list of nodes and their details
	 * @param nodeId
	 * @returns {Promise<Ok<Ok<TNetworkGraphChannelInfo> | Err<string>> | Err<unknown>>}
	 */
	async completeGraphNodes(): Promise<Result<TNetworkGraphNodeInfo[]>> {
		try {
			const res = await this.networkGraphListNodes();
			let nodes: TNetworkGraphNodeInfo[] = [];
			if (res.isErr()) {
				return err(res.error);
			}

			for (let index = 0; index < res.value.length; index++) {
				const nodeRes = await this.networkGraphNode(res.value[index]);
				if (nodeRes.isErr()) {
					return err(nodeRes.error);
				}

				nodes.push(nodeRes.value);
			}

			return ok(nodes);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Fetches list of short channel IDs in network graph
	 * https://docs.rs/lightning/latest/lightning/routing/gossip/struct.ReadOnlyNetworkGraph.html#method.channels
	 * @returns {Promise<Ok<string[]>> | Err<unknown>>}
	 */
	async networkGraphListChannels(): Promise<Result<string[]>> {
		try {
			const res = await NativeLDK.networkGraphListChannels();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Fetches channel details from network graph
	 * https://docs.rs/lightning/latest/lightning/routing/gossip/struct.ChannelInfo.html
	 * @param shortChannelId
	 * @returns {Promise<Ok<Ok<string> | Err<string>> | Err<unknown>>}
	 */
	async networkGraphChannel(
		shortChannelId: string,
	): Promise<Result<TNetworkGraphChannelInfo>> {
		try {
			const res = await NativeLDK.networkGraphChannel(shortChannelId);
			return ok({ ...res, shortChannelId });
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Fetches full list of channels and their details
	 * @param shortChannelId
	 * @returns {Promise<Ok<Ok<TNetworkGraphChannelInfo> | Err<string>> | Err<unknown>>}
	 */
	async completeGraphChannels(): Promise<Result<TNetworkGraphChannelInfo[]>> {
		try {
			const res = await this.networkGraphListChannels();
			let channels: TNetworkGraphChannelInfo[] = [];
			if (res.isErr()) {
				return err(res.error);
			}

			for (let index = 0; index < res.value.length; index++) {
				const channelRes = await this.networkGraphChannel(res.value[index]);
				if (channelRes.isErr()) {
					return err(channelRes.error);
				}

				channels.push(channelRes.value);
			}

			return ok(channels);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Write string to file in current directory set by setAccountStoragePath.
	 * If format is set to "hex" then it is assumed content is a hex string and
	 * the raw bytes will be saved to file.
	 * @param fileName
	 * @param content
	 * @param format
	 * @returns {Promise<Ok<boolean> | Err<unknown>>}
	 */
	async writeToFile(
		fileName: string,
		content: string,
		format: 'hex' | 'string' = 'string',
	): Promise<Result<boolean>> {
		try {
			await NativeLDK.writeToFile(fileName, content, format);
			return ok(true);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Read from file in current directory set by setAccountStoragePath.
	 * If format is set to "hex" then it is assumed content of file is raw
	 * bytes and hex version will be returned as result.
	 * Will return empty string if file does not exist yet.
	 * @param fileName
	 * @param format
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async readFromFile(
		fileName: string,
		format: 'hex' | 'string' = 'string',
	): Promise<Result<string>> {
		try {
			const res = await NativeLDK.readFromFile(fileName, format);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}
}

export default new LDK();
