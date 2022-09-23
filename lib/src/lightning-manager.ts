import ldk from './ldk';
import { err, ok, Result } from './utils/result';
import {
	DefaultLdkDataShape,
	DefaultTransactionDataShape,
	EEventTypes,
	ELdkData,
	ELdkLogLevels,
	ENetworks,
	TAccount,
	TAccountBackup,
	TAddPeerReq,
	TBroadcastTransactionEvent,
	TChannelManagerChannelClosed,
	TChannelManagerDiscardFunding,
	TChannelManagerFundingGenerationReady,
	TChannelManagerOpenChannelRequest,
	TChannelManagerPayment,
	TChannelManagerPaymentFailed,
	TChannelManagerPaymentPathFailed,
	TChannelManagerPaymentPathSuccessful,
	TChannelManagerPaymentSent,
	TChannelManagerPendingHtlcsForwardable,
	TChannelManagerSpendableOutputs,
	TGetBestBlock,
	TGetTransactionData,
	THeader,
	TLdkPeers,
	TLdkStart,
	TPeer,
	TRegisterOutputEvent,
	TRegisterTxEvent,
	TStorage,
	TTransactionData,
} from './utils/types';
import {
	getAllStorageKeys,
	getLdkStorageKey,
	parseData,
	setAndGetMethodCheck,
	startParamCheck,
} from './utils/helpers';

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
	currentBlock: THeader = {
		hex: '',
		hash: '',
		height: 0,
	};
	watchTxs: TRegisterTxEvent[] = [];
	watchOutputs: TRegisterOutputEvent[] = [];
	getBestBlock: TGetBestBlock = async (): Promise<THeader> => ({
		hex: '',
		hash: '',
		height: 0,
	});
	account: TAccount = {
		name: '',
		seed: '',
	};
	getItem: TStorage = (): null => null;
	setItem: TStorage = (): null => null;
	updateStorage: TStorage = (): null => null;
	getTransactionData: TGetTransactionData =
		async (): Promise<TTransactionData> => DefaultTransactionDataShape;
	network: ENetworks = ENetworks.regtest;
	logFilePath = '';

	constructor() {
		// Step 0: Subscribe to all events
		ldk.onEvent(EEventTypes.native_log, (line) =>
			console.log(`NATIVE LOG: ${line}`),
		);
		ldk.onEvent(EEventTypes.ldk_log, (line) => console.log(`LDK: ${line}`));
		ldk.onEvent(EEventTypes.register_tx, this.onRegisterTx.bind(this));
		ldk.onEvent(EEventTypes.register_output, this.onRegisterOutput.bind(this));
		ldk.onEvent(
			EEventTypes.broadcast_transaction,
			this.onBroadcastTransaction.bind(this),
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
		ldk.onEvent(
			EEventTypes.channel_manager_payment_claimed,
			this.onChannelManagerPaymentClaimed.bind(this),
		);
	}

	/**
	 * Spins up and syncs all processes
	 * @param {string} seed
	 * @param {string} genesisHash
	 * @param {TGetBestBlock} getBestBlock
	 * @param {TStorage} getItem
	 * @param {TStorage} setItem
	 * @param {TGetTransactionData} getTransactionData
	 * @param {ENetworks} network
	 * @returns {Promise<Result<string>>}
	 */
	async start({
		account,
		genesisHash,
		getBestBlock,
		getItem,
		setItem,
		storagePath,
		getTransactionData,
		network = ENetworks.regtest,
	}: TLdkStart): Promise<Result<string>> {
		if (!account) {
			return err(
				'No account provided. Please pass an account object containing the name & seed to the start method and try again.',
			);
		}
		if (!account?.name || !account?.seed) {
			return err(
				'No account name or seed provided. Please pass an account object containing the name & seed to the start method and try again.',
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

		// Ensure the start params function as expected.
		const paramCheckResponse = await startParamCheck({
			account,
			genesisHash,
			getBestBlock,
			getItem,
			setItem,
			storagePath,
			getTransactionData,
			network,
		});
		if (paramCheckResponse.isErr()) {
			return err(paramCheckResponse.error.message);
		}

		this.getBestBlock = getBestBlock;
		this.account = account;
		this.network = network;
		this.setItem = setItem;
		this.updateStorage = (key, value): void => {
			this.setItem(key, value);
			this.updateTimestamp();
		};
		this.getItem = getItem;
		this.getTransactionData = getTransactionData;
		const bestBlock = await this.getBestBlock();
		this.currentBlock = bestBlock;
		this.watchTxs = [];
		this.watchOutputs = [];

		//The path all wallet and network graph persistence will be saved to
		const storagePathRes = await ldk.setStoragePath(storagePath);
		if (storagePathRes.isErr()) {
			return storagePathRes;
		}

		this.logFilePath = `${storagePath}/logs/${Date.now()}.log`;
		const logFilePathRes = await ldk.setLogFilePath(this.logFilePath);
		if (logFilePathRes.isErr()) {
			return logFilePathRes;
		}

		//Validate we didn't change the seed for this account if one exists
		const readSeed = await ldk.readFromFile('seed', 'hex');
		if (readSeed.isErr()) {
			if (readSeed.code === 'file_does_not_exist') {
				//Have not yet saved the seed to disk
				const writeRes = await ldk.writeToFile('seed', account.seed, 'hex');
				if (writeRes.isErr()) {
					return err(writeRes.error);
				}
			} else {
				return err(readSeed.error);
			}
		} else {
			//Cannot start an existing node with a different seed
			if (readSeed.value !== account.seed) {
				return err('Seed for current node cannot be changed.');
			}
		}

		// Step 1: Initialize the FeeEstimator
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.FeeEstimator.html

		// Set fee estimates
		const feeUpdateRes = await ldk.updateFees({
			highPriority: 12500,
			normal: 12500,
			background: 12500,
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
		await ldk.setLogLevel(ELdkLogLevels.debug, true);

		//TODO might not always need this one as they make the logs a little noisy
		// await ldk.setLogLevel(ELdkLogLevels.trace, true);

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
		const keysManager = await ldk.initKeysManager(this.account.seed);
		if (keysManager.isErr()) {
			return keysManager;
		}

		// Step 7: Read ChannelMonitors state from disk
		// Handled in initChannelManager below

		// Step 11: Optional: Initialize the NetGraphMsgHandler
		const networkGraphRes = await ldk.initNetworkGraph({
			genesisHash,
		});
		if (networkGraphRes.isErr()) {
			return networkGraphRes;
		}

		// Step 8: Initialize the UserConfig ChannelManager
		const confRes = await ldk.initConfig({
			acceptInboundChannels: true,
			manuallyAcceptInboundChannels: false,
			announcedChannels: false,
			minChannelHandshakeDepth: 1, //TODO Verify correct min
		});
		if (confRes.isErr()) {
			return confRes;
		}

		const channelManagerRes = await ldk.initChannelManager({
			network: this.network,
			bestBlock,
		});
		if (channelManagerRes.isErr()) {
			return channelManagerRes;
		}

		// Add Peers
		const peers = await this.getPeers();
		await Promise.all(
			peers.map((peer: TPeer) => {
				this.addPeer({ ...peer, timeout: 4000 });
			}),
		);

		// Step 9: Sync ChannelMonitors and ChannelManager to chain tip
		await this.syncLdk();

		// Step 10: Give ChannelMonitors to ChainMonitor

		// Step 12: Initialize the PeerManager
		// Done with initChannelManager
		// Step 13: Initialize networking
		// Done with initChannelManager

		return ok('Node running');
	}

	/**
	 * Fetches current best block and sends to LDK to update both channelManager and chainMonitor.
	 * Also watches transactions and outputs for confirmed and unconfirmed transactions and updates LDK.
	 * @returns {Promise<Result<string>>}
	 */
	async syncLdk(): Promise<Result<string>> {
		if (!this.getBestBlock) {
			return err('No getBestBlock method provided.');
		}
		const bestBlock = await this.getBestBlock();
		const header = bestBlock?.hex;
		const height = bestBlock?.height;

		//Don't update unnecessarily
		if (this.currentBlock.hash !== bestBlock?.hash) {
			const syncToTip = await ldk.syncToTip({
				header,
				height,
			});
			if (syncToTip.isErr()) {
				return syncToTip;
			}

			this.currentBlock = bestBlock;
		}

		// Iterate over watch transactions and set whether they are confirmed or unconfirmed.
		await Promise.all(
			this.watchTxs.map(async ({ txid }, i) => {
				const response = await this.getTransactionData(txid);
				if (!response?.header || !response.transaction) {
					return err(
						'Unable to retrieve transaction data from the getTransactionData method.',
					);
				}
				if (response.height > 0) {
					const pos = this.watchOutputs[i].index;
					await ldk.setTxConfirmed({
						header: response.header,
						height: response.height,
						txData: [{ transaction: response.transaction, pos }], //TODO can be used to batch this call
					});
				} else {
					await ldk.setTxUnconfirmed({
						txId: txid,
					});
				}
			}),
		);

		return ok(`Synced to block ${height}`);
	}

	/**
	 * Passes a peer to LDK to add and saves it to storage if successful.
	 * @param {string} pubKey
	 * @param {string} address
	 * @param {number} port
	 * @param {number} timeout
	 * @returns {Promise<Result<string>>}
	 */
	addPeer = async ({
		pubKey,
		address,
		port,
		timeout,
	}: TAddPeerReq): Promise<Result<string>> => {
		const peer: TPeer = { pubKey, address, port };
		const addPeerResponse = await ldk.addPeer({
			...peer,
			timeout,
		});
		if (addPeerResponse.isErr()) {
			return err(addPeerResponse.error.message);
		}
		this.saveLdkPeerData(peer).then().catch(console.error);
		return ok(addPeerResponse.value);
	};

	/**
	 * Removes the specified peer from storage.
	 * @param {string} pubKey
	 * @param {string} address
	 * @param {number} port
	 * @returns {Promise<Result<TPeer[]>>}
	 */
	removePeer = async ({
		pubKey,
		address,
		port,
	}: TAddPeerReq): Promise<Result<TPeer[]>> => {
		const peers = await this.getPeers();
		const newPeers = peers.filter(
			(p) => p.pubKey !== pubKey && p.address !== address && p.port !== port,
		);
		const storageKey = getLdkStorageKey(this.account.name, ELdkData.peers);
		this.updateStorage(storageKey, JSON.stringify(newPeers));
		return ok(newPeers);
	};

	/**
	 * Returns saved peers from storage for the current seed.
	 * @returns {Promise<TLdkPeers>}
	 */
	getPeers = async (): Promise<TLdkPeers> => {
		try {
			const storageKey = getLdkStorageKey(this.account.name, ELdkData.peers);
			const peers = await this.getItem(storageKey);
			return parseData(peers, DefaultLdkDataShape[ELdkData.peers]);
		} catch {
			return DefaultLdkDataShape[ELdkData.peers];
		}
	};

	/**
	 * This method is used to import backups provided by react-native-ldk's backupAccount method.
	 * @param {TAccountBackup} accountData
	 * @param {Function} setItem
	 * @param {Function} getItem
	 * @param {boolean} [overwrite] Determines if this function should overwrite an existing account of the same name.
	 * @returns {Promise<Result<TAccount>>} TAccount is used to start the node using the newly imported and saved data.
	 */
	importAccount = async ({
		backup,
		setItem,
		getItem, //TODO pass storage path instead
		overwrite = false,
	}: {
		backup: string | TAccountBackup;
		setItem: TStorage;
		getItem: TStorage;
		overwrite?: boolean;
	}): Promise<Result<TAccount>> => {
		try {
			if (!backup) {
				return err('No backup was provided for import.');
			}
			let accountBackup: TAccountBackup;
			if (typeof backup === 'string') {
				try {
					accountBackup = JSON.parse(backup);
				} catch {
					return err('Invalid backup string.');
				}
			} else if (typeof backup === 'object') {
				// It's possible the dev passed the TAccountBackup object instead of the JSON string.
				accountBackup = backup;
			} else {
				return err('Invalid backup. Unable to import.');
			}
			if (!accountBackup?.account.name) {
				return err('No account name was provided in the accountBackup object.');
			}
			if (!accountBackup?.account.seed) {
				return err('No seed was provided in the accountBackup object.');
			}
			if (!accountBackup?.data) {
				return err('No data was provided in the accountBackup object.');
			}
			if (!(ELdkData.peers in accountBackup.data)) {
				return err(
					`Invalid account backup data. Please ensure the following keys exist in the accountBackup object: ${ELdkData.peers}`,
				);
			}

			//Retrieve all storage keys for the provided account name.
			const storageKeys = await getAllStorageKeys(accountBackup.account.name);

			// Check that an account of this name doesn't already exist.
			const timestamp = await getItem(storageKeys[ELdkData.timestamp]);

			// Ensure the user is not attempting to import an old/stale backup.
			if (!overwrite && accountBackup.data?.timestamp <= timestamp) {
				const msg =
					accountBackup.data?.timestamp < timestamp
						? 'This appears to be an old backup. The stored backup is more recent than the backup trying to be imported.'
						: 'No need to import. The backup timestamps match.';
				return err(msg);
			}

			// Check that we're properly connected to the device's storage and that the setItem & getItem methods work as expected.
			const setAndGetCheckResponse = await setAndGetMethodCheck({
				setItem,
				getItem,
			});
			if (setAndGetCheckResponse.isErr()) {
				return err(setAndGetCheckResponse.error.message);
			}

			//Save the provided backup data using the storage keys.
			//TODO write channel manager to file natively
			setItem(
				storageKeys[ELdkData.peers],
				JSON.stringify(accountBackup.data[ELdkData.peers]),
			);

			setItem(
				storageKeys[ELdkData.timestamp],
				JSON.stringify(accountBackup.data[ELdkData.timestamp]),
			);

			//Return the saved account info.
			return ok(accountBackup.account);
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * Used to backup the data that corresponds with the provided account.
	 * @param {TAccount} account
	 * @param {TStorage} setItem
	 * @param {TStorage} getItem
	 * @returns {string} This string can be used to import/restore this LDK account via importAccount.
	 */
	backupAccount = async ({
		account,
		setItem,
		getItem,
	}: {
		account: TAccount;
		setItem: TStorage;
		getItem: TStorage;
	}): Promise<Result<string>> => {
		try {
			if (!account || !this?.account) {
				return err(
					'No account provided. Please pass an account object containing the name & seed to the start method and try again.',
				);
			}
			if (!account) {
				account = this.account;
			}
			if (!account?.name || !account?.seed) {
				return err(
					'No account name or seed provided. Please pass an account object containing the name & seed to the start method and try again.',
				);
			}
			//Check that we're properly connected to the device's storage.
			//While setItem is not needed in the backupAccount method we still need to check that the getItem method works as expected.
			const setAndGetCheckResponse = await setAndGetMethodCheck({
				setItem,
				getItem,
			});
			if (setAndGetCheckResponse.isErr()) {
				return err(setAndGetCheckResponse.error.message);
			}
			const storageKeys = await getAllStorageKeys(account.name);
			const channelManager = ''; //TODO get natively
			const channelData = ''; //TODO get natively
			const peers = await getItem(storageKeys[ELdkData.peers]);
			const timestamp = await getItem(storageKeys[ELdkData.timestamp]);
			const accountBackup: TAccountBackup = {
				account,
				data: {
					[ELdkData.peers]: parseData(
						peers,
						DefaultLdkDataShape[ELdkData.peers],
					),
					[ELdkData.timestamp]: parseData(
						timestamp,
						DefaultLdkDataShape[ELdkData.timestamp],
					),
				},
			};
			return ok(JSON.stringify(accountBackup));
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * Adds an individual peer to storage.
	 * @param {TPeer} peer
	 * @returns {Promise<void>}
	 */
	private saveLdkPeerData = async (peer: TPeer): Promise<void> => {
		const peers = await this.getPeers();
		const duplicatePeerArr = peers.filter(
			(p) => p.pubKey === peer.pubKey && p.address === peer.address,
		);
		if (duplicatePeerArr.length > 0) {
			return;
		}
		peers.push(peer);
		const storageKey = getLdkStorageKey(this.account.name, ELdkData.peers);
		this.updateStorage(storageKey, JSON.stringify(peers));
	};

	private updateTimestamp = (): void => {
		const storageKey = getLdkStorageKey(this.account.name, ELdkData.timestamp);
		const date = Date.now();
		this.setItem(storageKey, JSON.stringify(date));
	};

	//LDK events

	private onRegisterTx(res: TRegisterTxEvent): void {
		this.watchTxs.push(res);
	}

	private onRegisterOutput(res: TRegisterOutputEvent): void {
		//TODO check for duplicates first
		this.watchOutputs.push(res);
	}

	private onBroadcastTransaction(res: TBroadcastTransactionEvent): void {
		console.log(`onBroadcastTransaction: ${res.tx}`); //TODO
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

	private onChannelManagerPaymentReceived(res: TChannelManagerPayment): void {
		if (res.spontaneous_payment_preimage) {
			//https://docs.rs/lightning/latest/lightning/util/events/enum.PaymentPurpose.html#variant.SpontaneousPayment
			ldk.claimFunds(res.spontaneous_payment_preimage).catch(console.error);
		} else {
			ldk.claimFunds(res.payment_preimage).catch(console.error);
		}
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
		ldk.processPendingHtlcForwards().catch(console.error);
	}

	private async onChannelManagerSpendableOutputs(
		res: TChannelManagerSpendableOutputs,
	): Promise<void> {
		const spendRes = await ldk.spendOutputs({
			descriptorsSerialized: res.outputsSerialized,
			outputs: [], //Shouldn't need to specify this if we're sweeping all funds to dest script
			change_destination_script:
				'a91407694cfd2bd43f4e0fe285a4d013456cb58d7eab87', //TODO should be configurable
			feerate_sat_per_1000_weight: 1000, //TODO should this be rather be priority ('high' | 'normal' | 'low') instead of a value?
		});

		if (spendRes.isErr()) {
			//TODO should we notify user?
			console.error(spendRes.error);
			return;
		}

		this.onBroadcastTransaction({ tx: spendRes.value });

		console.log(`onChannelManagerSpendableOutputs: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerChannelClosed(
		res: TChannelManagerChannelClosed,
	): void {
		console.log(`onChannelManagerChannelClosed: ${JSON.stringify(res)}`); //TODO remove from storage or mark as closed so we don't try restore
	}

	private onChannelManagerDiscardFunding(
		res: TChannelManagerDiscardFunding,
	): void {
		//Wallet should probably "lock" the UTXOs spent in funding transactions until the funding transaction either confirms, or this event is generated.
		console.log(`onChannelManagerDiscardFunding: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerPaymentClaimed(res: TChannelManagerPayment): void {
		console.log(`onChannelManagerPaymentClaimed: ${JSON.stringify(res)}`); //TODO
	}
}

export default new LightningManager();
