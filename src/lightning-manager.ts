import ldk from './ldk';
import { ok, Result } from './utils/result';
import {
	EEventTypes,
	ELdkLogLevels,
	ENetworks,
	TBroadcastTransactionEvent,
	TChannelBackupEvent,
	TChannelManagerChannelClosed,
	TChannelManagerFundingGenerationReady,
	TChannelManagerOpenChannelRequest,
	TChannelManagerPaymentFailed,
	TChannelManagerPaymentPathFailed,
	TChannelManagerPaymentPathSuccessful,
	TChannelManagerPaymentReceived,
	TChannelManagerPaymentSent,
	TChannelManagerSpendableOutputs,
	TChannelManagerDiscardFunding,
	TPersistGraphEvent,
	TPersistManagerEvent,
	TRegisterOutputEvent,
	TRegisterTxEvent
} from './utils/types';
import {
	dummyRandomSeed,
	regtestBestBlock,
	regtestBlockHeaderHex,
	regtestGenesisBlockHash
} from './utils/regtest-dev-tools';

//TODO startup steps
// Step 0: Listen for events ✅
// Step 1: Initialize the FeeEstimator ✅
// Step 2: Initialize the Logger ✅
// Step 3: Initialize the BroadcasterInterface ✅
// Step 4: Initialize Persist ✅
// Step 5: Initialize the ChainMonitor ✅
// Step 6: Initialize the KeysManager ✅
// Step 7: Read ChannelMonitor state from disk ✅
// Step 8: Initialize the ChannelManager ✅
// Step 9: Sync ChannelMonitors and ChannelManager to chain tip ✅
// Step 10: Give ChannelMonitors to ChainMonitor
// Step 11: Optional: Initialize the NetGraphMsgHandler [Not required for a non routing node]
// Step 12: Initialize the PeerManager ✅
// Step 13: Initialize networking ✅
// Step 14: Connect and Disconnect Blocks ✅
// Step 15: Handle LDK Events [WIP]
// Step 16: Initialize routing ProbabilisticScorer
// Step 17: Create InvoicePayer
// Step 18: Persist ChannelManager and NetworkGraph
// Step 19: Background Processing

class LightningManager {
	currentBlockHash = '';

	constructor() {
		// Step 0: Subscribe to all events
		ldk.onEvent(EEventTypes.swift_log, (line) => console.log(`SWIFT: ${line}`));
		ldk.onEvent(EEventTypes.ldk_log, (line) => console.log(`LDK: ${line}`));
		ldk.onEvent(EEventTypes.register_tx, this.onRegisterTx.bind(this));
		ldk.onEvent(EEventTypes.register_output, this.onRegisterOutput.bind(this));
		ldk.onEvent(EEventTypes.broadcast_transaction, this.onBroadcastTransaction.bind(this));
		ldk.onEvent(EEventTypes.persist_manager, this.onPersistManager.bind(this));
		ldk.onEvent(EEventTypes.persist_new_channel, this.onPersistNewChannel.bind(this));
		ldk.onEvent(EEventTypes.persist_graph, this.onPersistGraph.bind(this));
		ldk.onEvent(EEventTypes.update_persisted_channel, this.onUpdatePersistedChannel.bind(this));

		//Channel manager handle events:
		ldk.onEvent(
			EEventTypes.channel_manager_funding_generation_ready,
			this.onChannelManagerFundingGenerationReady.bind(this)
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_received,
			this.onChannelManagerPaymentReceived.bind(this)
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_sent,
			this.onChannelManagerPaymentSent.bind(this)
		);
		ldk.onEvent(
			EEventTypes.channel_manager_open_channel_request,
			this.onChannelManagerOpenChannelRequest.bind(this)
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_path_successful,
			this.onChannelManagerPaymentPathSuccessful.bind(this)
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_path_failed,
			this.onChannelManagerPaymentPathFailed.bind(this)
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_failed,
			this.onChannelManagerPaymentFailed.bind(this)
		);
		ldk.onEvent(
			EEventTypes.channel_manager_spendable_outputs,
			this.onChannelManagerSpendableOutputs.bind(this)
		);
		ldk.onEvent(
			EEventTypes.channel_manager_channel_closed,
			this.onChannelManagerChannelClosed.bind(this)
		);
		ldk.onEvent(
			EEventTypes.channel_manager_discard_funding,
			this.onChannelManagerDiscardFunding.bind(this)
		);
	}

