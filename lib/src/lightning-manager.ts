import ldk from './ldk';
import { Err, err, ok, Result } from './utils/result';
import {
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
	TChannelManagerClaim,
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
	TLdkUnconfirmedTransactions,
	TLdkUnconfirmedTransaction,
	TLdkBroadcastedTransactions,
	TChannelUpdate,
	TPaymentReq,
	TLdkPaymentIds,
	TNetworkGraphUpdated,
	TGetTransactionPosition,
	TTransactionPosition,
	TChannel,
	defaultUserConfig,
	TGetFees,
	TFeeUpdateReq,
	TLdkSpendableOutputs,
	TReconstructAndSpendOutputsReq,
	TBolt11Invoices,
	TInvoice,
	TCreatePaymentReq,
	TBackupServerDetails,
	IAddress,
} from './utils/types';
import {
	appendPath,
	findOutputsFromRawTxs,
	isValidBech32mEncodedString,
	parseData,
	promiseTimeout,
	sleep,
	startParamCheck,
} from './utils/helpers';
import * as bitcoin from 'bitcoinjs-lib';
import networks from './utils/networks';
import { EmitterSubscription } from 'react-native';

const MAX_PENDING_PAY_AGE = 1000 * 60 * 60; // 1 hour

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
// Step 16: Initialize routing ProbabilisticScorer ✅
// Step 17: Create InvoicePayer ✅
// Step 18: Persist ChannelManager and NetworkGraph ✅
// Step 19: Background Processing ✅

class LightningManager {
	currentBlock: THeader = {
		hex: '',
		hash: '',
		height: 0,
	};
	unconfirmedTxs: TLdkUnconfirmedTransactions = [];
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
	getTransactionData: TGetTransactionData =
		async (): Promise<TTransactionData> => DefaultTransactionDataShape;
	getTransactionPosition: TGetTransactionPosition =
		async (): Promise<TTransactionPosition> => -1;
	network: ENetworks = ENetworks.regtest;
	baseStoragePath = '';
	logFilePath = '';
	getAddress: TGetAddress = async (): Promise<IAddress> => ({
		address: '',
		publicKey: '',
	});
	getScriptPubKeyHistory: TGetScriptPubKeyHistory = async (): Promise<
		TGetScriptPubKeyHistoryResponse[]
	> => [];
	getFees: TGetFees = async (): Promise<TFeeUpdateReq> => ({
		nonAnchorChannelFee: 5,
		anchorChannelFee: 5,
		maxAllowedNonAnchorChannelRemoteFee: 5,
		channelCloseMinimum: 5,
		minAllowedAnchorChannelRemoteFee: 5,
		minAllowedNonAnchorChannelRemoteFee: 5,
		onChainSweep: 5,
	});
	trustedZeroConfPeers: string[] = [];
	broadcastTransaction: TBroadcastTransaction = async (): Promise<any> => {};
	pathFailedSubscription: EmitterSubscription | undefined;
	paymentFailedSubscription: EmitterSubscription | undefined;
	paymentSentSubscription: EmitterSubscription | undefined;

	private isSyncing: boolean = false;
	private forceSync: boolean = false;
	private pendingSyncPromises: Array<(result: Result<string>) => void> = [];

