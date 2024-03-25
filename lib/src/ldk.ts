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
	TLogListener,
	TPaymentReq,
	TCreatePaymentReq,
	TSetTxConfirmedReq,
	TInitNetworkGraphReq,
	TCloseChannelReq,
	TSpendOutputsReq,
	TNetworkGraphChannelInfo,
	TNetworkGraphNodeInfo,
	TFileReadRes,
	TFileReadReq,
	TFileWriteReq,
	TClaimableBalance,
	TPaymentRoute,
	TPaymentHop,
	TUserConfig,
	TReconstructAndSpendOutputsReq,
	THeader,
	TAcceptChannelReq,
	TBackupServerDetails,
	TNodeSignReq,
	TBackedUpFileList,
	TDownloadScorer,
	TInitKeysManager,
	TSpendRecoveredForceCloseOutputsReq,
	TChannelMonitor,
} from './utils/types';
import { extractPaymentRequest } from './utils/helpers';

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
			this.writeDebugToLog('setAccountStoragePath');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('setAccountStoragePath', e);
			return err(e);
		}
	}

	/**
	 * Private key for node. Used to derive node public key. 32-byte entropy.
	 * https://docs.rs/lightning/latest/lightning/chain/keysinterface/struct.KeysManager.html
	 * @param seed
	 * @param channelCloseDestinationScriptPublicKey
	 * @param channelCloseWitnessProgram
	 * @param channelCloseWitnessProgramVersion
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initKeysManager({
		seed,
		channelCloseDestinationScriptPublicKey,
		channelCloseWitnessProgram,
		channelCloseWitnessProgramVersion,
	}: TInitKeysManager): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initKeysManager(
				seed,
				channelCloseDestinationScriptPublicKey,
				channelCloseWitnessProgram,
				channelCloseWitnessProgramVersion,
			);
			this.writeDebugToLog('initKeysManager');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('initKeysManager', e);
			return err(e);
		}
	}

	/**
	 * Downloads a pre-populated scorer from remote server to be used on startup.
	 * Should be called before channel manager is initialized.
	 * @param scorerDownloadUrl
	 * @param skipHoursThreshold
	 */
	async downloadScorer({
		scorerDownloadUrl,
		skipHoursThreshold,
	}: TDownloadScorer): Promise<Result<string>> {
		try {
			const res = await NativeLDK.downloadScorer(
				scorerDownloadUrl,
				skipHoursThreshold ?? 3,
			);
			this.writeDebugToLog('downloadScorer');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('downloadScorer', e);
			return err(e);
		}
	}

	/**
	 * Inits the network graph from previous cache or syncs from scratch.
	 * By passing in rapidGossipSyncUrl p2p gossip sync will be disabled in favor out rapid gossip sync.
	 * For local regtest p2p works fine but for mainnet it is better to enable rapid gossip sync.
	 * Use skipHoursThreshold to avoid unnecessary http calls that check if there is an update.
	 * https://docs.rs/lightning/latest/lightning/routing/network_graph/struct.NetworkGraph.html
	 * @param network
	 * @param rapidGossipSyncUrl
	 * @param skipHoursThreshold
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initNetworkGraph({
		network,
		rapidGossipSyncUrl,
		skipHoursThreshold,
	}: TInitNetworkGraphReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initNetworkGraph(
				network,
				rapidGossipSyncUrl ?? '',
				skipHoursThreshold ?? 3, // default to 3 hours as that is the current RGS schedule.
			);
			this.writeDebugToLog(
				'initNetworkGraph',
				`Rapid gossip sync ${rapidGossipSyncUrl ? 'Enabled' : 'Disabled'}`,
			);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('initNetworkGraph', e);
			return err(e);
		}
	}

	/**
	 * Builds UserConfig, ChannelConfig, ChannelHandshakeConfig and ChannelHandshakeLimits.
	 * More settings can be added to configure the below structs.
	 * https://docs.rs/lightning/latest/lightning/util/config/struct.UserConfig.html
	 * https://docs.rs/lightning/latest/lightning/util/config/struct.ChannelHandshakeConfig.html
	 * https://docs.rs/lightning/latest/lightning/util/config/struct.ChannelHandshakeLimits.html
	 * https://docs.rs/lightning/latest/lightning/util/config/struct.ChannelConfig.html
	 *
	 * @param userConfig
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async initUserConfig(userConfig: TUserConfig): Promise<Result<string>> {
		try {
			const res = await NativeLDK.initUserConfig(userConfig);
			this.writeDebugToLog('initUserConfig', userConfig);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('initUserConfig', e);
			return err(e);
		}
	}

	/**
	 * Starts channel manager for current network and best block.
	 * Accepts array of hex encoded channel manager and channel monitors from storage.
	 * NOTE: If empty channelManagerSerialized string then initChannelManager will create a new channel manager.
	 * https://docs.rs/lightning/latest/lightning/ln/channelmanager/index.html
	 * @param {TInitChannelManagerReq} data
	 * @returns {Promise<Result<string>>}
	 */
	async initChannelManager(
		data: TInitChannelManagerReq,
	): Promise<Result<string>> {
		const { network, bestBlock } = data;
		try {
			const res = await NativeLDK.initChannelManager(
				network,
				bestBlock.hash,
				bestBlock.height,
			);
			this.writeDebugToLog('initChannelManager', data);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('initChannelManager', e);
			return err(e);
		}
	}

	/**
	 * Safely shutdown node and start it up again with the exact same params as it was initially started with.
	 * Useful for refreshing the TCP peer handler near instantly.
	 * lightning-manager.ts will receive an event to confirm the restart and then re add peers and sync the node.
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async restart(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.restart();
			this.writeDebugToLog('restart');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('restart', e);
			return err(e);
		}
	}

	/**
	 * Unsets all LDK components. Can be used to safely shutdown node.
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async stop(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.stop();
			this.writeDebugToLog('stop');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('stop', e);
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
	 * @param {string} path
	 * @returns {Promise<Result<string>>}
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
	 * Write a line to current LDK log file
	 * @param {'error' | 'info' | 'debug'} type
	 * @param {string} line
	 * @returns {Promise<Result<string>>}
	 */
	async writeToLogFile(
		type: 'error' | 'info' | 'debug',
		line: string,
	): Promise<Result<string>> {
		try {
			const writeLine = `${type.toUpperCase()} (JS): ${line}`;
			console.log(writeLine);
			const res = await NativeLDK.writeToLogFile(writeLine);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Writes a JS error to log file
	 * @param funcName
	 * @param error
	 */
	private writeErrorToLog(funcName: string, error: any | Error): void {
		this.writeToLogFile('error', `${funcName}() failed: ${error}`).catch(
			console.error,
		);
	}

	/**
	 * Writes a debug line to log file
	 * @param funcName
	 * @param data
	 */
	private writeDebugToLog(funcName: string, data: string | object = ''): void {
		this.writeToLogFile(
			'debug',
			`${funcName}() success. ${data ? JSON.stringify(data) : ''}`,
		).catch(console.error);
	}

	/**
	 * Provide fee rate information on a number of time horizons.
	 * Values are in satoshis per byte but are represented as satoshis per 1000 weight units
	 * https://docs.rs/lightning/latest/lightning/chain/chaininterface/enum.ConfirmationTarget.html
	 * Re https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.FeeEstimator.html#tymethod.get_est_sat_per_1000_weight
	 * @param fees
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async updateFees(fees: TFeeUpdateReq): Promise<Result<string>> {
		const {
			anchorChannelFee,
			nonAnchorChannelFee,
			channelCloseMinimum,
			minAllowedAnchorChannelRemoteFee,
			onChainSweep,
			minAllowedNonAnchorChannelRemoteFee,
		} = fees;
		try {
			const satsPerKw = 250;
			const res = await NativeLDK.updateFees(
				anchorChannelFee * satsPerKw,
				nonAnchorChannelFee * satsPerKw,
				channelCloseMinimum * satsPerKw,
				minAllowedAnchorChannelRemoteFee * satsPerKw,
				onChainSweep * satsPerKw,
				minAllowedNonAnchorChannelRemoteFee * satsPerKw,
			);
			this.writeDebugToLog('updateFees', fees);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('updateFees', e);
			return err(e);
		}
	}

	/**
	 * Sets current best block on channelManager and chainMonitor
	 * @param {THeader} tip
	 * @returns {Promise<Result<string>>}
	 */
	async syncToTip(tip: THeader): Promise<Result<string>> {
		const { hex, hash, height } = tip;
		try {
			const res = await NativeLDK.syncToTip(hex, hash, height);
			this.writeDebugToLog('syncToTip', tip);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('syncToTip', e);
			return err(e);
		}
	}

	/**
	 * Connect to remote peer
	 * @param {TAddPeerReq} peer
	 * @returns {Promise<Result<string>>}
	 */
	async addPeer(peer: TAddPeerReq): Promise<Result<string>> {
		const { pubKey, address, port, timeout } = peer;
		try {
			const res = await NativeLDK.addPeer(address, port, pubKey, timeout);
			this.writeDebugToLog('addPeer', peer);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('addPeer', e);
			return err(e);
		}
	}

	/**
	 * Updates a watched transaction as confirmed
	 * @param header
	 * @param txData
	 * @param height
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async setTxConfirmed({
		header,
		txData,
		height,
	}: TSetTxConfirmedReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.setTxConfirmed(header, txData, height);
			this.writeDebugToLog('setTxConfirmed');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('setTxConfirmed', e);
			return err(e);
		}
	}

	/**
	 * Updates a watched transaction as unconfirmed in the event of a reorg
	 * @param {string} txid
	 * @returns {Promise<Result<string>>}
	 */
	async setTxUnconfirmed(txid: string): Promise<Result<string>> {
		try {
			const res = await NativeLDK.setTxUnconfirmed(txid);
			this.writeDebugToLog('setTxUnconfirmed');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('setTxConfirmed', e);
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
		//For cooperative closes make sure we're connected to peer
		if (!force) {
			const peersRes = await this.listPeers();
			if (peersRes.isErr()) {
				return err(peersRes.error);
			}

			const connectedNodeId = peersRes.value.find(
				(nodeId) => nodeId === counterPartyNodeId,
			);

			if (!connectedNodeId) {
				const peerDisconnectedError =
					'Cannot cooperatively close channel as peer is not connected.';
				this.writeErrorToLog('closeChannel', peerDisconnectedError);
				return err(peerDisconnectedError);
			}
		}

		try {
			const res = await NativeLDK.closeChannel(
				channelId,
				counterPartyNodeId,
				!!force,
			);
			this.writeDebugToLog('closeChannel');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('closeChannel', e);
			return err(e);
		}
	}

	/**
	 * Force close all channels
	 * @param broadcastLatestTx
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async forceCloseAllChannels(
		broadcastLatestTx: boolean,
	): Promise<Result<string>> {
		try {
			const res = await NativeLDK.forceCloseAllChannels(broadcastLatestTx);
			this.writeDebugToLog('forceCloseAllChannels');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('forceCloseAllChannels', e);
			return err(e);
		}
	}

	/**
	 * Accepts an incoming channel open request.
	 * Set trustedPeer0Conf to true ONLY if you trust the peer's zero conf channel.
	 * @param temporaryChannelId
	 * @param counterPartyNodeId
	 * @param userChannelId
	 * @param trustedPeer0Conf
	 */
	async acceptChannel({
		temporaryChannelId,
		counterPartyNodeId,
		trustedPeer0Conf,
	}: TAcceptChannelReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.acceptChannel(
				temporaryChannelId,
				counterPartyNodeId,
				trustedPeer0Conf,
			);
			this.writeDebugToLog('acceptChannel');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('acceptChannel', e);
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
			this.writeDebugToLog('spendOutputs');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('spendOutputs', e);
			return err(e);
		}
	}

	/**
	 * Decodes a bolt11 payment request
	 * @param paymentRequest
	 * @returns {Promise<Result<TInvoice>>}
	 */
	async decode({ paymentRequest }: TPaymentReq): Promise<Result<TInvoice>> {
		const cleanedPaymentRequest = extractPaymentRequest(paymentRequest);
		try {
			const res = await NativeLDK.decode(cleanedPaymentRequest);
			this.writeDebugToLog('decode');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('decode', e);
			return err(e);
		}
	}

	/**
	 * Creates bolt11 payment request
	 * @param {number | undefined} amountSats
	 * @param {string} description
	 * @param {number} expiryDeltaSeconds
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
				amountSats || 0,
				description,
				expiryDeltaSeconds,
			);
			this.writeDebugToLog('createPaymentRequest');

			return ok(res);
		} catch (e) {
			this.writeErrorToLog('createPaymentRequest', e);
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
			this.writeDebugToLog('processPendingHtlcForwards');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('processPendingHtlcForwards', e);
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
			this.writeDebugToLog('claimFunds');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('claimFunds', e);
			return err(e);
		}
	}

	/**
	 * Pays a bolt11 payment request and returns paymentId
	 * @param paymentRequest
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async pay({
		paymentRequest: anyPaymentRequest,
		amountSats,
		timeout = 20000,
	}: TPaymentReq): Promise<Result<string>> {
		const paymentRequest = extractPaymentRequest(anyPaymentRequest);

		//If no usable channels don't even attempt payment
		const channelsRes = await this.listUsableChannels();
		if (channelsRes.isOk() && channelsRes.value.length === 0) {
			const noUsableChannelsError = 'No usable channels found';
			this.writeErrorToLog('pay', noUsableChannelsError);
			return err(noUsableChannelsError);
		}

		try {
			const timeoutSeconds = timeout / 1000; //Rust demands seconds
			const res = await NativeLDK.pay(
				paymentRequest,
				amountSats || 0,
				timeoutSeconds,
			);
			this.writeDebugToLog('pay');
			return ok(res);
		} catch (e) {
			let resultError = err(e);
			//Add additional context to the error message for debugging if routing is failing.
			if (resultError.code === 'invoice_payment_fail_routing') {
				const decodedRes = await this.decode({ paymentRequest });
				if (decodedRes.isErr()) {
					//Return original payment error if we can't decode
					this.writeErrorToLog('pay', e);
					return err(e);
				}

				const { route_hints, recover_payee_pub_key, amount_satoshis } =
					decodedRes.value;

				let usefulMessage = `${resultError.error.message}.`;

				//Check route hints
				if (route_hints.length === 0) {
					usefulMessage = `${usefulMessage} No route hints found in payment request.`;
				}

				//Check if node is in our network graph
				const graphRes = await this.networkGraphNodes([recover_payee_pub_key]);
				if (graphRes.isOk()) {
					if (graphRes.value.length === 0) {
						usefulMessage = `${usefulMessage} Node not found in network graph.`;
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
						usefulMessage = `${usefulMessage} Not enough outgoing capacity.`;
					}
				}

				this.writeErrorToLog('pay', usefulMessage);

				return err(usefulMessage);
			}

			this.writeErrorToLog('pay', e);
			return err(e);
		}
	}

	async buildPathToDestination({
		paymentRequest: anyPaymentRequest,
		amountSats,
	}: TPaymentReq): Promise<Result<TPaymentRoute>> {
		const channelsRes = await this.listUsableChannels();
		if (channelsRes.isErr()) {
			return err(channelsRes.error);
		}

		if (channelsRes.value.length < 1) {
			return err('No usable channels to build path');
		}

		const paymentRequest = extractPaymentRequest(anyPaymentRequest);
		const decodeRes = await this.decode({ paymentRequest });
		if (decodeRes.isErr()) {
			return err(decodeRes.error);
		}

		const { recover_payee_pub_key: destNodeId, amount_satoshis } =
			decodeRes.value;

		const finalAmountSats = amountSats || amount_satoshis || 0;

		//Go through channels and find one where the counterparty has a direct channel with final dest node
		const nodesRes = await this.networkGraphNodes([destNodeId]);
		if (nodesRes.isErr()) {
			return err(nodesRes.error);
		}
		if (nodesRes.value.length === 0) {
			return err('Destination node not found in network graph'); //TODO return empty result?
		}

		let route: TPaymentRoute = [];

		let hopToDest: TPaymentHop | undefined;
		let firstHop: TPaymentHop | undefined;

		const finalNode = nodesRes.value[0];
		for (let index = 0; index < finalNode.shortChannelIds.length; index++) {
			if (hopToDest) {
				//TODO maybe if there are multiple channels to dest, pick the best one
				continue;
			}

			const finalHopShortChannelId = finalNode.shortChannelIds[index];
			const channelToDest = await this.networkGraphChannel(
				finalHopShortChannelId,
			);
			if (channelToDest.isOk()) {
				//Check if one of the channels to the final node is to one of our counterparties
				//If it is that'll be the final hop
				const { node_one, node_two } = channelToDest.value;
				channelsRes.value.forEach((myChannel) => {
					const {
						counterparty_node_id: ourCounterPartyNodeId,
						short_channel_id,
						config_forwarding_fee_base_msat,
						config_forwarding_fee_proportional_millionths,
						outbound_capacity_sat,
					} = myChannel;

					if (outbound_capacity_sat < finalAmountSats) {
						return;
					}

					if (!short_channel_id) {
						return;
					}

					if (
						ourCounterPartyNodeId === node_one ||
						ourCounterPartyNodeId === node_two
					) {
						const percentBasedFee = Math.ceil(
							(finalAmountSats *
								config_forwarding_fee_proportional_millionths) /
								1000000,
						);

						const fee = Math.max(
							config_forwarding_fee_base_msat,
							percentBasedFee,
						);

						firstHop = {
							dest_node_id: ourCounterPartyNodeId,
							short_channel_id: short_channel_id!,
							fee_sats: fee,
						};

						hopToDest = {
							dest_node_id: finalNode.id,
							short_channel_id: finalHopShortChannelId,
							fee_sats: finalAmountSats,
						};
					}
				});
			}
		}

		//TODO check we have hops
		if (!firstHop) {
			return err('No first hop found');
		}

		if (!hopToDest) {
			return err('No last hop found');
		}

		route.push(firstHop!);
		route.push(hopToDest!);

		//TODO check channel capacities, assuming might work in the meantime

		return ok(route);
	}

	/**
	 * Abandons a payment
	 * @param paymentId
	 * @returns {Promise<Err<unknown> | Ok<Ok<string> | Err<string>>>}
	 */
	async abandonPayment(paymentId: string): Promise<Result<string>> {
		try {
			const res = await NativeLDK.abandonPayment(paymentId);
			this.writeDebugToLog('abandonPayment', paymentId);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('abandonPayment', e);
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
			this.writeDebugToLog('version');
			return ok(JSON.parse(res));
		} catch (e) {
			this.writeErrorToLog('version', e);
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
			this.writeDebugToLog('nodeId');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('nodeId', e);
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
			this.writeDebugToLog('listPeers', `Peers: ${res.length}`);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('listPeers', e);
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
			this.writeDebugToLog('listChannels', `Channels: ${res.length}`);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('listChannels', e);
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
			this.writeDebugToLog(
				'listUsableChannels',
				`Usable channels: ${res.length}`,
			);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('listUsableChannels', e);
			return err(e);
		}
	}

	/**
	 * Lists all files in channel directory to be backed up.
	 * Will include past and current channels.
	 * @returns {Promise<Ok<Ok<string[]> | Err<string[]>> | Err<unknown>>}
	 */
	async listChannelFiles(): Promise<Result<string[]>> {
		try {
			const res = await NativeLDK.listChannelFiles();
			this.writeDebugToLog('listChannelFiles', `Files: ${res.length}`);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('listChannelFiles', e);
			return err(e);
		}
	}

	/**
	 * Lists all channel monitors from storage
	 * @param ignoreOpenChannels
	 * @returns {Promise<Ok<Ok<string[]> | Err<string[]>> | Err<unknown>>}
	 */
	async listChannelMonitors(
		ignoreOpenChannels: boolean,
	): Promise<Result<TChannelMonitor[]>> {
		try {
			const res = await NativeLDK.listChannelMonitors(ignoreOpenChannels);
			this.writeDebugToLog('listChannelMonitors', `Monitors: ${res.length}`);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('listChannelMonitors', e);
			return err(e);
		}
	}

	/**
	 * Fetches list of all node IDs in network graph
	 * https://docs.rs/lightning/latest/lightning/routing/gossip/struct.ReadOnlyNetworkGraph.html#method.nodes
	 * @returns {Promise<Ok<Ok<string[]> | Err<string[]>> | Err<unknown>>}
	 */
	async networkGraphListNodeIds(): Promise<Result<string[]>> {
		try {
			const res = await NativeLDK.networkGraphListNodeIds();
			this.writeDebugToLog('networkGraphListNodeIds');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('networkGraphListNodeIds', e);
			return err(e);
		}
	}

	/**
	 * Fetches array of node details from network graph
	 * https://docs.rs/lightning/latest/lightning/routing/gossip/struct.ChannelInfo.html
	 * @param nodeIds string[]
	 * @returns {Promise<Ok<Ok<string> | Err<string>> | Err<unknown>>}
	 */
	async networkGraphNodes(
		nodeIds: string[],
	): Promise<Result<TNetworkGraphNodeInfo[]>> {
		try {
			const res = await NativeLDK.networkGraphNodes(nodeIds);
			this.writeDebugToLog('networkGraphNodes');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('networkGraphNodes', e);
			return err(e);
		}
	}

	/**
	 * Fetches full list of nodes and their details
	 * @returns {Promise<Result<TNetworkGraphNodeInfo[]>>}
	 */
	async completeGraphNodes(): Promise<Result<TNetworkGraphNodeInfo[]>> {
		try {
			const res = await this.networkGraphListNodeIds();
			if (res.isErr()) {
				return err(res.error);
			}

			if (res.value.length > 100) {
				const tooManyError = `Too many nodes to query (${res.value.length})`;
				this.writeErrorToLog('completeGraphNodes', tooManyError);
				return err(tooManyError);
			}

			const nodeRes = await this.networkGraphNodes(res.value);
			if (nodeRes.isErr()) {
				this.writeErrorToLog('completeGraphNodes', nodeRes.error);
				return err(nodeRes.error);
			}

			this.writeDebugToLog('completeGraphNodes');
			return ok(nodeRes.value);
		} catch (e) {
			this.writeErrorToLog('networkGraphNodes', e);
			return err(e);
		}
	}

	/**
	 * Fetches list of all short channel IDs in network graph
	 * https://docs.rs/lightning/latest/lightning/routing/gossip/struct.ReadOnlyNetworkGraph.html#method.channels
	 * @returns {Promise<Ok<string[]>> | Err<unknown>>}
	 */
	async networkGraphListChannels(): Promise<Result<string[]>> {
		try {
			const res = await NativeLDK.networkGraphListChannels();
			this.writeDebugToLog('networkGraphListChannels');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('networkGraphNodes', e);
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
			this.writeDebugToLog('networkGraphChannel');
			return ok({ ...res, shortChannelId });
		} catch (e) {
			this.writeErrorToLog('networkGraphChannel', e);
			return err(e);
		}
	}

	/**
	 * Fetches full list of channels and their details
	 * @returns {Promise<Result<TNetworkGraphChannelInfo[]>>}
	 */
	async completeGraphChannels(): Promise<Result<TNetworkGraphChannelInfo[]>> {
		try {
			const res = await this.networkGraphListChannels();
			let channels: TNetworkGraphChannelInfo[] = [];
			if (res.isErr()) {
				this.writeErrorToLog('completeGraphChannels', res.error);
				return err(res.error);
			}

			for (let index = 0; index < res.value.length; index++) {
				const channelRes = await this.networkGraphChannel(res.value[index]);
				if (channelRes.isErr()) {
					this.writeErrorToLog('completeGraphChannels', channelRes.error);
					return err(channelRes.error);
				}

				channels.push(channelRes.value);
			}

			this.writeDebugToLog('completeGraphChannels');
			return ok(channels);
		} catch (e) {
			this.writeErrorToLog('completeGraphChannels', e);
			return err(e);
		}
	}

	/**
	 * Fetches a list of all channels LDK has ever had. Use ignoreOpenChannels to get
	 * pending balances for channels no longer included in list_channels (closed/closing channels).
	 * https://docs.rs/lightning/latest/lightning/chain/chainmonitor/struct.ChainMonitor.html#method.get_claimable_balances
	 * @param ignoreOpenChannels
	 * @returns {Promise<Ok<Ok<TClaimableBalance[]> | Err<TClaimableBalance[]>> | Err<unknown>>}
	 */
	async claimableBalances(
		ignoreOpenChannels: boolean,
	): Promise<Result<TClaimableBalance[]>> {
		try {
			const res = await NativeLDK.claimableBalances(ignoreOpenChannels);
			this.writeDebugToLog('claimableBalances', res);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('claimableBalances', e);
			return err(e);
		}
	}

	/**
	 * Write string to file in current directory set by setAccountStoragePath.
	 * If format is set to "hex" then it is assumed content is a hex string and
	 * the raw bytes will be saved to file.
	 * @param fileName
	 * @param path (optional) will use current account path as default if not provided
	 * @param content
	 * @param format
	 * @param remotePersist
	 * @returns {Promise<Ok<boolean> | Err<unknown>>}
	 */
	async writeToFile({
		fileName,
		path,
		content,
		format,
		remotePersist,
	}: TFileWriteReq): Promise<Result<boolean>> {
		try {
			await NativeLDK.writeToFile(
				fileName,
				path || '',
				content,
				format || 'string',
				!!remotePersist,
			);
			this.writeDebugToLog('writeToFile', fileName);
			return ok(true);
		} catch (e) {
			this.writeErrorToLog('writeToFile', e);
			return err(e);
		}
	}

	/**
	 * Read from file in current directory set by setAccountStoragePath.
	 * If format is set to "hex" then it is assumed content of file is raw
	 * bytes and hex version will be returned as result.
	 * Will return empty string if file does not exist yet.
	 * @param fileName
	 * @param path (optional) will use current account path as default if not provided
	 * @param format
	 * @returns {Promise<Ok<{content: string, timestamp: number}> | Err<unknown>>}
	 */
	async readFromFile({
		fileName,
		format,
		path,
	}: TFileReadReq): Promise<Result<TFileReadRes>> {
		try {
			const res: TFileReadRes = await NativeLDK.readFromFile(
				fileName,
				path || '',
				format || 'string',
			);
			this.writeDebugToLog('readFromFile', fileName);
			return ok({ ...res, timestamp: Math.round(res.timestamp) });
		} catch (e) {
			if (JSON.stringify(e).indexOf('Could not locate file') < 0) {
				this.writeErrorToLog('readFromFile', e);
			}
			return err(e);
		}
	}

	/**
	 * Rebuilds a transaction when the spendable output was not previously saved.
	 * Returns the raw transaction hex.
	 * @param outputScriptPubKey
	 * @param outputValue
	 * @param outpointTxId
	 * @param outpointIndex
	 * @param feeRate
	 * @param changeDestinationScript
	 * @returns {Promise<Ok<string> | Err<unknown>>}
	 */
	async reconstructAndSpendOutputs({
		outputScriptPubKey,
		outputValue,
		outpointTxId,
		outpointIndex,
		feeRate,
		changeDestinationScript,
	}: TReconstructAndSpendOutputsReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.reconstructAndSpendOutputs(
				outputScriptPubKey,
				outputValue,
				outpointTxId,
				outpointIndex,
				feeRate,
				changeDestinationScript,
			);
			this.writeDebugToLog('reconstructAndSpendOutputs', res);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('reconstructAndSpendOutputs', e);
			return err(e);
		}
	}

	async spendRecoveredForceCloseOutputs({
		transaction,
		confirmationHeight,
		changeDestinationScript,
	}: TSpendRecoveredForceCloseOutputsReq): Promise<Result<string[]>> {
		try {
			const res = await NativeLDK.spendRecoveredForceCloseOutputs(
				transaction,
				confirmationHeight,
				changeDestinationScript,
			);
			this.writeDebugToLog('spendRecoveredForceCloseOutputs', res);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('spendRecoveredForceCloseOutputs', e);
			return err(e);
		}
	}

	/**
	 * Creates a digital signature of a message the node's secret key.
	 * A receiver knowing the PublicKey (e.g. the node's id) and the message can be sure that the signature was generated by the caller.
	 * Signatures are EC recoverable, meaning that given the message and the signature the PublicKey of the signer can be extracted.
	 * @param message
	 * @param messagePrefix
	 */
	async nodeSign({
		message,
		messagePrefix = 'Lightning Signed Message:',
	}: TNodeSignReq): Promise<Result<string>> {
		try {
			const res = await NativeLDK.nodeSign(`${messagePrefix}${message}`);
			this.writeDebugToLog('nodeSign', res);
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('nodeSign', e);
			return err(e);
		}
	}

	/**
	 * Returns and writes to log file the current state of each node component for debugging.
	 */
	async nodeStateDump(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.nodeStateDump();
			this.writeDebugToLog('nodeStateDump');
			return ok(res);
		} catch (e) {
			this.writeErrorToLog('nodeStateDump', e);
			return err(e);
		}
	}

	/**
	 * Setup remote backup server
	 * @param seed
	 * @param network
	 * @param details
	 */
	async backupSetup({
		seed,
		network,
		details,
	}: {
		seed: string;
		network: string;
		details: TBackupServerDetails;
	}): Promise<Result<string>> {
		try {
			const res = await NativeLDK.backupSetup(
				seed,
				network,
				details.host,
				details.serverPubKey,
			);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Restore from remote backup server if one exists
	 * @param bearer
	 * @param overwrite
	 * @returns {Promise<Result<boolean>>} true if backup exists and was restored
	 */
	async restoreFromRemoteBackup({
		overwrite,
	}: {
		overwrite: boolean;
	}): Promise<Result<boolean>> {
		try {
			const res = await NativeLDK.restoreFromRemoteBackup(overwrite);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Runs a self check by creating random string, encrypting, backing up, fetching, decrypting and validating content.
	 */
	async backupSelfCheck(): Promise<Result<string>> {
		try {
			const res = await NativeLDK.backupSelfCheck();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * List all files that have been backed up
	 */
	async backupListFiles(): Promise<Result<TBackedUpFileList>> {
		try {
			const res = await NativeLDK.backupListFiles();
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	async backupFile(fileName: string, content: string): Promise<Result<string>> {
		try {
			const res = await NativeLDK.backupFile(fileName, content);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}

	async fetchBackupFile(fileName: string): Promise<Result<string>> {
		try {
			const res = await NativeLDK.fetchBackupFile(fileName);
			return ok(res);
		} catch (e) {
			return err(e);
		}
	}
}

export default new LDK();
