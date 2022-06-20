import ldk from './ldk';
import { err, ok, Result } from './utils/result';
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
	TRegisterTxEvent,
	TChannelManagerPendingHtlcsForwardable,
	TStorage,
	TGetBestBlock,
	THeader,
	ELdkData,
	TLdkData,
	DefaultLdkDataShape,
	TGetTransactionData,
} from './utils/types';
import { dummyRandomSeed } from './utils/regtest-dev-tools';

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
// Step 16: Initialize routing ProbabilisticScorer [Not sure if required]
// Step 17: Create InvoicePayer ✅
// Step 18: Persist ChannelManager and NetworkGraph
// Step 19: Background Processing

class LightningManager {
	currentBlockHeight: number = 0;
	watchTxs: TRegisterTxEvent[] = [];
	watchOutputs: TRegisterOutputEvent[] = [];
	getBestBlock?: TGetBestBlock = async (): Promise<THeader> => ({
		hex: '',
		hash: '',
		height: 0,
	});
	seed: string = '';
	getItem: TStorage = () => null;
	setItem: TStorage = () => null;
	getTransactionData: TGetTransactionData = async () =>
		err('getTransactionData is not set.');
	network: ENetworks = ENetworks.regtest;

	constructor() {
		// Step 0: Subscribe to all events
		ldk.onEvent(EEventTypes.swift_log, (line) => console.log(`SWIFT: ${line}`));
		ldk.onEvent(EEventTypes.ldk_log, (line) => console.log(`LDK: ${line}`));
		ldk.onEvent(EEventTypes.register_tx, this.onRegisterTx.bind(this));
		ldk.onEvent(EEventTypes.register_output, this.onRegisterOutput.bind(this));
		ldk.onEvent(
			EEventTypes.broadcast_transaction,
			this.onBroadcastTransaction.bind(this),
		);
		ldk.onEvent(EEventTypes.persist_manager, this.onPersistManager.bind(this));
		ldk.onEvent(
			EEventTypes.persist_new_channel,
			this.onPersistNewChannel.bind(this),
		);
		ldk.onEvent(EEventTypes.persist_graph, this.onPersistGraph.bind(this));
		ldk.onEvent(
			EEventTypes.update_persisted_channel,
			this.onUpdatePersistedChannel.bind(this),
		);

		//Channel manager handle events:
		ldk.onEvent(
			EEventTypes.channel_manager_funding_generation_ready,
			this.onChannelManagerFundingGenerationReady.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_received,
			this.onChannelManagerPaymentReceived.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_sent,
			this.onChannelManagerPaymentSent.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_open_channel_request,
			this.onChannelManagerOpenChannelRequest.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_path_successful,
			this.onChannelManagerPaymentPathSuccessful.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_path_failed,
			this.onChannelManagerPaymentPathFailed.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_failed,
			this.onChannelManagerPaymentFailed.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_pending_htlcs_forwardable,
			this.onChannelManagerPendingHtlcsForwardable.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_spendable_outputs,
			this.onChannelManagerSpendableOutputs.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_channel_closed,
			this.onChannelManagerChannelClosed.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_discard_funding,
			this.onChannelManagerDiscardFunding.bind(this),
		);
	}