	private isStarting: boolean = false;
	private pendingStartPromises: Array<(result: Result<string>) => void> = [];
	private previousAccountName: string = '';

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
		//Channel manager handle events:
		ldk.onEvent(
			EEventTypes.channel_manager_funding_generation_ready,
			this.onChannelManagerFundingGenerationReady.bind(this),
		);
		ldk.onEvent(
			EEventTypes.channel_manager_payment_claimable,
			this.onChannelManagerPaymentClaimable.bind(this),
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
		ldk.onEvent(
			EEventTypes.channel_manager_restarted,
			this.onChannelManagerRestarted.bind(this),
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
	 * Resolves all pending start promises with the provided result.
	 * @private
	 * @param {Result<string>} result
	 * @returns {void}
	 */
	private resolveAllPendingStartPromises(result: Result<string>): void {
		while (this.pendingStartPromises.length > 0) {
			const resolve = this.pendingStartPromises.shift();
			if (resolve) {
				resolve(result);
			}
		}
	}

	/**
	 * Sets isStarting to false, resolves all start promises and returns error.
	 * @private
	 * @param {Err<string>} e
	 * @returns {Promise<Result<string>>}
	 */
	private handleStartError = (e: Err<string>): Result<string> => {
		this.isStarting = false;
		this.resolveAllPendingStartPromises(e);
		return e;
	};

	/**
	 * Spins up and syncs all processes
	 * @param {string} seed
	 * @param {TGetBestBlock} getBestBlock
	 * @param {TGetTransactionData} getTransactionData
	 * @param {TGetAddress} getAddress
	 * @param {ENetworks} network
	 * @returns {Promise<Result<string>>}
	 */
	async start({
		account,
		getBestBlock,
		getTransactionData,
		getTransactionPosition,
		getAddress,
		getScriptPubKeyHistory,
		getFees,
		broadcastTransaction,
		network,
		rapidGossipSyncUrl = 'https://rapidsync.lightningdevkit.org/snapshot/',
		scorerDownloadUrl = 'https://rapidsync.lightningdevkit.org/scoring/scorer.bin',
		forceCloseOnStartup,
		userConfig = defaultUserConfig,
		trustedZeroConfPeers = [],
		skipParamCheck = false,
		skipRemoteBackups = false,
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
		if (!getTransactionData) {
			return err('getTransactionData is not set in start method.');
		}
		if (!getTransactionPosition) {
			return err('getTransactionPosition is not set in start method.');
		}

		// Retry start method if presented with a new account name.
		if (this.previousAccountName !== account.name) {
			this.isStarting = false;
			this.previousAccountName = account.name;
		}

		if (this.isStarting) {
			return new Promise<Result<string>>((resolve) => {
				this.pendingStartPromises.push(resolve);
			});
		}
		this.isStarting = true;

		if (!skipParamCheck) {
			// Ensure the start params function as expected.
			const paramCheckResponse = await startParamCheck({
				account,
				getBestBlock,
				getTransactionData,
				getTransactionPosition,
				broadcastTransaction,
				getAddress,
				getScriptPubKeyHistory,
				getFees,
				network,
			});
			if (paramCheckResponse.isErr()) {
				return this.handleStartError(paramCheckResponse);
			}
		} else {
			ldk
				.writeToLogFile(
					'info',
					'Skipping start param check. Set skipParamCheck=false for debugging.',
				)
				.catch(console.error);
		}

		this.getBestBlock = getBestBlock;
		this.account = account;
		this.network = network;
		this.getAddress = getAddress;
		this.getScriptPubKeyHistory = getScriptPubKeyHistory;
		this.getFees = getFees;
		this.broadcastTransaction = broadcastTransaction;
		this.getTransactionData = getTransactionData;
		this.getTransactionPosition = getTransactionPosition;
		const bestBlock = await this.getBestBlock();
		this.unconfirmedTxs = await this.getLdkUnconfirmedTxs();
		this.watchTxs = [];
		this.watchOutputs = [];
		this.trustedZeroConfPeers = trustedZeroConfPeers;

		if (!this.baseStoragePath) {
			return this.handleStartError(
				err(
					'baseStoragePath required for wallet persistence. Call setBaseStoragePath(path) first.',
				),
			);
		}

		const storageSetRes = await this.setStorage(account);
		if (storageSetRes.isErr()) {
			return this.handleStartError(storageSetRes);
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
					remotePersist: false,
				});
				if (writeRes.isErr()) {
					return this.handleStartError(err(writeRes.error));
				}
			} else {
				return this.handleStartError(err(readSeed.error));
			}
		} else {
			//Cannot start an existing node with a different seed
			if (readSeed.value.content !== account.seed) {
				return this.handleStartError(
					err('Seed for current node cannot be changed.'),
				);
			}
		}

		if (network !== ENetworks.mainnet) {
			//RGS and pre-populated scorer only available for mainnet
			rapidGossipSyncUrl = '';
			scorerDownloadUrl = '';
		}

		const closeAddress = await this.getAddress();
		const witnessProgram = bitcoin.crypto
			.hash160(Buffer.from(closeAddress.publicKey, 'hex'))
			.toString('hex');
		const witnessProgramVersion = isValidBech32mEncodedString(
			closeAddress.address,
		).isValid
			? 1
			: 0;

		//All these calls don't need to be done in any particular sequence
		let promises: Promise<Result<string>>[] = [
			ldk.setLogLevel(ELdkLogLevels.info, true),
			ldk.setLogLevel(ELdkLogLevels.warn, true),
			ldk.setLogLevel(ELdkLogLevels.error, true),
			ldk.setLogLevel(ELdkLogLevels.debug, true),
			// ldk.setLogLevel(ELdkLogLevels.trace, true),
			ldk.initKeysManager({
				seed: this.account.seed,
				channelCloseDestinationScriptPublicKey: closeAddress.publicKey,
				channelCloseWitnessProgram: witnessProgram,
				channelCloseWitnessProgramVersion: witnessProgramVersion,
			}),
			ldk.initNetworkGraph({
				network,
				rapidGossipSyncUrl,
				skipHoursThreshold: 3,
			}),
			this.setFees(),
			ldk.initUserConfig(userConfig),
		];

		if (scorerDownloadUrl) {
			promises.push(
				ldk.downloadScorer({
					scorerDownloadUrl,
					skipHoursThreshold: 3,
				}),
			);
		}

		if (!skipRemoteBackups) {
			promises.push(ldk.backupSelfCheck());
		}

		// Check for any errors before starting channel manager.
		const results = await Promise.all(promises);
		for (const result of results) {
			if (result.isErr()) {
				return this.handleStartError(result);
			}
		}

		const channelManagerRes = await ldk.initChannelManager({
			network: this.network,
			bestBlock,
		});
		if (channelManagerRes.isErr()) {
			return this.handleStartError(channelManagerRes);
		}

		//Force close all channels on startup. Likely to recover funds after restoring from a stale backup.
		if (forceCloseOnStartup && forceCloseOnStartup.forceClose) {
			await ldk.forceCloseAllChannels(forceCloseOnStartup.broadcastLatestTx);
		}

		if (!forceCloseOnStartup || forceCloseOnStartup.broadcastLatestTx) {
			// If we're force closing without broadcasting the latest state don't add peers as we're likely doing this to recovery from a stale backup
			this.addPeers().catch(console.error);
		}

		//Can continue in the background
		this.syncLdk().catch(console.error);

		//Writes node state to log files
		ldk.nodeStateDump().catch(console.error);

		this.isStarting = false;
		const result = ok('Node started');
		this.resolveAllPendingStartPromises(result);
		return result;
	}

	async setStorage(account: TAccount): Promise<Result<string>> {
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

		return ok('Storage set');
	}

	async addPeers(): Promise<void> {
		const peers = await this.getPeers();
		await Promise.all(
			peers.map((peer: TPeer) => {
				this.addPeer({ ...peer, timeout: 4000 });
			}),
		);
	}

	async setFees(): Promise<Result<string>> {
		const fees = await this.getFees();
		return await ldk.updateFees(fees);
	}

