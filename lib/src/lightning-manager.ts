import ldk from './ldk';
import { err, ok, Result } from './utils/result';
import {
	DefaultLdkDataShape,
	DefaultTransactionDataShape,
	EEventTypes,
	ELdkData,
	ELdkFiles,
	ELdkLogLevels,
	ENetworks,
	TAccount,
	TAccountBackup,
	TAddPeerReq,
	TBroadcastTransaction,
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
	TGetAddress,
	TGetScriptPubKeyHistory,
	TGetScriptPubKeyHistoryResponse,
	TGetBestBlock,
	TGetTransactionData,
	THeader,
	TLdkPeers,
	TLdkStart,
	TPeer,
	TRegisterOutputEvent,
	TRegisterTxEvent,
	TTransactionData,
	TLdkConfirmedOutputs,
	TLdkConfirmedTransactions,
	TLdkBroadcastedTransactions,
	TChannelUpdate,
	TPaymentReq,
	TPaymentTimeoutReq,
	TLdkPaymentIds,
	TNetworkGraphUpdated,
	TGetTransactionPosition,
	TTransactionPosition,
	TChannel,
} from './utils/types';
import {
	appendPath,
	parseData,
	promiseTimeout,
	startParamCheck,
} from './utils/helpers';
import * as bitcoin from 'bitcoinjs-lib';
import { networks } from 'bitcoinjs-lib';
import { EmitterSubscription } from 'react-native';

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
// Step 10: Give ChannelMonitors to ChainMonitor ✅
// Step 11: Optional: Initialize the NetGraphMsgHandler [Not required for a non routing node]
// Step 12: Initialize the PeerManager ✅
// Step 13: Initialize networking ✅
// Step 14: Connect and Disconnect Blocks ✅
// Step 15: Handle LDK Events ✅
// Step 16: Initialize routing ProbabilisticScorer [Not sure if required]
// Step 17: Create InvoicePayer ✅
// Step 18: Persist ChannelManager and NetworkGraph ✅
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
	backupSubscriptions: {
		[id: string]: (backup: Result<TAccountBackup>) => void;
	} = {};
	backupSubscriptionsId = 0;
	backupSubscriptionsDebounceTimer: NodeJS.Timeout | undefined = undefined;
	getTransactionData: TGetTransactionData =
		async (): Promise<TTransactionData> => DefaultTransactionDataShape;
	getTransactionPosition: TGetTransactionPosition =
		async (): Promise<TTransactionPosition> => -1;
	network: ENetworks = ENetworks.regtest;
	baseStoragePath = '';
	logFilePath = '';
	getAddress: TGetAddress = async (): Promise<string> => '';
	getScriptPubKeyHistory: TGetScriptPubKeyHistory = async (): Promise<
		TGetScriptPubKeyHistoryResponse[]
	> => [];
	broadcastTransaction: TBroadcastTransaction = async (): Promise<any> => {};
	feeRate: number = 1000; // feerate_sat_per_1000_weight
	pathFailedSubscription: EmitterSubscription | undefined;
	paymentFailedSubscription: EmitterSubscription | undefined;
	paymentSentSubscription: EmitterSubscription | undefined;

	constructor() {
		// Step 0: Subscribe to all events
		ldk.onEvent(EEventTypes.native_log, (line) => {
			if (line.indexOf('Could not locate file at') > -1) {
				//Not an important error
				return;
			}
			console.log(`react-native-ldk: ${line}`);
		});
		ldk.onEvent(EEventTypes.ldk_log, (line) => console.log(`LDK: ${line}`));
		ldk.onEvent(EEventTypes.register_tx, this.onRegisterTx.bind(this));
		ldk.onEvent(EEventTypes.register_output, this.onRegisterOutput.bind(this));
		ldk.onEvent(
			EEventTypes.broadcast_transaction,
			this.onBroadcastTransaction.bind(this),
		);

		ldk.onEvent(EEventTypes.backup, this.onLdkBackupEvent.bind(this));

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
		ldk.onEvent(
			EEventTypes.emergency_force_close_channel,
			this.onEmergencyForceCloseChannel.bind(this),
		);
		ldk.onEvent(
			EEventTypes.network_graph_updated,
			this.onNetworkGraphUpdated.bind(this),
		);
	}

	/**
	 * Sets storage path on disk where all wallet accounts will be
	 * stored in subdirectories
	 * @param path
	 * @returns {Promise<Ok<string>>}
	 */
	async setBaseStoragePath(path: string): Promise<Result<string>> {
		const storagePath = appendPath(path, ''); //Adds slash if missing
		//Storage path will be validated and created when calling ldk.setAccountStoragePath
		this.baseStoragePath = storagePath;
		return ok('Storage set');
	}

	/**
	 * Spins up and syncs all processes
	 * @param {string} seed
	 * @param {string} genesisHash
	 * @param {TGetBestBlock} getBestBlock
	 * @param {TGetTransactionData} getTransactionData
	 * @param {TGetAddress} getAddress
	 * @param {ENetworks} network
	 * @returns {Promise<Result<string>>}
	 */
	async start({
		account,
		genesisHash,
		getBestBlock,
		getTransactionData,
		getTransactionPosition,
		getAddress,
		getScriptPubKeyHistory,
		broadcastTransaction,
		network,
		feeRate = this.feeRate,
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
		if (!getTransactionData) {
			return err('getTransactionData is not set in start method.');
		}
		if (!getTransactionPosition) {
			return err('getTransactionPosition is not set in start method.');
		}

		// Ensure the start params function as expected.
		const paramCheckResponse = await startParamCheck({
			account,
			genesisHash,
			getBestBlock,
			getTransactionData,
			getTransactionPosition,
			broadcastTransaction,
			getAddress,
			getScriptPubKeyHistory,
			network,
		});
		if (paramCheckResponse.isErr()) {
			return err(paramCheckResponse.error.message);
		}

		this.getBestBlock = getBestBlock;
		this.account = account;
		this.network = network;
		this.feeRate = feeRate;
		this.getAddress = getAddress;
		this.getScriptPubKeyHistory = getScriptPubKeyHistory;
		this.broadcastTransaction = broadcastTransaction;
		this.getTransactionData = getTransactionData;
		this.getTransactionPosition = getTransactionPosition;
		const bestBlock = await this.getBestBlock();
		this.watchTxs = [];
		this.watchOutputs = [];

		if (!this.baseStoragePath) {
			return err(
				'baseStoragePath required for wallet persistence. Call setBaseStoragePath(path) first.',
			);
		}

		let accountStoragePath = appendPath(this.baseStoragePath, account.name);

		this.logFilePath = `${accountStoragePath}/logs/${Date.now()}.log`;
		const logFilePathRes = await ldk.setLogFilePath(this.logFilePath);
		if (logFilePathRes.isErr()) {
			return logFilePathRes;
		}

		//The path all wallet and network graph persistence will be saved to
		const storagePathRes = await ldk.setAccountStoragePath(accountStoragePath);
		if (storagePathRes.isErr()) {
			return storagePathRes;
		}

		//Validate we didn't change the seed for this account if one exists
		const readSeed = await ldk.readFromFile({
			fileName: ELdkFiles.seed,
			format: 'hex',
		});
		if (readSeed.isErr()) {
			if (readSeed.code === 'file_does_not_exist') {
				//Have not yet saved the seed to disk
				const writeRes = await ldk.writeToFile({
					fileName: ELdkFiles.seed,
					content: account.seed,
					format: 'hex',
				});
				if (writeRes.isErr()) {
					return err(writeRes.error);
				}
			} else {
				return err(readSeed.error);
			}
		} else {
			//Cannot start an existing node with a different seed
			if (readSeed.value.content !== account.seed) {
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

		//TODO allow users to override
		let rapidGossipSyncUrl = '';
		if (network === 'mainnet') {
			rapidGossipSyncUrl = 'https://rapidsync.lightningdevkit.org/snapshot/';
		}

		// Step 11: Optional: Initialize the NetGraphMsgHandler
		const networkGraphRes = await ldk.initNetworkGraph({
			genesisHash,
			rapidGossipSyncUrl,
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

		// Attempt to abandon any stored payment ids.
		const paymentIds = await this.getLdkPaymentIds();
		if (paymentIds.length) {
			await Promise.all(
				paymentIds.map(async (paymentId) => {
					await ldk.abandonPayment(paymentId);
					await this.removeLdkPaymentId(paymentId);
				}),
			);
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

		const confirmedTxs = await this.getLdkConfirmedTxs();

		let channels: TChannel[] = [];
		if (this.watchTxs.length > 0) {
			// Get fresh array of channels.
			const listChannelsResponse = await ldk.listChannels();
			if (listChannelsResponse.isOk()) {
				channels = listChannelsResponse.value;
			}
		}

		// Iterate over watch transactions and set whether they are confirmed or unconfirmed.
		await Promise.all(
			this.watchTxs.map(async ({ txid }) => {
				if (confirmedTxs.includes(txid)) {
					return;
				}
				let requiredConfirmations = 6;
				const channel = channels.find((c) => c.funding_txid === txid);
				if (channel && channel?.confirmations_required !== undefined) {
					requiredConfirmations = channel.confirmations_required;
				}
				const txData = await this.getTransactionData(txid);
				if (!txData?.header || !txData.transaction) {
					return err(
						'Unable to retrieve transaction data from the getTransactionData method.',
					);
				}
				const txConfirmations =
					txData.height === 0 ? 0 : height - txData.height + 1;
				if (txConfirmations >= requiredConfirmations) {
					const pos = await this.getTransactionPosition({
						tx_hash: txid,
						height: txData.height,
					});
					if (pos >= 0) {
						await ldk.setTxConfirmed({
							header: txData.header,
							height: txData.height,
							txData: [{ transaction: txData.transaction, pos }],
						});
						await this.saveConfirmedTxs(txid);
						this.watchTxs = this.watchTxs.filter((tx) => tx.txid !== txid);
					}
				}
			}),
		);

		const confirmedWatchOutputs = await this.getLdkConfirmedOutputs();
		await Promise.all(
			this.watchOutputs.map(async ({ index, script_pubkey }) => {
				if (confirmedWatchOutputs.includes(script_pubkey)) {
					return;
				}
				const transactions = await this.getScriptPubKeyHistory(script_pubkey);
				await Promise.all(
					transactions.map(async ({ txid }) => {
						const transactionData = await this.getTransactionData(txid);
						if (
							!transactionData?.height &&
							transactionData?.vout?.length < index + 1
						) {
							return;
						}

						const txs = await this.getScriptPubKeyHistory(
							transactionData?.vout[index].hex,
						);

						// We're looking for the second transaction from this address.
						if (txs.length <= 1) {
							return;
						}

						// We only need the second transaction.
						const tx = txs[1];
						const txData = await this.getTransactionData(tx.txid);
						if (!txData?.height) {
							return;
						}
						const pos = await this.getTransactionPosition({
							tx_hash: tx.txid,
							height: txData.height,
						});
						if (pos >= 0) {
							await ldk.setTxConfirmed({
								header: txData.header,
								height: txData.height,
								txData: [{ transaction: txData.transaction, pos }],
							});
							await this.saveConfirmedOutputs(script_pubkey);
							this.watchOutputs = this.watchOutputs.filter(
								(o) => o.script_pubkey !== script_pubkey,
							);
						}
					}),
				);
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

		const writeRes = await ldk.writeToFile({
			fileName: ELdkFiles.peers,
			content: JSON.stringify(newPeers),
		});

		if (writeRes.isErr()) {
			return err(writeRes.error);
		}

		return ok(newPeers);
	};

	/**
	 * Returns saved peers from storage for the current seed.
	 * @returns {Promise<TLdkPeers>}
	 */
	getPeers = async (): Promise<TLdkPeers> => {
		const res = await ldk.readFromFile({ fileName: ELdkFiles.peers });
		if (res.isOk()) {
			return parseData(res.value.content, DefaultLdkDataShape.peers);
		}

		return DefaultLdkDataShape.peers;
	};

	/**
	 * This method is used to import backups provided by react-native-ldk's backupAccount method.
	 * @param {TAccountBackup} accountData
	 * @param {string} storagePath Default LDK storage path on disk
	 * @param {boolean} [overwrite] Determines if this function should overwrite an existing account of the same name.
	 * @returns {Promise<Result<TAccount>>} TAccount is used to start the node using the newly imported and saved data.
	 */
	importAccount = async ({
		backup,
		overwrite = false,
	}: {
		backup: string | TAccountBackup;
		overwrite?: boolean;
	}): Promise<Result<TAccount>> => {
		if (!this.baseStoragePath) {
			return err(
				'baseStoragePath required for wallet persistence. Call setBaseStoragePath(path) first.',
			);
		}

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

			if (
				!(ELdkData.channel_manager in accountBackup.data) ||
				!(ELdkData.channel_monitors in accountBackup.data) ||
				!(ELdkData.peers in accountBackup.data) ||
				!(ELdkData.confirmed_outputs in accountBackup.data) ||
				!(ELdkData.confirmed_transactions in accountBackup.data) ||
				!(ELdkData.broadcasted_transactions in accountBackup.data) ||
				!(ELdkData.payment_ids in accountBackup.data) ||
				!(ELdkData.timestamp in accountBackup.data)
			) {
				return err(
					`Invalid account backup data. Please ensure the following keys exist in the accountBackup object: ${ELdkData.channel_manager}, ${ELdkData.channel_monitors}, ${ELdkData.peers}, ${ELdkData.confirmed_transactions}, , ${ELdkData.confirmed_outputs}`,
				);
			}

			const accountPath = appendPath(
				this.baseStoragePath,
				accountBackup.account.name,
			);

			// Ensure the user is not attempting to import an old/stale backup.
			let timestamp = 0;
			const channelManagerRes = await ldk.readFromFile({
				fileName: ELdkFiles.channel_manager,
				path: accountPath,
				format: 'hex',
			});
			if (
				channelManagerRes.isErr() &&
				channelManagerRes.code !== 'file_does_not_exist' // If the file doesn't exist assume there's no backup to be overwritten
			) {
				return err(channelManagerRes.error);
			}

			if (!overwrite && accountBackup.data?.timestamp <= timestamp) {
				const msg =
					accountBackup.data?.timestamp < timestamp
						? 'This appears to be an old backup. The stored backup is more recent than the backup trying to be imported.'
						: 'No need to import. The backup timestamps match.';
				return err(msg);
			}

			//Save the provided backup data to files
			const saveChannelManagerRes = await ldk.writeToFile({
				fileName: ELdkFiles.channel_manager,
				path: accountPath,
				content: accountBackup.data.channel_manager,
				format: 'hex',
			});
			if (saveChannelManagerRes.isErr()) {
				return err(saveChannelManagerRes.error);
			}

			let channelIds = Object.keys(accountBackup.data.channel_monitors);
			for (let index = 0; index < channelIds.length; index++) {
				const channelId = channelIds[index];

				const saveChannelRes = await ldk.writeToFile({
					fileName: `${channelId}.bin`,
					path: appendPath(accountPath, ELdkFiles.channels),
					content: accountBackup.data.channel_monitors[channelId],
					format: 'hex',
				});
				if (saveChannelRes.isErr()) {
					return err(saveChannelRes.error);
				}
			}

			const savePeersRes = await ldk.writeToFile({
				fileName: ELdkFiles.peers,
				path: accountPath,
				content: JSON.stringify(accountBackup.data.peers),
			});
			if (savePeersRes.isErr()) {
				return err(savePeersRes.error);
			}

			const savePaymentIdsRes = await ldk.writeToFile({
				fileName: ELdkFiles.payment_ids,
				path: accountPath,
				content: JSON.stringify(accountBackup.data.payment_ids),
			});
			if (savePaymentIdsRes.isErr()) {
				return err(savePaymentIdsRes.error);
			}

			const confirmedTxRes = await ldk.writeToFile({
				fileName: ELdkFiles.confirmed_transactions,
				path: accountPath,
				content: JSON.stringify(accountBackup.data.confirmed_transactions),
			});
			if (confirmedTxRes.isErr()) {
				return err(confirmedTxRes.error);
			}

			const confirmedOutRes = await ldk.writeToFile({
				fileName: ELdkFiles.confirmed_outputs,
				path: accountPath,
				content: JSON.stringify(accountBackup.data.confirmed_outputs),
			});
			if (confirmedOutRes.isErr()) {
				return err(confirmedOutRes.error);
			}

			const broadcastedTxRes = await ldk.writeToFile({
				fileName: ELdkFiles.broadcasted_transactions,
				path: accountPath,
				content: JSON.stringify(accountBackup.data.broadcasted_transactions),
			});
			if (broadcastedTxRes.isErr()) {
				return err(broadcastedTxRes.error);
			}

			//Return the saved account info.
			return ok(accountBackup.account);
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * Used to back up the data that corresponds with the provided account.
	 * @param {TAccount} account
	 * @returns {TAccountBackup} This object can be stringified and used to import/restore this LDK account via importAccount.
	 */
	backupAccount = async ({
		account,
	}: {
		account: TAccount;
	}): Promise<Result<TAccountBackup>> => {
		if (!this.baseStoragePath) {
			return err(
				'baseStoragePath required for wallet persistence. Call setBaseStoragePath(path) first.',
			);
		}

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

			const accountPath = appendPath(this.baseStoragePath, account.name);

			//Get serialised channel manager
			const channelManagerRes = await ldk.readFromFile({
				fileName: ELdkFiles.channel_manager,
				path: accountPath,
				format: 'hex',
			});
			if (channelManagerRes.isErr()) {
				return err(channelManagerRes.error);
			}

			//Get serialised channels
			const listChannelsRes = await ldk.listChannelFiles();
			if (listChannelsRes.isErr()) {
				return err(listChannelsRes.error);
			}

			let channel_monitors: { [key: string]: string } = {};
			for (let index = 0; index < listChannelsRes.value.length; index++) {
				const fileName = listChannelsRes.value[index];

				const serialisedChannelRes = await ldk.readFromFile({
					fileName,
					path: appendPath(accountPath, ELdkFiles.channels),
					format: 'hex',
				});
				if (serialisedChannelRes.isErr()) {
					return err(serialisedChannelRes.error);
				}

				channel_monitors[fileName.replace('.bin', '')] =
					serialisedChannelRes.value.content;
			}

			const accountBackup: TAccountBackup = {
				account,
				data: {
					channel_manager: channelManagerRes.value.content,
					channel_monitors: channel_monitors,
					peers: await this.getPeers(),
					confirmed_transactions: await this.getLdkConfirmedTxs(),
					confirmed_outputs: await this.getLdkConfirmedOutputs(),
					broadcasted_transactions: await this.getLdkBroadcastedTxs(),
					payment_ids: await this.getLdkPaymentIds(),
					timestamp: Date.now(),
				},
				package_version: require('../package.json').version,
				network: this.network,
			};
			return ok(accountBackup);
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * ldk.pay helper that subscribes to and returns pay event success/failures and times out after a specified period of time.
	 * @param {string} paymentRequest
	 * @param {number} [amountSats]
	 * @param {number} [timeout]
	 * @returns {Promise<Result<TChannelManagerPaymentSent>>}
	 */
	payWithTimeout = async ({
		paymentRequest,
		amountSats,
		timeout = 20000,
	}: TPaymentTimeoutReq): Promise<Result<TChannelManagerPaymentSent>> => {
		return promiseTimeout(
			timeout,
			this.subscribeAndPay({ paymentRequest, amountSats }),
		);
	};

	private subscribeAndPay = async ({
		paymentRequest,
		amountSats,
	}: TPaymentReq): Promise<Result<TChannelManagerPaymentSent>> => {
		return new Promise(async (resolve) => {
			this.subscribeToPaymentResponses(resolve).then();

			let payResponse: Result<string> | undefined = await ldk.payWithRoute({
				paymentRequest,
				amountSats,
			});

			//Quickly retry with default invoice payer method
			if (!payResponse.isOk()) {
				payResponse = await ldk.pay({
					paymentRequest,
					amountSats,
				});
			}

			if (!payResponse) {
				this.unsubscribeFromPaymentSubscriptions();
				return resolve(err('Unable to pay the provided lightning invoice.'));
			}
			if (payResponse.isErr()) {
				this.unsubscribeFromPaymentSubscriptions();
				return resolve(err(payResponse.error.message));
			}
			//Save payment ids to file on payResponse success.
			await this.appendLdkPaymentId(payResponse.value);
		});
	};

	/**
	 * Subscribes to outgoing lightning payments.
	 * @returns {Promise<Result<TChannelManagerPaymentSent>>}
	 */
	private subscribeToPaymentResponses = async (resolve: any): Promise<void> => {
		this.pathFailedSubscription = ldk.onEvent(
			EEventTypes.channel_manager_payment_path_failed,
			async (res: TChannelManagerPaymentPathFailed) => {
				this.unsubscribeFromPaymentSubscriptions();
				const abandonPaymentRes = await ldk.abandonPayment(res.payment_id);
				if (abandonPaymentRes.isOk()) {
					this.removeLdkPaymentId(res.payment_id).then();
				}
				return resolve(err(res.payment_id));
			},
		);
		this.paymentFailedSubscription = ldk.onEvent(
			EEventTypes.channel_manager_payment_failed,
			async (res: TChannelManagerPaymentFailed) => {
				this.unsubscribeFromPaymentSubscriptions();
				const abandonPaymentRes = await ldk.abandonPayment(res.payment_id);
				if (abandonPaymentRes.isOk()) {
					this.removeLdkPaymentId(res.payment_id).then();
				}
				return resolve(err(res.payment_id));
			},
		);
		this.paymentSentSubscription = ldk.onEvent(
			EEventTypes.channel_manager_payment_sent,
			(res: TChannelManagerPaymentSent) => {
				this.unsubscribeFromPaymentSubscriptions();
				this.removeLdkPaymentId(res.payment_id).then();
				return resolve(ok(res));
			},
		);
	};

	unsubscribeFromPaymentSubscriptions = (): void => {
		this.pathFailedSubscription && this.pathFailedSubscription.remove();
		this.paymentFailedSubscription && this.paymentFailedSubscription.remove();
		this.paymentSentSubscription && this.paymentSentSubscription.remove();
	};

	/**
	 * Subscribe to back up events and receive full backups to callback passed
	 * @param callback
	 * @returns {string}
	 */
	subscribeToBackups(
		callback: (backup: Result<TAccountBackup>) => void,
	): string {
		this.backupSubscriptionsId++;
		const id = `${this.backupSubscriptionsId}`;
		this.backupSubscriptions[id] = callback;
		return id;
	}

	/**
	 * Unsubscribe from backup events
	 * @param id
	 */
	unsubscribeFromBackups(id: string): void {
		if (this.backupSubscriptions[id]) {
			delete this.backupSubscriptions[id];
		}
	}

	/**
	 * Handle native events triggering backups by debouncing and fetching data after
	 * a timeout to avoid too many backup events being triggered right after each other.
	 * @returns {Promise<void>}
	 */
	private async onLdkBackupEvent(): Promise<void> {
		if (this.backupSubscriptionsDebounceTimer) {
			clearTimeout(this.backupSubscriptionsDebounceTimer);
		}

		this.backupSubscriptionsDebounceTimer = setTimeout(async () => {
			const backupRes = await this.backupAccount({ account: this.account });

			//Process all subscriptions
			Object.keys(this.backupSubscriptions).forEach((id) => {
				const callback = this.backupSubscriptions[id];
				if (callback) {
					callback(backupRes);
				}
			});
		}, 250);
	}

	/**
	 * Returns change destination script for the provided address.
	 * @param {string} address
	 * @returns {string}
	 */
	private getChangeDestinationScript = (address = ''): string => {
		try {
			// @ts-ignore
			const network = networks[this.network];
			const script = bitcoin.address.toOutputScript(address, network);
			return script.toString('hex');
		} catch (e) {
			console.log(e);
			return '';
		}
	};

	/**
	 * Returns previously confirmed transactions from storage.
	 * @returns {Promise<TLdkConfirmedTransactions>}
	 */
	private getLdkConfirmedTxs = async (): Promise<TLdkConfirmedTransactions> => {
		const res = await ldk.readFromFile({
			fileName: ELdkFiles.confirmed_transactions,
		});
		if (res.isOk()) {
			return parseData(
				res.value.content,
				DefaultLdkDataShape.confirmed_transactions,
			);
		}
		return DefaultLdkDataShape.confirmed_transactions;
	};

	private getLdkPaymentIds = async (): Promise<TLdkPaymentIds> => {
		const res = await ldk.readFromFile({
			fileName: ELdkFiles.payment_ids,
		});
		if (res.isOk()) {
			let parsed = parseData(
				res.value.content,
				DefaultLdkDataShape.payment_ids,
			);

			//Temp patch for wallets with incorrectly written payment ID file formats. Can be removed after a few releases.
			if (parsed.length === 64 && res.value.content.length === 66) {
				parsed = [parsed];
			}

			return parsed;
		}
		return DefaultLdkDataShape.payment_ids;
	};

	private removeLdkPaymentId = async (paymentId: string): Promise<void> => {
		const paymentIds = await this.getLdkPaymentIds();
		if (!paymentIds.length || !paymentId.includes(paymentId)) {
			return;
		}

		const newPaymentIds = paymentIds.filter((id) => id !== paymentId);
		await ldk.writeToFile({
			fileName: ELdkFiles.payment_ids,
			content: JSON.stringify(newPaymentIds),
		});
	};

	private appendLdkPaymentId = async (paymentId: string): Promise<void> => {
		let paymentIds = await this.getLdkPaymentIds();
		if (paymentId.includes(paymentId)) {
			return;
		}

		paymentIds.push(paymentId);
		await ldk.writeToFile({
			fileName: ELdkFiles.payment_ids,
			content: JSON.stringify(paymentIds),
		});
	};

	/**
	 * Returns previously confirmed outputs from storage.
	 * @returns {Promise<TLdkConfirmedOutputs>}
	 */
	private getLdkConfirmedOutputs = async (): Promise<TLdkConfirmedOutputs> => {
		const res = await ldk.readFromFile({
			fileName: ELdkFiles.confirmed_outputs,
		});
		if (res.isOk()) {
			return parseData(
				res.value.content,
				DefaultLdkDataShape.confirmed_outputs,
			);
		}
		return DefaultLdkDataShape.confirmed_outputs;
	};

	/**
	 * Returns previously broadcasted transactions saved in storgare.
	 * @returns {Promise<TLdkBroadcastedTransactions>}
	 */
	async getLdkBroadcastedTxs(): Promise<TLdkBroadcastedTransactions> {
		const res = await ldk.readFromFile({
			fileName: ELdkFiles.broadcasted_transactions,
		});
		if (res.isOk()) {
			return parseData(
				res.value.content,
				DefaultLdkDataShape.broadcasted_transactions,
			);
		}
		return DefaultLdkDataShape.broadcasted_transactions;
	}

	async rebroadcastAllKnownTransactions(): Promise<any[]> {
		const broadcastedTransactions = await this.getLdkBroadcastedTxs();
		return await Promise.all(
			broadcastedTransactions.map(async (tx) => {
				return await this.broadcastTransaction(tx);
			}),
		);
	}

	/**
	 * Saves confirmed transaction txids to storage.
	 * @param {string} txid
	 * @returns {Promise<void>}
	 */
	private saveConfirmedTxs = async (txid: string): Promise<Result<boolean>> => {
		if (!txid) {
			return ok(true);
		}
		const confirmedTxs = await this.getLdkConfirmedTxs();
		if (!confirmedTxs.includes(txid)) {
			confirmedTxs.push(txid);
			return await ldk.writeToFile({
				fileName: ELdkFiles.confirmed_transactions,
				content: JSON.stringify(confirmedTxs),
			});
		}
		return ok(true);
	};

	/**
	 * Saves confirmed output script_pubkeys to storage.
	 * @param {string} script_pubkey
	 * @returns {Promise<Result<boolean>>}
	 */
	private saveConfirmedOutputs = async (
		script_pubkey: string,
	): Promise<Result<boolean>> => {
		if (!script_pubkey) {
			return ok(true);
		}
		const confirmedOutputs = await this.getLdkConfirmedOutputs();
		if (!confirmedOutputs.includes(script_pubkey)) {
			confirmedOutputs.push(script_pubkey);
			return await ldk.writeToFile({
				fileName: ELdkFiles.confirmed_outputs,
				content: JSON.stringify(confirmedOutputs),
			});
		}
		return ok(true);
	};

	/**
	 * Saves broadcasted transactions to storage.
	 * @param {string} rawTx
	 * @returns {Promise<void>}
	 */
	private saveBroadcastedTxs = async (
		rawTx: string,
	): Promise<Result<boolean>> => {
		if (!rawTx) {
			return ok(true);
		}
		const broadcastedTransactions = await this.getLdkBroadcastedTxs();
		if (!broadcastedTransactions.includes(rawTx)) {
			broadcastedTransactions.push(rawTx);
			return await ldk.writeToFile({
				fileName: ELdkFiles.broadcasted_transactions,
				content: JSON.stringify(broadcastedTransactions),
			});
		}
		return ok(true);
	};

	/**
	 * Adds an individual peer to storage.
	 * @param {TPeer} peer
	 * @returns {Promise<void>}
	 */
	private saveLdkPeerData = async (peer: TPeer): Promise<Result<boolean>> => {
		const peers = await this.getPeers();
		const duplicatePeerArr = peers.filter(
			(p) => p.pubKey === peer.pubKey && p.address === peer.address,
		);
		if (duplicatePeerArr.length > 0) {
			return ok(true);
		}
		peers.push(peer);

		return await ldk.writeToFile({
			fileName: ELdkFiles.peers,
			content: JSON.stringify(peers),
		});
	};

	//LDK events

	private async onRegisterTx(res: TRegisterTxEvent): Promise<void> {
		const isDuplicate = this.watchTxs.some(
			(tx) => tx.script_pubkey === res.script_pubkey && tx.txid === res.txid,
		);
		const confirmedTxs = await this.getLdkConfirmedTxs();
		const isAlreadyConfirmed = confirmedTxs.includes(res.txid);
		if (!isDuplicate && !isAlreadyConfirmed) {
			this.watchTxs.push(res);
		}
	}

	private async onRegisterOutput(res: TRegisterOutputEvent): Promise<void> {
		const isDuplicate = this.watchOutputs.some(
			(o) => o.script_pubkey === res.script_pubkey && o.index === res.index,
		);
		const confirmedOutputs = await this.getLdkConfirmedOutputs();
		const isAlreadyConfirmed = confirmedOutputs.includes(res.script_pubkey);
		if (!isDuplicate && !isAlreadyConfirmed) {
			this.watchOutputs.push(res);
		}
	}

	private async onBroadcastTransaction(
		res: TBroadcastTransactionEvent,
	): Promise<void> {
		const broadcastedTxs = await this.getLdkBroadcastedTxs();
		if (broadcastedTxs.includes(res.tx)) {
			return;
		}
		console.log(`onBroadcastTransaction: ${res.tx}`);
		this.broadcastTransaction(res.tx).then(console.log);
		this.saveBroadcastedTxs(res.tx).then();
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
		const address = await this.getAddress();
		const change_destination_script = this.getChangeDestinationScript(address);
		if (!change_destination_script) {
			console.log('Unable to retrieve change_destination_script.');
			return;
		}
		const spendRes = await ldk.spendOutputs({
			descriptorsSerialized: res.outputsSerialized,
			outputs: [], //Shouldn't need to specify this if we're sweeping all funds to dest script
			change_destination_script,
			feerate_sat_per_1000_weight: this.feeRate,
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
		console.log(`onChannelManagerChannelClosed: ${JSON.stringify(res)}`);
	}

	private onChannelManagerDiscardFunding(
		res: TChannelManagerDiscardFunding,
	): void {
		//Wallet should probably "lock" the UTXOs spent in funding transactions until the funding transaction either confirms, or this event is generated.
		console.log(`onChannelManagerDiscardFunding: ${JSON.stringify(res)}`); //TODO
	}

	private onChannelManagerPaymentClaimed(res: TChannelManagerPayment): void {
		// Payment Received/Invoice Paid.
		console.log(`onChannelManagerPaymentClaimed: ${JSON.stringify(res)}`);
		this.syncLdk().then();
	}

	/**
	 * Best effort attempt to recover funds in the event that a channel monitor is
	 * not able to be persisted.
	 * @param res
	 * @returns {Promise<void>}
	 */
	private async onEmergencyForceCloseChannel(
		res: TChannelUpdate,
	): Promise<void> {
		console.warn('Emergency close channel');
		const { channel_id, counterparty_node_id } = res;
		const closeRes = await ldk.closeChannel({
			channelId: channel_id,
			counterPartyNodeId: counterparty_node_id,
			force: true,
		});
		if (closeRes.isErr()) {
			return console.error(closeRes.error);
		}

		console.log(
			`Emergency closed channel ${channel_id} with peer ${counterparty_node_id}`,
		);
	}

	private onNetworkGraphUpdated(res: TNetworkGraphUpdated): void {
		console.log(`Network graph nodes: ${res.node_count}`);
		console.log(`Network graph channels: ${res.channel_count}`);
	}
}

export default new LightningManager();