	/**
	 * Spins up and syncs all processes
	 * @returns {Promise<Err<string> | Ok<string>>}
	 */
	async start({
		seed,
		genesisHash,
		isExistingNode,
		getBestBlock,
		getItem,
		setItem,
		getTransactionData,
		network = ENetworks.regtest,
	}: {
		seed?: string;
		genesisHash: string;
		isExistingNode: boolean;
		getBestBlock: TGetBestBlock;
		getItem: TStorage;
		setItem: TStorage;
		getTransactionData: TGetTransactionData;
		network?: ENetworks;
	}): Promise<Result<string>> {
		if (__DEV__ && !seed) {
			seed = dummyRandomSeed();
		}
		if (!seed) {
			return err(
				'No seed provided. Please pass a seed to the start method and try again.',
			);
		}
		if (!getBestBlock) {
			return err('getBestBlock method not specified in start method.');
		}
		if (!genesisHash) {
			return err(
				'No genesisHash provided. Please pass genesisHash to the start method and try again.',
			);
		}
		if (!setItem) {
			return err(
				'No setItem method provided. Please pass setItem to the start method and try again.',
			);
		}
		if (!getItem) {
			return err(
				'No getItem method provided. Please pass getItem to the start method and try again.',
			);
		}
		if (!getTransactionData) {
			return err('getTransactionData is not set in start method.');
		}
		this.getBestBlock = getBestBlock;
		this.seed = seed;
		this.network = network;
		this.setItem = setItem;
		this.getItem = getItem;
		this.getTransactionData = getTransactionData;
		const bestBlock = await this.getBestBlock();
		if (!bestBlock?.hash || !bestBlock?.hex || !bestBlock?.height) {
			return err(
				'The getBestBlock method is not providing the appropriate block hex, hash or height.',
			);
		}
		this.currentBlockHeight = bestBlock.height;

		const ldkData = await this.getLdkData();

		// Step 1: Initialize the FeeEstimator
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.FeeEstimator.html

		// Set fee estimates
		const feeUpdateRes = await ldk.updateFees({
			highPriority: 1000,
			normal: 500,
			background: 250,
		});
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
		const keysManager = await ldk.initKeysManager(seed);
		if (keysManager.isErr()) {
			return keysManager;
		}

		// Step 7: Read ChannelMonitors state from disk
		let channelData = ldkData[ELdkData.channelData];
		const channelMonitorsRes = await ldk.loadChannelMonitors(
			Object.values(channelData),
		);
		if (channelMonitorsRes.isErr()) {
			return channelMonitorsRes;
		}

		// Step 11: Optional: Initialize the NetGraphMsgHandler
		// [Needs to happen first before ChannelManagerConstructor inside initChannelManager() can be called 🤷️]
		const networkGraph = await ldk.initNetworkGraph(
			//TODO load a cached version once persisted
			genesisHash,
		);
		if (networkGraph.isErr()) {
			return networkGraph;
		}

		// Step 8: Initialize the UserConfig ChannelManager
		const confRes = await ldk.initConfig({
			acceptInboundChannels: true,
			manuallyAcceptInboundChannels: false, //TODO might need to be true if we want to set closing address when blocktank opens with us
			announcedChannels: false,
			minChannelHandshakeDepth: 1, //TODO Verify correct min
		});
		if (confRes.isErr()) {
			return confRes;
		}

		const serializedChannelManager = ldkData[ELdkData.channelManager] ?? '';
		const channelManagerRes = await ldk.initChannelManager({
			network: this.network,
			serializedChannelManager,
			bestBlock,
		});
		if (channelManagerRes.isErr()) {
			return channelManagerRes;
		}

		// Step 9: Sync ChannelMonitors and ChannelManager to chain tip
		if (isExistingNode) {
			// https://github.com/lightningdevkit/ldk-sample/blob/c0a722430b8fbcb30310d64487a32aae839da3e8/src/main.rs#L479
			// Sample app only syncs when restarting an existing node
			return await this.syncLdk();
		}

		// Step 10: Give ChannelMonitors to ChainMonitor
		// TODO Pass these pointers through when we have test channels to restore

		// Step 12: Initialize the PeerManager
		// Done with initChannelManager
		// Step 13: Initialize networking
		// Done with initChannelManager

		return ok('Node running');
	}

	/**
	 * Fetches current best block and sends to LDK to update both channelManager and chainMonitor.
	 * Also watches transactions and outputs for confirmed and unconfirmed transactions and updated LDK.
	 * @returns {Promise<Err<string> | Ok<string>>}
	 */
	async syncLdk(): Promise<Result<string>> {
		if (!this.getBestBlock) {
			return err('No getBestBlock method provided.');
		}
		const bestBlock = await this.getBestBlock();
		const header = bestBlock?.hex;
		const height = bestBlock?.height;

		//Don't update unnecessarily
		if (this.currentBlockHeight !== height) {
			const syncToTip = await ldk.syncToTip({
				header,
				height,
			});
			if (syncToTip.isErr()) {
				return syncToTip;
			}

			this.currentBlockHeight = height;
		}

		//TODO fetch latest data for watchTxs and watchOutputs. Feed any updates to LDK.
		await Promise.all(
			this.watchTxs.map(async ({ txid }, i) => {
				const response = await this.getTransactionData(txid);
				if (response.isErr()) {
					return err(response.error.message);
				}
				if (response.value.height > 0) {
					const pos = this.watchOutputs[i].index;
					await ldk.setTxConfirmed({
						header: response.value.header,
						height: response.value.height,
						transaction: response.value.transaction,
						pos,
					});
				} else {
					/*
					await ldk.setTxUnconfirmed({
						txId: txid,
					});
				*/
				}
			}),
		);

		return ok(`Synced to block ${height}`);
	}

	getLdkData = async (): Promise<TLdkData> => {
		let ldkData = await this.getItem(ELdkData.storageKey);
		return ldkData ? JSON.parse(ldkData) : DefaultLdkDataShape;
	};

	//LDK events

	private onRegisterTx(res: TRegisterTxEvent): void {
		(async () => {
			// Set new/unconfirmed transaction.
			const filterRes = await Promise.all(
				this.watchTxs.filter((watchTx) => {
					if (watchTx.txid === res.txid) {
						return watchTx;
					}
				}),
			);
			if (filterRes.length > 0) {
				await ldk.setTxUnconfirmed({
					txId: res.txid,
				});
			}
			//const ldkData = await this.getLdkData();
			//ldkData[ELdkData.watchTxs].push(res);
			//this.setItem(ELdkData.storageKey, JSON.stringify(ldkData));
		})();
		console.log('onRegisterTx: watchTxs', res);
		this.watchTxs.push(res);
	}

	private onRegisterOutput(res: TRegisterOutputEvent): void {
		/*(async () => {
			const ldkData = await this.getLdkData();
			ldkData[ELdkData.watchOutputs].push(res);
			this.setItem(ELdkData.storageKey, JSON.stringify(ldkData));
		})();*/
		console.log('onRegisterOutput: watchOutputs', res);
		this.watchOutputs.push(res);
	}