	/**
	 * Fetches current best block and sends to LDK to update both channelManager and chainMonitor.
	 * Also watches transactions and outputs for confirmed and unconfirmed transactions and updates LDK.
	 * @param {number} [timeout] Timeout to set for each async function in this method. Potential overall timeout may be greater.
	 * @param {number} [retryAttempts] Will attempt to sync LDK a given number of times before giving up.
	 * @param {boolean} [force] In the event a sync is underway, this will force another sync once the current sync is complete.
	 * @returns {Promise<Result<string>>}
	 */
	async syncLdk({
		timeout = 5000,
		retryAttempts = 1,
		force = false,
	}: {
		timeout?: number;
		retryAttempts?: number;
		force?: boolean;
	} = {}): Promise<Result<string>> {
		// Check that the getBestBlock method has been provided.
		if (!this.getBestBlock) {
			return this.handleSyncError(err('No getBestBlock method provided.'));
		}

		if (force && this.isSyncing && !this.forceSync) {
			// If syncing is already underway and force is true, set forceSync to true.
			this.forceSync = true;
		}
		if (this.isSyncing) {
			// If isSyncing, push to pendingSyncPromises to resolve when the current sync completes.
			return new Promise<Result<string>>((resolve) => {
				this.pendingSyncPromises.push(resolve);
			});
		}
		this.isSyncing = true;

		const bestBlock = await promiseTimeout<THeader>(
			timeout,
			this.getBestBlock(),
		);
		if (!bestBlock?.height) {
			return this.retrySyncOrReturnError({
				timeout,
				retryAttempts,
				e: err('Unable to get best block in syncLdk method.'),
			});
		}
		const height = bestBlock.height;

		// Don't update unnecessarily
		if (this.currentBlock.hash !== bestBlock?.hash) {
			const syncToTip = await promiseTimeout<Result<string>>(
				timeout,
				ldk.syncToTip(bestBlock),
			);
			if (syncToTip.isErr()) {
				return this.retrySyncOrReturnError({
					timeout,
					retryAttempts,
					e: syncToTip,
				});
			}

			this.currentBlock = bestBlock;
		}

		let channels: TChannel[] = [];
		if (this.watchTxs.length > 0) {
			// Get fresh array of channels.
			const listChannelsResponse = await promiseTimeout<Result<TChannel[]>>(
				timeout,
				ldk.listChannels(),
			);
			if (listChannelsResponse.isOk()) {
				channels = listChannelsResponse.value;
			}
		}

		// Iterate over watch transactions/outputs and set whether they are confirmed or unconfirmed.
		const watchTxsRes = await promiseTimeout<Result<string>>(
			timeout,
			this.checkWatchTxs(this.watchTxs, channels, bestBlock),
		);
		if (watchTxsRes.isErr()) {
			return this.retrySyncOrReturnError({
				timeout,
				retryAttempts,
				e: watchTxsRes,
			});
		}
		const watchOutputsRes = await promiseTimeout<Result<string>>(
			timeout,
			this.checkWatchOutputs(this.watchOutputs),
		);
		if (watchOutputsRes.isErr()) {
			return this.retrySyncOrReturnError({
				timeout,
				retryAttempts,
				e: watchOutputsRes,
			});
		}
		const unconfirmedTxsRes = await promiseTimeout<Result<string>>(
			timeout,
			this.checkUnconfirmedTransactions(),
		);
		if (unconfirmedTxsRes.isErr()) {
			return this.retrySyncOrReturnError({
				timeout,
				retryAttempts,
				e: unconfirmedTxsRes,
			});
		}

		// Awaiting because sync is often followed by reading from the files
		// that might be overwritten by the cleanups below.
		await this.removeExpiredAndUnclaimedInvoices();
		await this.removeStalePaymentClaims();

		this.isSyncing = false;

		// Handle force sync if needed.
		if (this.forceSync) {
			return this.handleForceSync({ timeout, retryAttempts });
		}
		const result = ok(`Synced to block ${height}`);
		this.resolveAllPendingSyncPromises(result);
		ldk.nodeStateDump().catch(console.error);
		return result;
	}

	/**
	 * Resolves all pending sync promises with the provided result.
	 * @private
	 * @param {Result<string>} result
	 * @returns {void}
	 */
	private resolveAllPendingSyncPromises(result: Result<string>): void {
		while (this.pendingSyncPromises.length > 0) {
			const resolve = this.pendingSyncPromises.shift();
			if (resolve) {
				resolve(result);
			}
		}
	}

	/**
	 * Sets forceSync to false and re-runs the sync method.
	 * @private
	 * @param {number} timeout
	 * @param {number} retryAttempts
	 * @returns {Promise<Result<string>>}
	 */
	private handleForceSync = async ({
		timeout,
		retryAttempts,
	}: {
		timeout: number;
		retryAttempts: number;
	}): Promise<Result<string>> => {
		this.forceSync = false;
		return this.syncLdk({
			timeout,
			retryAttempts,
		});
	};

	/**
	 * Attempts to retry the syncLdk method. Otherwise, the error gets passed to handleSyncError.
	 * @private
	 * @param {number} [timeout]
	 * @param {number} retryAttempts
	 * @param {Err<string>} e
	 * @returns {Promise<Result<string>>}
	 */
	private retrySyncOrReturnError = async ({
		timeout = 5000,
		retryAttempts,
		e,
	}: {
		timeout?: number;
		retryAttempts: number;
		e: Err<string>;
	}): Promise<Result<string>> => {
		this.isSyncing = false;
		if (retryAttempts > 0) {
			await sleep();
			return this.syncLdk({
				timeout,
				retryAttempts: retryAttempts - 1,
			});
		} else {
			return this.handleSyncError(e);
		}
	};