	/**
	 * Spins up and syncs all processes
	 * @returns {Promise<Err<string> | Ok<string>>}
	 */
	async start(): Promise<Result<string>> {
		const bestBlock = await regtestBestBlock();
		const isExistingNode = false;

		// Step 1: Initialize the FeeEstimator
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.FeeEstimator.html

		// Set fee estimates
		const feeUpdateRes = await ldk.updateFees({ highPriority: 1000, normal: 500, background: 250 });
		if (feeUpdateRes.isErr()) {
			return feeUpdateRes;
		}

		// Step 2: Initialize the Logger
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/util/logger/index.html

		//Switch on log levels we're interested in. All levels are false by default.
		await ldk.setLogLevel(ELdkLogLevels.info, true);
		await ldk.setLogLevel(ELdkLogLevels.warn, true);
		await ldk.setLogLevel(ELdkLogLevels.error, true);

		//TODO might not always need these ones as they make the logs a little noisy
		// await ldk.setLogLevel(ELdkLogLevels.trace, true);
		// await ldk.setLogLevel(ELdkLogLevels.debug, true);

		// Step 3: Initialize the BroadcasterInterface
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.BroadcasterInterface.html

		// Step 4: Initialize Persist
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/chain/chainmonitor/trait.Persist.html

		// Step 5: Initialize the ChainMonitor
		const chainMonitorRes = await ldk.initChainMonitor();
		if (chainMonitorRes.isErr()) {
			return chainMonitorRes;
		}

		// Step 6: Initialize the KeysManager
		const keysManager = await ldk.initKeysManager(dummyRandomSeed()); //TODO get real stored/generated 32-byte entropy
		if (keysManager.isErr()) {
			return keysManager;
		}

		// Step 7: Read ChannelMonitors state from disk
		const channelMonitorsRes = await ldk.loadChannelMonitors([]);
		if (channelMonitorsRes.isErr()) {
			return channelMonitorsRes;
		}

		// Step 11: Optional: Initialize the NetGraphMsgHandler
		// [Needs to happen first before ChannelManagerConstructor inside initChannelManager() can be called 🤷️]
		const genesisHash = await regtestGenesisBlockHash();
		const networkGraph = await ldk.initNetworkGraph(
			//TODO load a cached version once persisted
			genesisHash
		);
		if (networkGraph.isErr()) {
			return networkGraph;
		}

		// Step 8: Initialize the UserConfig ChannelManager
		const confRes = await ldk.initConfig({
			acceptInboundChannels: true,
			manuallyAcceptInboundChannels: false, //TODO might need to be true if we want to set closing address when blocktank opens with us
			announcedChannels: false,
			minChannelHandshakeDepth: 1 //TODO Verify correct min
		});
		if (confRes.isErr()) {
			return confRes;
		}

		const channelManagerRes = await ldk.initChannelManager({
			network: ENetworks.regtest,
			serializedChannelManager: '', //TODO [UNTESTED]
			bestBlock: {
				hash: bestBlock.bestblockhash,
				height: bestBlock.blocks
			}
		});
		if (channelManagerRes.isErr()) {
			return channelManagerRes;
		}

		// Step 9: Sync ChannelMonitors and ChannelManager to chain tip
		if (!isExistingNode) {
			// https://github.com/lightningdevkit/ldk-sample/blob/c0a722430b8fbcb30310d64487a32aae839da3e8/src/main.rs#L479
			// Sample app only syncs when restarting an existing node
			await this.syncToChain();
		}

		// Step 10: Give ChannelMonitors to ChainMonitor
		// TODO Pass these pointers through when we have test channels to restore

		// Step 12: Initialize the PeerManager
		// Done with initChannelManager
		// Step 13: Initialize networking
		// Done with initChannelManager

		this.keepBlockchainInSync();

		return ok('Node running');
	}

	/**
	 * Keeps polling for best block.
	 * TODO this should subscribe (electrum?) somewhere instead of polling.
	 * @returns {Promise<void>}
	 */
	keepBlockchainInSync() {
		setInterval(this.syncToChain, 2500);
	}