	private onBroadcastTransaction(res: TBroadcastTransactionEvent): void {
		console.log(`onBroadcastTransaction: ${res.tx}`); //TODO
	}

	private onPersistManager(res: TPersistManagerEvent): void {
		//Around 8kb for one channel backup stored as a hex string
		(async () => {
			const ldkData = await this.getLdkData();
			ldkData[ELdkData.channelManager] = res.channel_manager;
			this.setItem(ELdkData.storageKey, JSON.stringify(ldkData));
		})();
		console.log('onPersistManager channel_manager', res);
		//console.log(`onPersistManager channel_manager: ${res.channel_manager}`);
	}

	private onPersistNewChannel(res: TChannelBackupEvent): void {
		(async (): Promise<void> => {
			const ldkData = await this.getLdkData();
			ldkData[ELdkData.channelData][`${res.id}`] = res.data;
			this.setItem(ELdkData.storageKey, JSON.stringify(ldkData));
		})();
		console.log('onPersistNewChannel', res);
		//console.log(`onPersistNewChannel: ${res.id} = ${res.data}`);
	}

	private onUpdatePersistedChannel(res: TChannelBackupEvent): void {
		(async (): Promise<void> => {
			const ldkData = await this.getLdkData();
			ldkData[ELdkData.channelData][`${res.id}`] = res.data;
			this.setItem(ELdkData.storageKey, JSON.stringify(ldkData));
		})();
		console.log('onUpdatePersistedChannel', res);
		//console.log(`onUpdatePersistedChannel: ${res.id} = ${res.data}`);
	}

	private onPersistGraph(res: TPersistGraphEvent): void {
		console.log(`onPersistGraph network_graph: ${res.network_graph}`); //TODO
	}

	//LDK channel manager events
	//All events and their values: https://docs.rs/lightning/latest/lightning/util/events/enum.Event.html
	//Sample node for examples on how to handle events: https://github.com/lightningdevkit/ldk-sample/blob/c0a722430b8fbcb30310d64487a32aae839da3e8/src/main.rs#L600
	private onChannelManagerFundingGenerationReady(
		res: TChannelManagerFundingGenerationReady,
	): void {
		console.log(
			`onChannelManagerFundingGenerationReady: ${JSON.stringify(res)}`,
		); //TODO
	}

	private onChannelManagerPaymentReceived(
		res: TChannelManagerPaymentReceived,
	): void {
		if (res.spontaneous_payment_preimage) {
			//https://docs.rs/lightning/latest/lightning/util/events/enum.PaymentPurpose.html#variant.SpontaneousPayment
			ldk.claimFunds(res.spontaneous_payment_preimage).catch(console.error);
		} else {
			ldk.claimFunds(res.payment_preimage).catch(console.error);
		}
		console.log(`onChannelManagerPaymentReceived: ${JSON.stringify(res)}`);
	}

	private onChannelManagerPaymentSent(res: TChannelManagerPaymentSent): void {
		//Nothing to do but notify user
		console.log(`onChannelManagerPaymentSent: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerOpenChannelRequest(
		res: TChannelManagerOpenChannelRequest,
	): void {
		//Nothing to do here unless manuallyAcceptInboundChannels:true in initConfig() above
		console.log(`onChannelManagerOpenChannelRequest: ${JSON.stringify(res)}`);
	}

	private onChannelManagerPaymentPathSuccessful(
		res: TChannelManagerPaymentPathSuccessful,
	): void {
		//Nothing to do here. Optionally notify user?
		console.log(
			`onChannelManagerPaymentPathSuccessful: ${JSON.stringify(res)}`,
		); //TODO
	}

	private onChannelManagerPaymentPathFailed(
		res: TChannelManagerPaymentPathFailed,
	): void {
		console.log(`onChannelManagerPaymentPathFailed: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerPaymentFailed(
		res: TChannelManagerPaymentFailed,
	): void {
		console.log(`onChannelManagerPaymentFailed: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerPendingHtlcsForwardable(
		res: TChannelManagerPendingHtlcsForwardable,
	): void {
		console.log('onChannelManagerPendingHtlcsForwardable', res);
		ldk.processPendingHtlcForwards().catch(console.error);
	}

	private onChannelManagerSpendableOutputs(
		res: TChannelManagerSpendableOutputs,
	): void {
		//Needs to call keysManager.spend_spendable_outputs to send to change address or on chain wallet could keep output and use in its own tx? I don't know
		console.log(`onChannelManagerSpendableOutputs: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerChannelClosed(
		res: TChannelManagerChannelClosed,
	): void {
		console.log(`onChannelManagerChannelClosed: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerDiscardFunding(
		res: TChannelManagerDiscardFunding,
	): void {
		//Wallet should probably "lock" the UTXOs spent in funding transactions until the funding transaction either confirms, or this event is generated.
		console.log(`onChannelManagerDiscardFunding: ${JSON.stringify(res)}`); //TODO
	}
}

export default new LightningManager();