	/**
	 * Sets isSyncing & forceSync to false and returns error.
	 * @private
	 * @param {Err<string>} e
	 * @returns {Promise<Result<string>>}
	 */
	private handleSyncError = (e: Err<string>): Result<string> => {
		this.isSyncing = false;
		this.forceSync = false;
		this.resolveAllPendingSyncPromises(e);
		return e;
	};

	checkWatchTxs = async (
		watchTxs: TRegisterTxEvent[],
		channels: TChannel[],
		bestBlock: THeader,
	): Promise<Result<string>> => {
		const height = bestBlock?.height;
		if (!height) {
			return err('No height provided');
		}
		await Promise.all(
			watchTxs.map(async (watchTxData) => {
				const { txid, script_pubkey } = watchTxData;
				let requiredConfirmations = 1;
				const channel = channels.find((c) => c.funding_txid === txid);
				if (channel && channel?.confirmations_required !== undefined) {
					requiredConfirmations = channel.confirmations_required;
				}
				const txData = await this.getTransactionData(txid);
				if (!txData) {
					//Watch TX was never confirmed so there's no need to unconfirm it.
					return;
				}
				if (!txData?.transaction) {
					console.log(
						'Unable to retrieve transaction data from the getTransactionData method.',
					);
					return;
				}
				const txConfirmations =
					txData.height === 0 ? 0 : height - txData.height + 1;
				if (txConfirmations >= requiredConfirmations) {
					const pos = await this.getTransactionPosition({
						tx_hash: txid,
						height: txData.height,
					});
					if (pos >= 0) {
						const setTxConfirmedRes = await ldk.setTxConfirmed({
							header: txData.header,
							height: txData.height,
							txData: [{ transaction: txData.transaction, pos }],
						});
						if (setTxConfirmedRes.isOk()) {
							await this.saveUnconfirmedTx({
								...txData,
								txid,
								script_pubkey,
							});
							this.watchTxs = this.watchTxs.filter((tx) => tx.txid !== txid);
						}
					}
				}
			}),
		);
		return ok('Watch transactions checked');
	};