	/**
	 * Fetches current best block and sends to LDK.
	 * Updates both channelManager and chainMonitor.
	 * @returns {Promise<Err<string> | Ok<string>>}
	 */
	async syncToChain() {
		const { bestblockhash, blocks } = await regtestBestBlock();

		if (this.currentBlockHash === bestblockhash) {
			return; //No need to update
		}

		const header = await regtestBlockHeaderHex(bestblockhash);
		const syncToTip = await ldk.syncToTip({
			header,
			height: blocks
		});
		if (syncToTip.isErr()) {
			return syncToTip;
		}

		this.currentBlockHash = bestblockhash;

		return ok(`Synced to block ${blocks}`);
	}

	//LDK events

	private onRegisterTx(res: TRegisterTxEvent) {
		console.log(`onRegisterTx: ${res.txid} = ${res.script_pubkey}`); //TODO
	}

	private onRegisterOutput(res: TRegisterOutputEvent) {
		console.log(`onRegisterOutput: ${res.script_pubkey}`); //TODO
	}

	private onBroadcastTransaction(res: TBroadcastTransactionEvent) {
		console.log(`onBroadcastTransaction: ${res.tx}`); //TODO
	}

	private onPersistManager(res: TPersistManagerEvent) {
		//Around 8kb for one channel backup stored as a hex string
		console.log(`onPersistManager channel_manager: ${res.channel_manager}`); //TODO
	}

	private onPersistNewChannel(res: TChannelBackupEvent) {
		console.log(`onPersistNewChannel: ${res.id} = ${res.data}`); //TODO
	}

	private onUpdatePersistedChannel(res: TChannelBackupEvent) {
		console.log(`onUpdatePersistedChannel: ${res.id} = ${res.data}`); //TODO
	}

	private onPersistGraph(res: TPersistGraphEvent) {
		console.log(`onPersistGraph network_graph: ${res.network_graph}`); //TODO
	}

	//LDK channel manager events
	//All events and their values: https://docs.rs/lightning/latest/lightning/util/events/enum.Event.html
	//Sample node for examples on how to handle events: https://github.com/lightningdevkit/ldk-sample/blob/c0a722430b8fbcb30310d64487a32aae839da3e8/src/main.rs#L600
	private onChannelManagerFundingGenerationReady(res: TChannelManagerFundingGenerationReady) {
		console.log(`onChannelManagerFundingGenerationReady: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerPaymentReceived(res: TChannelManagerPaymentReceived) {
		//TODO call channelManager.claim_funds(payment_preimage: paymentPreimage) if spontaneous_payment_preimage is not a blank string as
		//https://docs.rs/lightning/latest/lightning/util/events/enum.PaymentPurpose.html#variant.SpontaneousPayment
		//If not a spontaneous payment then nothing to do but notify user invoice was paid
		console.log(`onChannelManagerPaymentReceived: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerPaymentSent(res: TChannelManagerPaymentSent) {
		//Nothing to do but notify user
		console.log(`onChannelManagerPaymentSent: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerOpenChannelRequest(res: TChannelManagerOpenChannelRequest) {
		//Nothing to do here unless manuallyAcceptInboundChannels:true in initConfig() above
		console.log(`onChannelManagerOpenChannelRequest: ${JSON.stringify(res)}`);
	}

	private onChannelManagerPaymentPathSuccessful(res: TChannelManagerPaymentPathSuccessful) {
		//Nothing to here. Optionally notify user?
		console.log(`onChannelManagerPaymentPathSuccessful: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerPaymentPathFailed(res: TChannelManagerPaymentPathFailed) {
		console.log(`onChannelManagerPaymentPathFailed: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerPaymentFailed(res: TChannelManagerPaymentFailed) {
		console.log(`onChannelManagerPaymentFailed: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerSpendableOutputs(res: TChannelManagerSpendableOutputs) {
		//Needs to call keysManager.spend_spendable_outputs to send to change address or on chain wallet could keep output and use in its own tx? I don't know
		console.log(`onChannelManagerSpendableOutputs: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerChannelClosed(res: TChannelManagerChannelClosed) {
		console.log(`onChannelManagerChannelClosed: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerDiscardFunding(res: TChannelManagerDiscardFunding) {
		//Wallet should probably "lock" the UTXOs spent in funding transactions until the funding transaction either confirms, or this event is generated.
		console.log(`onChannelManagerDiscardFunding: ${JSON.stringify(res)}`); //TODO
	}
}

export default new LightningManager();