	checkWatchOutputs = async (
		watchOutputs: TRegisterOutputEvent[],
	): Promise<Result<string>> => {
		await Promise.all(
			watchOutputs.map(async ({ index, script_pubkey }) => {
				const transactions = await this.getScriptPubKeyHistory(script_pubkey);
				await Promise.all(
					transactions.map(async ({ txid }) => {
						const transactionData = await this.getTransactionData(txid);
						if (!transactionData) {
							//Watch Output was never confirmed so there's no need to unconfirm it.
							return;
						}
						if (
							!transactionData?.height &&
							transactionData?.vout?.length < index + 1
						) {
							return;
						}

						if (!transactionData?.vout[index]) {
							return;
						}

						const txs = await this.getScriptPubKeyHistory(
							transactionData?.vout[index].hex,
						);

						// We're looking for more than two transactions from this address.
						if (txs.length <= 1) {
							return;
						}

						// We only need the second transaction.
						const tx = txs[1];
						const txData = await this.getTransactionData(tx.txid);
						if (!txData) {
							//Watch Output was never confirmed so there's no need to unconfirm it.
							return;
						}
						if (!txData?.height) {
							return;
						}
						const pos = await this.getTransactionPosition({
							tx_hash: tx.txid,
							height: txData.height,
						});
						if (pos >= 0) {
							const setTxConfirmedRes = await ldk.setTxConfirmed({
								header: txData.header,
								height: txData.height,
								txData: [{ transaction: txData.transaction, pos }],
							});
							if (setTxConfirmedRes.isOk()) {
								await this.saveUnconfirmedTx({
									...txData,
									txid: tx.txid,
									script_pubkey,
								});
								this.watchOutputs = this.watchOutputs.filter(
									(o) => o.script_pubkey !== script_pubkey,
								);
							}
						}
					}),
				);
			}),
		);
		return ok('Watch outputs checked');
	};

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
			remotePersist: true,
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
			return parseData(res.value.content, []);
		}

		return [];
	};

	/**
	 * Restores the LDK wallet from a remote server if a backup exists.
	 * @param account
	 * @param serverDetails
	 * @param overwrite
	 */
	restoreFromRemoteServer = async ({
		account,
		serverDetails,
		network,
		overwrite = false,
	}: {
		account: TAccount;
		serverDetails: TBackupServerDetails;
		network: ENetworks;
		overwrite?: boolean;
	}): Promise<Result<string>> => {
		//Make sure LDK is not running.
		const nodeIdRes = await ldk.nodeId();
		if (nodeIdRes.isOk()) {
			return err('Cannot restore while LDK is running.');
		}

		const storageSetRes = await this.setStorage(account);
		if (storageSetRes.isErr()) {
			return err(storageSetRes.error);
		}

		const backupSetupRes = await ldk.backupSetup({
			seed: account.seed,
			network,
			details: serverDetails,
		});
		if (backupSetupRes.isErr()) {
			return err(backupSetupRes.error);
		}

		const restoreRes = await ldk.restoreFromRemoteBackup({
			overwrite,
		});
		if (restoreRes.isErr()) {
			return err(restoreRes.error);
		}

		return ok('Restored from remote server.');
	};

	/**
	 * This method is used to import backups provided by react-native-ldk's backupAccount method.
	 * @param {string | TAccountBackup} backup
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
		console.warn(
			'importAccount() is deprecated and should only be used to import accounts that were backed up with a previous async method.',
		);
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
				!(ELdkData.unconfirmed_transactions in accountBackup.data) ||
				!(ELdkData.broadcasted_transactions in accountBackup.data) ||
				!(ELdkData.payment_ids in accountBackup.data) ||
				!(ELdkData.timestamp in accountBackup.data)
			) {
				return err(
					`Invalid account backup data. Please ensure the following keys exist in the accountBackup object: ${ELdkData.channel_manager}, ${ELdkData.channel_monitors}, ${ELdkData.peers}, ${ELdkData.unconfirmed_transactions}`,
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
				remotePersist: false,
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
					remotePersist: false,
				});
				if (saveChannelRes.isErr()) {
					return err(saveChannelRes.error);
				}
			}

			const savePeersRes = await ldk.writeToFile({
				fileName: ELdkFiles.peers,
				path: accountPath,
				content: JSON.stringify(accountBackup.data.peers),
				remotePersist: false,
			});
			if (savePeersRes.isErr()) {
				return err(savePeersRes.error);
			}

			const savePaymentIdsRes = await ldk.writeToFile({
				fileName: ELdkFiles.payment_ids,
				path: accountPath,
				content: JSON.stringify(accountBackup.data.payment_ids),
				remotePersist: false,
			});
			if (savePaymentIdsRes.isErr()) {
				return err(savePaymentIdsRes.error);
			}

			const confirmedTxRes = await ldk.writeToFile({
				fileName: ELdkFiles.unconfirmed_transactions,
				path: accountPath,
				content: JSON.stringify(accountBackup.data.unconfirmed_transactions),
				remotePersist: false,
			});
			if (confirmedTxRes.isErr()) {
				return err(confirmedTxRes.error);
			}

			const broadcastedTxRes = await ldk.writeToFile({
				fileName: ELdkFiles.broadcasted_transactions,
				path: accountPath,
				content: JSON.stringify(accountBackup.data.broadcasted_transactions),
				remotePersist: false,
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

	payWithTimeout = async ({
		paymentRequest,
		amountSats,
		timeout = 20000,
	}: TPaymentReq): Promise<Result<TChannelManagerPaymentSent>> => {
		return new Promise(async (resolve) => {
			await ldk.writeToLogFile(
				'debug',
				`ldk.pay() called with hard timeout of ${timeout}ms`,
			);

			if (timeout < 1000) {
				return resolve(err('Timeout must be at least 1000ms.'));
			}

			this.subscribeToPaymentResponses(resolve);

			let payResponse: Result<string> | undefined = await ldk.pay({
				paymentRequest,
				amountSats,
				timeout,
			});

			await ldk.writeToLogFile(
				'debug',
				payResponse.isOk()
					? `ldk.pay() success (pending callbacks) Payment ID: ${payResponse.value}`
					: `ldk.pay() error ${payResponse.error.message}.`,
			);

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
	 * @returns {void}
	 */
	private subscribeToPaymentResponses = (resolve: any): void => {
		this.pathFailedSubscription = ldk.onEvent(
			EEventTypes.channel_manager_payment_path_failed,
			async (res: TChannelManagerPaymentPathFailed) => {
				if (res.payment_failed_permanently) {
					//Only resolve on a permanent failure, bindings will keep retrying otherwise.
					this.unsubscribeFromPaymentSubscriptions();
					this.removeLdkPaymentId(res.payment_id).then();
					//TODO return error message
					return resolve(err('Payment path failed.'));
				}
			},
		);
		this.paymentFailedSubscription = ldk.onEvent(
			EEventTypes.channel_manager_payment_failed,
			async (res: TChannelManagerPaymentFailed) => {
				this.unsubscribeFromPaymentSubscriptions();
				this.removeLdkPaymentId(res.payment_id).then();
				return resolve(err('Payment failed'));
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

	checkUnconfirmedTransactions = async (): Promise<Result<string>> => {
		let needsToSync = false;
		let newUnconfirmedTxs: TLdkUnconfirmedTransactions = [];
		await Promise.all(
			this.unconfirmedTxs.map(async (unconfirmedTx) => {
				const { txid, height } = unconfirmedTx;
				const newTxData = await this.getTransactionData(txid);

				//Tx was removed from mempool.
				if (!newTxData) {
					await ldk.setTxUnconfirmed(txid);
					needsToSync = true;
					return;
				}

				//Possible issue retrieving tx data from electrum. Keep current data. Try again later.
				if (!newTxData?.header && newTxData?.height === 0) {
					newUnconfirmedTxs.push(unconfirmedTx);
					return;
				}

				//Transaction is fully confirmed. No need to add it back to the newUnconfirmedTxs array.
				if (this.currentBlock.height - newTxData.height >= 6) {
					return;
				}

				//If the tx is less than its previously known height or the height has fallen back to zero, run setTxUnconfirmed.
				if (newTxData.height < height && newTxData.height === 0) {
					await ldk.setTxUnconfirmed(txid);
					needsToSync = true;
					return;
				}
				newUnconfirmedTxs.push({
					...newTxData,
					txid,
					script_pubkey: unconfirmedTx.script_pubkey,
				});
			}),
		);

		await this.updateUnconfirmedTxs(newUnconfirmedTxs);
		if (needsToSync) {
			await this.syncLdk({ force: true });
		}
		return ok('Unconfirmed transactions checked');
	};

	/**
	 * Returns transactions with less than 6 confirmations from storage.
	 * @returns {Promise<TLdkUnconfirmedTransactions[]>}
	 */
	private getLdkUnconfirmedTxs =
		async (): Promise<TLdkUnconfirmedTransactions> => {
			const res = await ldk.readFromFile({
				fileName: ELdkFiles.unconfirmed_transactions,
			});
			if (res.isOk()) {
				return parseData(res.value.content, []);
			}
			return [];
		};

	private getLdkPaymentIds = async (): Promise<TLdkPaymentIds> => {
		const res = await ldk.readFromFile({
			fileName: ELdkFiles.payment_ids,
		});
		if (res.isOk()) {
			let parsed = parseData(res.value.content, []);

			//Temp patch for wallets with incorrectly written payment ID file formats. Can be removed after a few releases.
			if (parsed.length === 64 && res.value.content.length === 66) {
				parsed = [parsed];
			}

			return parsed;
		}
		return [];
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
			remotePersist: false,
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
			remotePersist: false,
		});
	};

	/**
	 * Returns the payments claimed in storage.
	 * @returns {@link TChannelManagerClaim[]}
	 */
	getLdkPaymentsClaimed = async (): Promise<TChannelManagerClaim[]> => {
		const res = await ldk.readFromFile({
			fileName: ELdkFiles.payments_claimed,
		});
		if (res.isOk()) {
			return parseData(res.value.content, []);
		}
		return [];
	};

	/**
	 * Returns the payments sent in storage.
	 * @returns {@link TChannelManagerPaymentSent[]}
	 */
	getLdkPaymentsSent = async (): Promise<TChannelManagerPaymentSent[]> => {
		const res = await ldk.readFromFile({
			fileName: ELdkFiles.payments_sent,
		});
		if (res.isOk()) {
			return parseData(res.value.content, []);
		}
		return [];
	};

	/**
	 * Returns the previously created bolt11 invoices.
	 * @returns {@link TBolt11Invoices}
	 */
	getBolt11Invoices = async (): Promise<TBolt11Invoices> => {
		const res = await ldk.readFromFile({
			fileName: ELdkFiles.bolt11_invoices,
		});
		if (res.isOk()) {
			let parsed = parseData(res.value.content, []);

			return parsed;
		}
		return [];
	};

	appendBolt11Invoice = async (bolt11: string): Promise<void> => {
		let invoices = await this.getBolt11Invoices();
		if (invoices.includes(bolt11)) {
			return;
		}

		invoices.push(bolt11);
		await ldk.writeToFile({
			fileName: ELdkFiles.bolt11_invoices,
			content: JSON.stringify(invoices),
			remotePersist: false,
		});
	};

	/**
	 * Creates bolt11 payment request and stores it to disk
	 * @returns {Promise<Ok<TInvoice> | Err<TInvoice>> | Err<unknown>}
	 * @param req
	 */
	async createAndStorePaymentRequest(
		req: TCreatePaymentReq,
	): Promise<Result<TInvoice>> {
		const res = await ldk.createPaymentRequest(req);
		if (res.isOk()) {
			await this.appendBolt11Invoice(res.value.to_str);
		}

		return res;
	}

	/**
	 * Fetches a decoded invoice from the list of stored invoices if it exists.
	 * @returns {@link TInvoice | undefined}
	 */
	getInvoiceFromPaymentHash = async (
		paymentHash: string,
	): Promise<TInvoice | undefined> => {
		const invoices = await this.getBolt11Invoices();
		for (let index = 0; index < invoices.length; index++) {
			const paymentRequest = invoices[index];
			const invoiceRes = await ldk.decode({ paymentRequest });
			if (invoiceRes.isOk()) {
				if (invoiceRes.value.payment_hash === paymentHash) {
					return invoiceRes.value;
				}
			}
		}
	};

	private getLdkSpendableOutputs = async (): Promise<TLdkSpendableOutputs> => {
		const res = await ldk.readFromFile({
			fileName: ELdkFiles.spendable_outputs,
		});
		if (res.isOk()) {
			return parseData(res.value.content, []);
		}
		return [];
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
			return parseData(res.value.content, []);
		}
		return [];
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
	 * Attempts to recover outputs from stored spendable outputs.
	 * Also attempts to recreate outputs that were not previously stored but failed to be spent.
	 * @returns {Promise<string>}
	 */
	async recoverOutputs(): Promise<Result<string>> {
		//STEP 1: Try spend all cached outputs
		const outputs = await this.getLdkSpendableOutputs();
		for (const output of outputs) {
			await this.onChannelManagerSpendableOutputs({
				outputsSerialized: [output],
			});
		}

		let message = `Attempting to spend ${outputs.length} outputs from cache.`;

		//STEP 2: Reconstruct stuck output where we have a tx that failed to broadcast and no cached output due to prior bug.
		const txs = await this.getLdkBroadcastedTxs();
		if (!txs.length) {
			return ok(
				`${message} No outputs to reconstruct as no cached transactions found.`,
			);
		}

		let reconstructedTxs = 0;
		let failedBroadcastTxs = 0;
		for (const hexTx of txs) {
			const tx = bitcoin.Transaction.fromHex(hexTx);
			const txData = await this.getTransactionData(tx.getId());
			//Not confirmed and not in mempool
			if (!txData || txData?.height === 0) {
				const parsedTx = bitcoin.Transaction.fromHex(hexTx);
				//Unconfirmed and only has one input and 1 output, so it's likely our stuck output.
				const { ins, outs } = parsedTx;

				if (ins.length !== 1 || outs.length !== 1) {
					continue;
				}

				failedBroadcastTxs++;

				await ldk.writeToLogFile('info', 'Reconstructing output from tx...');

				const address = await this.getAddress();
				const changeDestinationScript = this.getChangeDestinationScript(
					address.address,
				);
				if (!changeDestinationScript) {
					await ldk.writeToLogFile(
						'error',
						'Unable to retrieve change_destination_script.',
					);
					continue;
				}

				//The input from this 'failed' tx is the clue to finding the output, and it's location from a previous tx
				const input = ins[0];
				const prevHash = input.hash.reverse().toString('hex');

				//Gets the output details from previous (closing tx)
				const outputFromChannelCloseTx = findOutputsFromRawTxs(
					txs,
					prevHash,
					input.index,
				);
				if (!outputFromChannelCloseTx) {
					await ldk.writeToLogFile(
						'error',
						'Unable to find output from channel close tx.',
					);
					continue;
				}

				const req: TReconstructAndSpendOutputsReq = {
					outputScriptPubKey: outputFromChannelCloseTx.outputScriptPubKey,
					outputValue: outputFromChannelCloseTx.outputValue,
					outpointTxId: outputFromChannelCloseTx.outpointTxId,
					outpointIndex: outputFromChannelCloseTx.outpointIndex,
					feeRate: await this.getOnChainSweepFeeRate(),
					changeDestinationScript: changeDestinationScript,
				};
				const res = await ldk.reconstructAndSpendOutputs(req);

				if (res.isOk()) {
					reconstructedTxs++;
					await ldk.writeToLogFile(
						'info',
						'Reconstructed tx for spendable output. ' + res.value,
					);
					await this.broadcastTransaction(res.value);
				}
			}
		}

		message += ` Reconstructed outputs from ${reconstructedTxs} of ${failedBroadcastTxs} transactions not previously broadcast successfully.`;

		ldk.writeToLogFile('info', message).catch(console.error);

		return ok(message);
	}

	/**
	 * Saves unconfiremd txs to storage.
	 * @param {TTransactionData} data
	 * @returns {Promise<Result<boolean>>}
	 */
	private saveUnconfirmedTx = async (
		data: TLdkUnconfirmedTransaction,
	): Promise<Result<boolean>> => {
		if (!data) {
			return err('No data provided to saveUnconfirmedTx');
		}
		const alreadyExists = this.unconfirmedTxs.find(
			(unconfirmedTx) => unconfirmedTx.txid === data.txid,
		);
		if (!alreadyExists) {
			this.unconfirmedTxs.push(data);
			return await ldk.writeToFile({
				fileName: ELdkFiles.unconfirmed_transactions,
				content: JSON.stringify(this.unconfirmedTxs),
				remotePersist: true,
			});
		}
		return ok(true);
	};

	/**
	 * Updates unconfirmed txs in storage.
	 * @param {TLdkUnconfirmedTransactions} unconfirmedTxs
	 * @returns {Promise<Result<boolean>>}
	 */
	private updateUnconfirmedTxs = async (
		unconfirmedTxs: TLdkUnconfirmedTransactions,
	): Promise<Result<boolean>> => {
		this.unconfirmedTxs = unconfirmedTxs;
		return await ldk.writeToFile({
			fileName: ELdkFiles.unconfirmed_transactions,
			content: JSON.stringify(this.unconfirmedTxs),
			remotePersist: true,
		});
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
				remotePersist: true,
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
			remotePersist: false,
		});
	};

	//LDK events

	private async onRegisterTx(res: TRegisterTxEvent): Promise<void> {
		const isDuplicate = this.watchTxs.some(
			(tx) => tx.script_pubkey === res.script_pubkey && tx.txid === res.txid,
		);
		if (!isDuplicate) {
			this.watchTxs.push(res);
		}
	}

	private async onRegisterOutput(res: TRegisterOutputEvent): Promise<void> {
		const isDuplicate = this.watchOutputs.some(
			(o) => o.script_pubkey === res.script_pubkey && o.index === res.index,
		);
		if (!isDuplicate) {
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
		await ldk.writeToLogFile('info', `Broadcasting tx: ${res.tx}`);
		this.broadcastTransaction(res.tx)
			.then(() => {
				ldk.writeToLogFile('info', `Broadcast tx successfully: ${res.tx}`);
			})
			.catch((e) => {
				ldk.writeToLogFile('error', `Error broadcasting tx: ${e}`);
			});

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

	private onChannelManagerPaymentClaimable(res: TChannelManagerClaim): void {
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

	private async onChannelManagerOpenChannelRequest(
		req: TChannelManagerOpenChannelRequest,
	): Promise<void> {
		//Only triggered if manually_accept_inbound_channels is set in user config
		await ldk.writeToLogFile(
			'info',
			`channel_manager_open_channel_request: ${JSON.stringify(req)}`,
		);

		const {
			temp_channel_id,
			counterparty_node_id,
			supports_zero_conf,
			requires_zero_conf,
		} = req;

		let trustedPeer0Conf = false;
		const isTrustedPeer =
			this.trustedZeroConfPeers.indexOf(counterparty_node_id) > -1;
		if (supports_zero_conf) {
			if (isTrustedPeer) {
				await ldk.writeToLogFile(
					'info',
					`Accepting zero conf channel from peer ${counterparty_node_id}`,
				);

				trustedPeer0Conf = true;
			}

			if (!isTrustedPeer && requires_zero_conf) {
				await ldk.writeToLogFile(
					'error',
					`Peer attempting to open zero conf required channel but is not in trusted peers list (${counterparty_node_id})`,
				);
			}
		}

		const res = await ldk.acceptChannel({
			temporaryChannelId: temp_channel_id,
			counterPartyNodeId: counterparty_node_id,
			trustedPeer0Conf,
		});

		if (res.isOk()) {
			await ldk.writeToLogFile(
				'info',
				`Accept channel success ${
					trustedPeer0Conf ? 'with trusted peer zero conf' : ''
				}`,
			);
		} else {
			await ldk.writeToLogFile(
				'error',
				`Accept channel ${
					trustedPeer0Conf ? '(trusted zero conf) ' : ''
				}error: ${JSON.stringify(res.error.message)}`,
			);
		}
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

	/**
	 * Returns a normal fee rate and will fall back to a rational default if unable to retrieve fee.
	 * @returns {Promise<number>} Fee rate in sats per 1000 weight
	 */
	private async getOnChainSweepFeeRate(): Promise<number> {
		try {
			let satsPerVByte = (await this.getFees()).onChainSweep;
			// Multiply by 250 because https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.FeeEstimator.html#tymethod.get_est_sat_per_1000_weight
			return satsPerVByte * 250;
		} catch (error) {
			let fallbackSatsPerByte = 10;
			await ldk.writeToLogFile(
				'error',
				`Unable to retrieve fee for spending output. Falling back to ${fallbackSatsPerByte} sats per byte. Error: ${error}`,
			);
			return fallbackSatsPerByte * 250; //Reasonable 10 sat/vbyte fallback
		}
	}

	private async onChannelManagerSpendableOutputs(
		res: TChannelManagerSpendableOutputs,
	): Promise<void> {
		console.warn(
			'onChannelManagerSpendableOutputs deprecated. You should only be seeing this if recently closed channel was opened prior to custom keys manager.',
		);
		const spendableOutputs = await this.getLdkSpendableOutputs();
		res.outputsSerialized.forEach((o) => {
			if (!spendableOutputs.includes(o)) {
				spendableOutputs.push(o);
			}
		});
		await ldk.writeToFile({
			fileName: ELdkFiles.spendable_outputs,
			content: JSON.stringify(spendableOutputs),
			remotePersist: true,
		});

		await ldk.writeToLogFile(
			'info',
			'Received spendable outputs. Saved to disk.',
		);

		const address = await this.getAddress();
		const change_destination_script = this.getChangeDestinationScript(
			address.address,
		);
		if (!change_destination_script) {
			await ldk.writeToLogFile(
				'error',
				'Unable to retrieve change_destination_script.',
			);
			return;
		}

		const fee = await this.getOnChainSweepFeeRate();
		const spendRes = await ldk.spendOutputs({
			descriptorsSerialized: res.outputsSerialized,
			outputs: [], //Shouldn't need to specify this if we're sweeping all funds to dest script
			change_destination_script,
			feerate_sat_per_1000_weight: fee,
		});

		if (spendRes.isErr()) {
			//TODO should we notify user?
			await ldk.writeToLogFile(
				'error',
				`Spending outputs failed: ${spendRes.error.message}`,
			);
			return;
		}

		await ldk.writeToLogFile(
			'info',
			`Created tx spending outputs: ${spendRes.value}`,
		);

		await this.onBroadcastTransaction({
			tx: spendRes.value,
		});
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

	private async onChannelManagerPaymentClaimed(
		res: TChannelManagerClaim,
	): Promise<void> {
		// Payment Received/Invoice Paid.
		console.log(`onChannelManagerPaymentClaimed: ${JSON.stringify(res)}`);
		this.syncLdk({ force: true }).then();
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

	/**
	 * Called when on iOS when the app is backgrounded and brought back to the foreground.
	 * Channel manager constructor is automatically initialized again, so we need to re-add peers and sync LDK.
	 * @returns {Promise<void>}
	 */
	private async onChannelManagerRestarted(): Promise<void> {
		// Re add cached peers
		await this.setFees();
		await this.addPeers();
		await this.syncLdk();
	}

	/**
	 * Called with each sync to remove expired and unclaimed invoices.
	 * An invoice is expired if there is no payments claimed (received) for it
	 * after MAX_PENDING_PAY_AGE.
	 */
	private async removeExpiredAndUnclaimedInvoices(): Promise<void> {
		const invoices = await this.getBolt11Invoices();
		const claimedPayments = await this.getLdkPaymentsClaimed();
		const expiredAndUnclaimedInvoices: TBolt11Invoices = [];

		for (let index = 0; index < invoices.length; index++) {
			const paymentRequest = invoices[index];
			const invoiceRes = await ldk.decode({ paymentRequest });
			if (invoiceRes.isOk()) {
				const invoice = invoiceRes.value;
				const invoiceAge = Date.now() - invoice.timestamp * 1000;
				const isOld = invoiceAge > MAX_PENDING_PAY_AGE;
				if (isOld) {
					const payment = claimedPayments.find(
						(it) => it.payment_hash === invoice.payment_hash,
					);
					const isClaimed = payment?.state === 'successful';
					if (!isClaimed) {
						expiredAndUnclaimedInvoices.push(paymentRequest);
					}
				}
			}
		}

		if (expiredAndUnclaimedInvoices.length === 0) {
			return;
		}

		const filteredInvoices = invoices.filter(
			(it) => !expiredAndUnclaimedInvoices.includes(it),
		);

		await ldk.writeToLogFile(
			'info',
			`Removing ${expiredAndUnclaimedInvoices.length} expired and unclaimed invoices.`,
		);
		await ldk.writeToFile({
			fileName: ELdkFiles.bolt11_invoices,
			content: JSON.stringify(filteredInvoices),
			remotePersist: false,
		});
	}

	private async removeStalePaymentClaims(): Promise<void> {
		const claims = await this.getLdkPaymentsClaimed();
		const staleClaims: TChannelManagerClaim[] = [];

		for (let index = 0; index < claims.length; index++) {
			const payment = claims[index];
			const isPending = payment.state === 'pending';
			const age = Date.now() - payment.unix_timestamp * 1000;
			const isStale = age > MAX_PENDING_PAY_AGE;
			if (isPending && isStale) {
				staleClaims.push(payment);
			}
		}

		if (staleClaims.length === 0) {
			return;
		}

		const filteredClaims = claims.filter((it) => !staleClaims.includes(it));

		await ldk.writeToLogFile(
			'info',
			`Removing ${staleClaims.length} stale payment claims.`,
		);

		await ldk.writeToFile({
			fileName: ELdkFiles.payments_claimed,
			content: JSON.stringify(filteredClaims),
			remotePersist: true,
		});
	}
}

export default new LightningManager();
