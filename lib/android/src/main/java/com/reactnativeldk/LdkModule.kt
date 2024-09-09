package com.reactnativeldk

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.reactnativeldk.classes.*
import org.json.JSONObject
import org.ldk.batteries.ChannelManagerConstructor
import org.ldk.batteries.NioPeerHandler
import org.ldk.enums.Currency
import org.ldk.enums.Network
import org.ldk.enums.Recipient
import org.ldk.enums.RetryableSendFailure
import org.ldk.impl.bindings.get_ldk_c_bindings_version
import org.ldk.impl.bindings.get_ldk_version
import org.ldk.structs.*
import org.ldk.structs.Result_Bolt11InvoiceParseOrSemanticErrorZ.Result_Bolt11InvoiceParseOrSemanticErrorZ_OK
import org.ldk.structs.Result_Bolt11InvoiceSignOrCreationErrorZ.Result_Bolt11InvoiceSignOrCreationErrorZ_OK
import org.ldk.structs.Result_C2Tuple_ThirtyTwoBytesChannelMonitorZDecodeErrorZ.Result_C2Tuple_ThirtyTwoBytesChannelMonitorZDecodeErrorZ_OK
import org.ldk.structs.Result_C3Tuple_ThirtyTwoBytesRecipientOnionFieldsRouteParametersZNoneZ.Result_C3Tuple_ThirtyTwoBytesRecipientOnionFieldsRouteParametersZNoneZ_OK
import org.ldk.structs.Result_NoneRetryableSendFailureZ.Result_NoneRetryableSendFailureZ_Err
import org.ldk.structs.Result_PublicKeyNoneZ.Result_PublicKeyNoneZ_OK
import org.ldk.structs.Result_StrSecp256k1ErrorZ.Result_StrSecp256k1ErrorZ_OK
import org.ldk.util.UInt128
import java.io.File
import java.net.InetSocketAddress
import java.net.URL
import java.nio.file.Files
import java.nio.file.Paths
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.ScheduledThreadPoolExecutor
import java.util.concurrent.TimeUnit


//MARK: ************Replicate in typescript and swift************
enum class EventTypes {
    ldk_log,
    native_log,
    register_tx,
    register_output,
    broadcast_transaction,
    channel_manager_funding_generation_ready,
    channel_manager_payment_claimable,
    channel_manager_payment_sent,
    channel_manager_open_channel_request,
    channel_manager_payment_path_successful,
    channel_manager_payment_path_failed,
    channel_manager_payment_failed,
    channel_manager_pending_htlcs_forwardable,
    channel_manager_spendable_outputs,
    channel_manager_channel_closed,
    channel_manager_discard_funding,
    channel_manager_payment_claimed,
    new_channel,
    network_graph_updated,
    channel_manager_restarted,
    backup_state_update,
    lsp_log,
    used_close_address
}
//*****************************************************************

enum class LdkErrors {
    unknown_error,
    already_init,
    create_storage_dir_fail,
    init_storage_path,
    invalid_seed_hex,
    init_chain_monitor,
    init_keys_manager,
    init_user_config,
    init_peer_manager,
    invalid_network,
    init_network_graph,
    init_peer_handler,
    add_peer_fail,
    init_channel_manager,
    decode_invoice_fail,
    invoice_payment_fail_unknown,
    invoice_payment_fail_must_specify_amount,
    invoice_payment_fail_must_not_specify_amount,
    invoice_payment_fail_invoice,
    invoice_payment_fail_duplicate_payment,
    invoice_payment_fail_payment_expired,
    invoice_payment_fail_route_not_found,
    init_ldk_currency,
    invoice_create_failed,
    init_scorer_failed,
    channel_close_fail,
    start_create_channel_fail,
    fund_channel_fail,
    channel_accept_fail,
    spend_outputs_fail,
    failed_signing_request,
    write_fail,
    read_fail,
    file_does_not_exist,
    data_too_large_for_rn,
    backup_setup_required,
    backup_check_failed,
    backup_setup_failed,
    backup_restore_failed,
    backup_restore_failed_existing_files,
    backup_file_failed,
    scorer_download_fail
}

enum class LdkCallbackResponses {
    storage_path_set,
    fees_updated,
    log_level_updated,
    log_path_updated,
    log_write_success,
    keys_manager_init_success,
    channel_manager_init_success,
    config_init_success,
    network_graph_init_success,
    add_peer_success,
    peer_already_connected,
    peer_currently_connecting,
    chain_sync_success,
    invoice_payment_success,
    tx_set_confirmed,
    tx_set_unconfirmed,
    process_pending_htlc_forwards_success,
    claim_funds_success,
    fail_htlc_backwards_success,
    ldk_stop,
    ldk_restart,
    accept_channel_success,
    close_channel_success,
    start_create_channel_fail,
    fund_channel_success,
    file_write_success,
    backup_client_setup_success,
    backup_restore_success,
    backup_client_check_success,
    backup_file_success,
    scorer_download_success,
    scorer_download_skip
}

enum class LdkFileNames(val fileName: String) {
    NetworkGraph("network_graph.bin"),
    ChannelManager("channel_manager.bin"),
    Scorer("scorer.bin"),
    PaymentsClaimed("payments_claimed.json"),
    PaymentsSent("payments_sent.json"),
}

class LdkModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    init {
        LdkEventEmitter.setContext(reactContext)
    }

    override fun getName(): String {
        return "Ldk"
    }

    //Zero config objects lazy loaded into memory when required
    private val feeEstimator: LdkFeeEstimator by lazy { LdkFeeEstimator() }
    private val logger: LdkLogger by lazy { LdkLogger() }
    private val broadcaster: LdkBroadcaster by lazy { LdkBroadcaster() }
    private val persister: LdkPersister by lazy { LdkPersister() }
    private val filter: LdkFilter by lazy { LdkFilter() }
    private val channelManagerPersister: LdkChannelManagerPersister by lazy { LdkChannelManagerPersister() }

    //Config required to setup below objects
    private var keysManager: CustomKeysManager? = null
    private var channelManager: ChannelManager? = null
    private var userConfig: UserConfig? = null
    private var networkGraph: NetworkGraph? = null
    private var rapidGossipSync: RapidGossipSync? = null
    private var peerManager: PeerManager? = null
    private var peerHandler: NioPeerHandler? = null
    private var channelManagerConstructor: ChannelManagerConstructor? = null
    private var ldkNetwork: Network? = null
    private var ldkCurrency: Currency? = null

    //Keep these in memory for restarting the channel manager constructor
    private var currentNetwork: String? = null
    private var currentBlockchainTipHash: String? = null
    private var currentBlockchainHeight: Double? = null

    //List of peers that "should" remain connected. Stores address: String, port: Double, pubKey: String
    private var addedPeers = ConcurrentLinkedQueue<Map<String, Any>>()
    private var currentlyConnectingPeers = ConcurrentLinkedQueue<String>()
    private var periodicDroppedPeersHandler: ScheduledFuture<*>? = null

    //Static to be accessed from other classes
    companion object {
        lateinit var accountStoragePath: String
        lateinit var channelStoragePath: String

        var chainMonitor: ChainMonitor? = null
    }

    init {
        accountStoragePath = ""
        channelStoragePath = ""
    }

    //Startup methods

    @ReactMethod
    fun setAccountStoragePath(storagePath: String, promise: Promise) {
        val accountStoragePath = File(storagePath)
        val channelStoragePath = File("$storagePath/channels/")

        try {
            if (!accountStoragePath.exists()) {
                accountStoragePath.mkdirs()
            }
            if (!channelStoragePath.exists()) {
                channelStoragePath.mkdirs()
            }
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.create_storage_dir_fail, Error(e))
        }

        LdkModule.accountStoragePath = accountStoragePath.absolutePath
        LdkModule.channelStoragePath = channelStoragePath.absolutePath

        handleResolve(promise, LdkCallbackResponses.keys_manager_init_success)
    }

    @ReactMethod
    fun setLogFilePath(path: String, promise: Promise) {
        val logFile = File(path)

        try {
            if (!logFile.parentFile.exists()) {
                logFile.parentFile.mkdirs()
            }
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.create_storage_dir_fail, Error(e))
        }

        LogFile.setFilePath(logFile)
        handleResolve(promise, LdkCallbackResponses.log_path_updated)
    }

    @ReactMethod
    fun writeToLogFile(line: String, promise: Promise) {
        LogFile.write(line)

        handleResolve(promise, LdkCallbackResponses.log_write_success)
    }

    @ReactMethod
    fun initKeysManager(seed: String, address: String, destinationScriptPublicKey: String, witnessProgram: String, witnessProgramVersion: Double, promise: Promise) {
        if (keysManager != null) {
            return handleResolve(promise, LdkCallbackResponses.keys_manager_init_success)
        }

        val nanoSeconds = System.currentTimeMillis() * 1000
        val seconds = nanoSeconds / 1000 / 1000
        val seedBytes = seed.hexa()

        if (seedBytes.count() != 32) {
            return handleReject(promise, LdkErrors.invalid_seed_hex)
        }

        keysManager = CustomKeysManager(
            seedBytes,
            seconds,
            nanoSeconds.toInt(),
            address,
            destinationScriptPublicKey.hexa(),
            witnessProgram.hexa(),
            witnessProgramVersion.toInt().toByte()
        )

        handleResolve(promise, LdkCallbackResponses.keys_manager_init_success)
    }

    @ReactMethod
    fun initUserConfig(userConfig: ReadableMap, promise: Promise) {
        if (this.userConfig !== null) {
            return handleReject(promise, LdkErrors.already_init)
        }

        this.userConfig = UserConfig.with_default().mergeWithMap(userConfig)

        handleResolve(promise, LdkCallbackResponses.config_init_success)
    }

    @ReactMethod
    fun downloadScorer(scorerSyncUrl: String, skipHoursThreshold: Double, promise: Promise) {
        val scorerFile = File(accountStoragePath + "/" + LdkFileNames.Scorer.fileName)
        //If old one is still recent, skip download. Else delete it.
        if (scorerFile.exists()) {
            val lastModifiedHours = (System.currentTimeMillis().toDouble() - scorerFile.lastModified().toDouble()) / 1000 / 60 / 60
            if (lastModifiedHours < skipHoursThreshold) {
                LdkEventEmitter.send(EventTypes.native_log, "Skipping scorer download. Last updated $lastModifiedHours hours ago.")
                return handleResolve(promise, LdkCallbackResponses.scorer_download_skip)
            }

            scorerFile.delete()
        }

        Thread(Runnable {
            val destinationFile = accountStoragePath + "/" + LdkFileNames.Scorer.fileName

            URL(scorerSyncUrl).downloadFile(destinationFile) { error ->
                if (error != null) {
                    UiThreadUtil.runOnUiThread {
                        handleReject(promise, LdkErrors.scorer_download_fail, Error(error))
                    }
                    return@downloadFile
                }

                UiThreadUtil.runOnUiThread {
                    LdkEventEmitter.send(EventTypes.native_log, "Scorer downloaded successfully.")
                    handleResolve(promise, LdkCallbackResponses.scorer_download_success)
                }
                return@downloadFile
            }
        }).start()
    }

    @ReactMethod
    fun initNetworkGraph(network: String, rapidGossipSyncUrl: String, skipHoursThreshold: Double, promise: Promise) {
        if (networkGraph != null) {
            return handleReject(promise, LdkErrors.already_init)
        }

        val networkGraphFile = File(accountStoragePath + "/" + LdkFileNames.NetworkGraph.fileName)
        if (networkGraphFile.exists()) {
            (NetworkGraph.read(networkGraphFile.readBytes(), logger.logger) as? Result_NetworkGraphDecodeErrorZ.Result_NetworkGraphDecodeErrorZ_OK)?.let { res ->
                networkGraph = res.res
            }
        }

        if (networkGraph == null) {
            val ldkNetwork = getNetwork(network)
            networkGraph = NetworkGraph.of(ldkNetwork.first, logger.logger)

            LdkEventEmitter.send(EventTypes.native_log, "Failed to load cached network graph from disk. Will sync from scratch.")
        }

        //Normal p2p gossip sync
        if (rapidGossipSyncUrl == "") {
            return handleResolve(promise, LdkCallbackResponses.network_graph_init_success)
        }

        val rapidGossipSyncStoragePath = File("$accountStoragePath/rapid_gossip_sync/")
        try {
            if (!rapidGossipSyncStoragePath.exists()) {
                rapidGossipSyncStoragePath.mkdirs()
            }
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.create_storage_dir_fail, Error(e))
        }

        rapidGossipSync = RapidGossipSync.of(networkGraph, logger.logger)

        //If it's been more than 24 hours then we need to update RGS
        val timestamp = if (networkGraph!!._last_rapid_gossip_sync_timestamp is Option_u32Z.Some) (networkGraph!!._last_rapid_gossip_sync_timestamp as Option_u32Z.Some).some.toLong() else 0 // (networkGraph!!._last_rapid_gossip_sync_timestamp as Option_u32Z.Some).some
        val minutesDiffSinceLastRGS = (System.currentTimeMillis() / 1000 - timestamp) / 60
        if (minutesDiffSinceLastRGS < (60 * skipHoursThreshold)) {
            LdkEventEmitter.send(EventTypes.native_log, "Skipping rapid gossip sync. Last updated ${minutesDiffSinceLastRGS/60} hours ago.")
            return handleResolve(promise, LdkCallbackResponses.network_graph_init_success)
        }

        LdkEventEmitter.send(EventTypes.native_log, "Rapid gossip sync applying update. Last updated ${minutesDiffSinceLastRGS/60} hours ago.")

        rapidGossipSync!!.downloadAndUpdateGraph(rapidGossipSyncUrl, "$accountStoragePath/rapid_gossip_sync/", timestamp) { error ->
            if (error != null) {
                LdkEventEmitter.send(EventTypes.native_log, "Rapid gossip sync fail. " + error.localizedMessage)

                //Temp fix for when a RGS server is changed or reset
                if (error.localizedMessage.contains("LightningError")) {
                    if (networkGraphFile.exists()) {
                        networkGraphFile.delete()
                    }
                    LdkEventEmitter.send(EventTypes.native_log, "Deleting persisted graph. Will sync from scratch on next startup.")
                }

                handleResolve(promise, LdkCallbackResponses.network_graph_init_success) //Continue like normal, likely fine if we don't have the absolute latest state
                return@downloadAndUpdateGraph
            }

            LdkEventEmitter.send(EventTypes.native_log, "Rapid gossip sync completed.")

            if (networkGraph == null) {
                handleReject(promise, LdkErrors.create_storage_dir_fail, Error("Failed to use network graph."))
                return@downloadAndUpdateGraph
            }

            channelManagerPersister.persist_network_graph(networkGraph!!.write())

            val body = Arguments.createMap()
            body.putInt("channel_count", networkGraph!!.read_only().list_channels().count())
            body.putInt("node_count", networkGraph!!.read_only().list_nodes().count())
            LdkEventEmitter.send(EventTypes.network_graph_updated, body)

            handleResolve(promise, LdkCallbackResponses.network_graph_init_success)
        }
    }

    @ReactMethod
    fun initChannelManager(network: String, blockHash: String, blockHeight: Double, promise: Promise) {
        if (channelManager !== null) {
            return handleReject(promise, LdkErrors.already_init)
        }

        keysManager ?: return handleReject(promise, LdkErrors.init_keys_manager)
        userConfig ?: return handleReject(promise, LdkErrors.init_user_config)
        networkGraph ?: return handleReject(promise, LdkErrors.init_network_graph)
        if (accountStoragePath == "") {
            return handleReject(promise, LdkErrors.init_storage_path)
        }
        if (channelStoragePath == "") {
            return handleReject(promise, LdkErrors.init_storage_path)
        }

        ldkNetwork = getNetwork(network).first
        ldkCurrency = getNetwork(network).second

        val enableP2PGossip = rapidGossipSync == null

        var channelManagerSerialized: ByteArray? = null
        val channelManagerFile = File(accountStoragePath + "/" + LdkFileNames.ChannelManager.fileName)
        if (channelManagerFile.exists()) {
           channelManagerSerialized = channelManagerFile.readBytes()
        }

        //Scorer setup
        val probabilisticScorer = getProbabilisticScorer(
            accountStoragePath,
            networkGraph!!,
            logger.logger
        ) ?: return handleReject(promise, LdkErrors.init_scorer_failed)

        val scorer = MultiThreadedLockableScore.of(probabilisticScorer.as_Score())

        val scoringParams = ProbabilisticScoringDecayParameters.with_default()
        val scoringFeeParams = ProbabilisticScoringFeeParameters.with_default()
        scoringFeeParams._base_penalty_msat = 500*1000

        LdkEventEmitter.send(EventTypes.native_log, "Overriding base_penalty_msat: ${scoringFeeParams._base_penalty_msat}")

        chainMonitor = ChainMonitor.of(
            Option_FilterZ.some(filter.filter),
            broadcaster.broadcaster,
            logger.logger,
            feeEstimator.feeEstimator,
            persister.persister
        )

        try {
            if (channelManagerSerialized != null) {
                //Restoring node
                LdkEventEmitter.send(EventTypes.native_log, "Restoring node from disk")
                val channelMonitors: MutableList<ByteArray> = arrayListOf()
                Files.walk(Paths.get(channelStoragePath))
                    .filter { Files.isRegularFile(it) }
                    .forEach {
                        LdkEventEmitter.send(EventTypes.native_log, "Loading channel from file " + it.fileName)
                        channelMonitors.add(it.toFile().readBytes())
                    }

                channelManagerConstructor = ChannelManagerConstructor(
                    channelManagerSerialized,
                    channelMonitors.toTypedArray(),
                    userConfig!!,
                    keysManager!!.inner.as_EntropySource(),
                    keysManager!!.inner.as_NodeSigner(),
                    SignerProvider.new_impl(keysManager!!.signerProvider),
                    feeEstimator.feeEstimator,
                    chainMonitor!!,
                    filter.filter,
                    networkGraph!!.write(),
                    scoringParams,
                    scoringFeeParams,
                    scorer.write(),
                    null,
                    broadcaster.broadcaster,
                    logger.logger
                )
            } else {
                //New node
                LdkEventEmitter.send(EventTypes.native_log, "Creating new channel manager")
                channelManagerConstructor = ChannelManagerConstructor(
                    ldkNetwork,
                    userConfig,
                    blockHash.hexa().reversedArray(),
                    blockHeight.toInt(),
                    keysManager!!.inner.as_EntropySource(),
                    keysManager!!.inner.as_NodeSigner(),
                    SignerProvider.new_impl(keysManager!!.signerProvider),
                    feeEstimator.feeEstimator,
                    chainMonitor,
                    networkGraph!!,
                    scoringParams,
                    scoringFeeParams,
                    null,
                    broadcaster.broadcaster,
                    logger.logger,
                )
            }
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.unknown_error, Error(e))
        }

        channelManager = channelManagerConstructor!!.channel_manager

        LogFile.write("Node ID: ${channelManager!!._our_node_id.hexEncodedString()}")

        channelManagerConstructor!!.chain_sync_completed(channelManagerPersister, enableP2PGossip)
        peerManager = channelManagerConstructor!!.peer_manager

        peerHandler = channelManagerConstructor!!.nio_peer_handler

        //after 1s, Start watching for dropped peers every 3 seconds
        if (periodicDroppedPeersHandler == null) {
            periodicDroppedPeersHandler = ScheduledThreadPoolExecutor(1)
                .scheduleWithFixedDelay(::handleDroppedPeers,1, 3, TimeUnit.SECONDS)
        }

        //Cached for restarts
        currentNetwork = network
        currentBlockchainTipHash = blockHash
        currentBlockchainHeight = blockHeight

        handleResolve(promise, LdkCallbackResponses.channel_manager_init_success)
    }

    @ReactMethod
    fun restart(promise: Promise) {
        if (channelManagerConstructor == null) {
            return handleReject(promise, LdkErrors.init_channel_manager)
        }

        //Node was never started
        val currentNetwork = currentNetwork ?: return handleReject(promise, LdkErrors.init_channel_manager)
        val currentBlockchainTipHash = currentBlockchainTipHash ?: return handleReject(promise, LdkErrors.init_channel_manager)
        val currentBlockchainHeight = currentBlockchainHeight ?: return handleReject(promise, LdkErrors.init_channel_manager)

        LdkEventEmitter.send(EventTypes.native_log, "Stopping LDK background tasks")

        //Reset only objects created by initChannelManager
        channelManagerConstructor?.interrupt()
        channelManagerConstructor = null
        channelManager = null
        peerManager = null
        peerHandler = null

        LdkEventEmitter.send(EventTypes.native_log, "Starting LDK background tasks again")

        val initPromise = PromiseImpl(
            { resolve ->
                LdkEventEmitter.send(EventTypes.channel_manager_restarted, "")
                LdkEventEmitter.send(EventTypes.native_log, "LDK restarted successfully")
                handleResolve(promise, LdkCallbackResponses.ldk_restart)
        },
            { reject ->
                LdkEventEmitter.send(EventTypes.native_log, "Error restarting LDK. Error: $reject")
                handleReject(promise, LdkErrors.unknown_error)
        })

        initChannelManager(
            currentNetwork,
            currentBlockchainTipHash,
            currentBlockchainHeight,
            initPromise
        )
    }

    @ReactMethod
    fun stop(promise: Promise) {
        channelManagerConstructor?.interrupt()
        channelManagerConstructor = null
        chainMonitor = null
        keysManager = null
        channelManager = null
        userConfig = null
        networkGraph = null
        peerManager = null
        peerHandler = null
        ldkNetwork = null
        ldkCurrency = null

        handleResolve(promise, LdkCallbackResponses.ldk_stop)
    }

    //MARK: Update methods

    @ReactMethod
    fun updateFees(anchorChannelFee: Double, nonAnchorChannelFee: Double, channelCloseMinimum: Double, minAllowedAnchorChannelRemoteFee: Double, onChainSweep: Double, minAllowedNonAnchorChannelRemoteFee: Double, promise: Promise) {
        feeEstimator.update(anchorChannelFee.toInt(), nonAnchorChannelFee.toInt(), channelCloseMinimum.toInt(), minAllowedAnchorChannelRemoteFee.toInt(), onChainSweep.toInt(), minAllowedNonAnchorChannelRemoteFee.toInt())
        handleResolve(promise, LdkCallbackResponses.fees_updated)
    }

    @ReactMethod
    fun setLogLevel(level: String, active: Boolean, promise: Promise) {
        logger.setLevel(level, active)
        handleResolve(promise, LdkCallbackResponses.log_level_updated)
    }

    @ReactMethod
    fun syncToTip(header: String, blockHash: String, height: Double, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)
        chainMonitor ?: return handleReject(promise, LdkErrors.init_chain_monitor)

        try {
            channelManager!!.as_Confirm().best_block_updated(header.hexa(), height.toInt())
            chainMonitor!!.as_Confirm().best_block_updated(header.hexa(), height.toInt())
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.unknown_error, Error(e))
        }

        //Used for quick restarts
        currentBlockchainTipHash = blockHash
        currentBlockchainHeight = height

        handleResolve(promise, LdkCallbackResponses.chain_sync_success)
    }

    private fun handleDroppedPeers() {
        peerHandler ?: return LdkEventEmitter.send(EventTypes.native_log, "Handling dropped peers error. Peer handler not initialized.")

        LdkEventEmitter.send(EventTypes.native_log, "Checking for dropped peers")

        val currentlyConnected = peerManager!!.list_peers().map { it._counterparty_node_id.hexEncodedString() }

        addedPeers.forEach { peer ->
            val pubKey = peer["pubKey"] as String
            val address = peer["address"] as String
            val port = peer["port"] as Double

            if (currentlyConnected.contains(pubKey)) {
                return
            }

            if (currentlyConnectingPeers.contains(pubKey)) {
                return
            }

            try {
                currentlyConnectingPeers.add(pubKey)
                peerHandler!!.connect(pubKey.hexa(), InetSocketAddress(address, port.toInt()), 3000)
                LdkEventEmitter.send(EventTypes.native_log, "Connection to peer $pubKey re-established by handleDroppedPeers().")
            } catch (e: Exception) {
                LdkEventEmitter.send(EventTypes.native_log, "Error connecting peer from handleDroppedPeers() $pubKey. Error: $e")
            } finally {
                currentlyConnectingPeers.remove(pubKey)
            }
        }
    }

    @ReactMethod
    fun addPeer(address: String, port: Double, pubKey: String, timeout: Double, promise: Promise) {
        peerHandler ?: return handleReject(promise, LdkErrors.init_peer_handler)

        //If peer is already connected don't add again
        val currentList = peerManager!!.list_peers().map { it._counterparty_node_id.hexEncodedString() }
        if (currentList.contains(pubKey)) {
            return handleResolve(promise, LdkCallbackResponses.peer_already_connected)
        }

        //If peer is being currently connected don't add again
        if (currentlyConnectingPeers.contains(pubKey)) {
            return handleResolve(promise, LdkCallbackResponses.peer_currently_connecting)
        }
        
        try {
            currentlyConnectingPeers.add(pubKey)
            peerHandler!!.connect(pubKey.hexa(), InetSocketAddress(address, port.toInt()), timeout.toInt())

            handleResolve(promise, LdkCallbackResponses.add_peer_success)
        } catch (e: Exception) {
            handleReject(promise, LdkErrors.add_peer_fail, Error(e))
        } finally {
            currentlyConnectingPeers.remove(pubKey)

            //Should retry if success or fail
            if (addedPeers.none { it["pubKey"] as String == pubKey }) {
                addedPeers.add(hashMapOf(
                    "address" to address,
                    "port" to port,
                    "pubKey" to pubKey
                ))
            }
        }
    }

    @ReactMethod
    fun setTxConfirmed(header: String, txData: ReadableArray, height: Double, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)
        chainMonitor ?: return handleReject(promise, LdkErrors.init_chain_monitor)

        val confirmTxData: MutableList<TwoTuple_usizeTransactionZ> = ArrayList()

        var msg = ""
        txData.toArrayList().iterator().forEach { tx ->
            val txMap = tx as HashMap<*, *>
            confirmTxData.add(
                TwoTuple_usizeTransactionZ.of(
                    (txMap.get("pos") as Double).toLong(),
                    (txMap.get("transaction") as String).hexa()
                )
            )
        }

        channelManager!!.as_Confirm().transactions_confirmed(header.hexa(), confirmTxData.toTypedArray(), height.toInt())
        chainMonitor!!.as_Confirm().transactions_confirmed(header.hexa(), confirmTxData.toTypedArray(), height.toInt())

        handleResolve(promise, LdkCallbackResponses.tx_set_confirmed)
    }

    @ReactMethod
    fun setTxUnconfirmed(txId: String, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)
        chainMonitor ?: return handleReject(promise, LdkErrors.init_chain_monitor)

        channelManager!!.as_Confirm().transaction_unconfirmed(txId.hexa())
        chainMonitor!!.as_Confirm().transaction_unconfirmed(txId.hexa())

        handleResolve(promise, LdkCallbackResponses.tx_set_unconfirmed)
    }

    @ReactMethod
    fun acceptChannel(temporaryChannelId: String, counterPartyNodeId: String, trustedPeer0Conf: Boolean, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        val temporaryChannelId = ChannelId.of(temporaryChannelId.hexa())
        val counterPartyNodeId = counterPartyNodeId.hexa()
        val userChannelIdBytes = ByteArray(16)
        Random().nextBytes(userChannelIdBytes)
        val userChannelId = UInt128(userChannelIdBytes)

        val res = if (trustedPeer0Conf)
            channelManager!!.accept_inbound_channel_from_trusted_peer_0conf(temporaryChannelId, counterPartyNodeId, userChannelId)
        else channelManager!!.accept_inbound_channel(temporaryChannelId, counterPartyNodeId, userChannelId)

        if (!res.is_ok) {
            val error = res as Result_NoneAPIErrorZ.Result_NoneAPIErrorZ_Err

            if (error.err is APIError.APIMisuseError) {
                return handleReject(promise, LdkErrors.channel_accept_fail, Error((error.err as APIError.APIMisuseError).err))
            }

            if (error.err is APIError.ChannelUnavailable) {
                return handleReject(promise, LdkErrors.channel_accept_fail, Error((error.err as APIError.ChannelUnavailable).err))
            }

            return handleReject(promise, LdkErrors.channel_accept_fail, Error(error.err.toString()))
        }

        handleResolve(promise, LdkCallbackResponses.accept_channel_success)
    }

    @ReactMethod
    fun closeChannel(channelId: String, counterpartyNodeId: String, force: Boolean, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        val channelIdObj = ChannelId.of(channelId.hexa())
        val res = if (force) channelManager!!.force_close_broadcasting_latest_txn(channelIdObj, counterpartyNodeId.hexa()) else channelManager!!.close_channel(channelIdObj, counterpartyNodeId.hexa())
        if (!res.is_ok) {
            return handleReject(promise, LdkErrors.channel_close_fail)
        }

        handleResolve(promise, LdkCallbackResponses.close_channel_success)
    }

    @ReactMethod
    fun createChannel(counterPartyNodeId: String, channelValueSats: Double, pushSats: Double, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)
        keysManager ?: return handleReject(promise, LdkErrors.init_keys_manager)

        val theirNetworkKey = counterPartyNodeId.hexa()
        val channelValueSatoshis = channelValueSats.toLong()
        val pushMsat = pushSats.toLong() * 1000
        val userChannelIdBytes = ByteArray(16)
        Random().nextBytes(userChannelIdBytes)
        val userChannelId = UInt128(userChannelIdBytes)

        val tempChannelId = ChannelId.temporary_from_entropy_source(keysManager!!.inner.as_EntropySource())

        val res = channelManager!!.create_channel(
            theirNetworkKey,
            channelValueSatoshis,
            pushMsat,
            userChannelId,
            tempChannelId,
            UserConfig.with_default()
        )

        if (!res.is_ok) {
            return handleReject(promise, LdkErrors.start_create_channel_fail)
        }

        handleResolve(promise, LdkCallbackResponses.start_create_channel_fail)
    }

    @ReactMethod
    fun fundChannel(temporaryChannelId: String, counterPartyNodeId: String, fundingTransaction: String, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        val res = channelManager!!.funding_transaction_generated(
            ChannelId.of(temporaryChannelId.hexa()),
            counterPartyNodeId.hexa(),
            fundingTransaction.hexa()
        )

        if (res.is_ok) {
            handleResolve(promise, LdkCallbackResponses.fund_channel_success)
            return
        }

        val error = res as Result_NoneAPIErrorZ.Result_NoneAPIErrorZ_Err

        if (error.err is APIError.APIMisuseError) {
            return handleReject(promise, LdkErrors.channel_accept_fail, Error((error.err as APIError.APIMisuseError).err))
        }

        if (error.err is APIError.ChannelUnavailable) {
            return handleReject(promise, LdkErrors.channel_accept_fail, Error((error.err as APIError.ChannelUnavailable).err))
        }

        LdkEventEmitter.send(EventTypes.native_log, "Fund channel failed. ${error.err}")

        handleReject(promise, LdkErrors.fund_channel_fail)
    }

    @ReactMethod
    fun forceCloseAllChannels(broadcastLatestTx: Boolean, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        if (broadcastLatestTx) {
            channelManager!!.force_close_all_channels_broadcasting_latest_txn()
        } else {
            channelManager!!.force_close_all_channels_without_broadcasting_txn()
        }

        handleResolve(promise, LdkCallbackResponses.close_channel_success)
    }

    @ReactMethod
    fun spendOutputs(descriptorsSerialized: ReadableArray, outputs: ReadableArray, changeDestinationScript: String, feeRate: Double, promise: Promise) {
        keysManager ?: return handleReject(promise, LdkErrors.init_keys_manager)

        val ldkDescriptors: MutableList<SpendableOutputDescriptor> = arrayListOf()
        descriptorsSerialized.toArrayList().iterator().forEach { descriptor ->
            val read = SpendableOutputDescriptor.read((descriptor as String).hexa())
            if (!read.is_ok) {
                return handleReject(promise, LdkErrors.spend_outputs_fail)
            }

            ldkDescriptors.add((read as Result_SpendableOutputDescriptorDecodeErrorZ.Result_SpendableOutputDescriptorDecodeErrorZ_OK).res)
        }

        val ldkOutputs: MutableList<TxOut> = arrayListOf()
        outputs.toArrayList().iterator().forEach { output ->
            val outputMap = output as HashMap<*, *>
            ldkOutputs.add(
                TxOut((outputMap.get("value") as Double).toLong(), (outputMap.get("script_pubkey") as String).hexa())
            )
        }

        LdkEventEmitter.send(EventTypes.native_log, "Spending ${ldkOutputs.count()} outputs")

        val res = keysManager!!.spend_spendable_outputs(
            ldkDescriptors.toTypedArray(),
            ldkOutputs.toTypedArray(),
            changeDestinationScript.hexa(),
            feeRate.toInt(),
            Option_u32Z.none()
        )

        if (!res.is_ok) {
            return handleReject(promise, LdkErrors.spend_outputs_fail)
        }

        promise.resolve((res as Result_TransactionNoneZ.Result_TransactionNoneZ_OK).res.hexEncodedString())
    }

    //MARK: Payments
    @ReactMethod
    fun decode(paymentRequest: String, promise: Promise) {
        val parsed = Bolt11Invoice.from_str(paymentRequest)
        if (!parsed.is_ok) {
            return handleReject(promise, LdkErrors.decode_invoice_fail)
        }

        val parsedInvoice = parsed as Result_Bolt11InvoiceParseOrSemanticErrorZ_OK

        promise.resolve(parsedInvoice.res.asJson)
    }

    @ReactMethod
    fun pay(paymentRequest: String, amountSats: Double, timeoutSeconds: Double, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        val invoiceParse = Bolt11Invoice.from_str(paymentRequest)
        if (!invoiceParse.is_ok) {
            return handleReject(promise, LdkErrors.decode_invoice_fail)
        }
        val invoice = (invoiceParse as Result_Bolt11InvoiceParseOrSemanticErrorZ_OK).res

        val isZeroValueInvoice = invoice.amount_milli_satoshis() is Option_u64Z.None

        //If it's a zero invoice and we don't have an amount then don't proceed
        if (isZeroValueInvoice && amountSats == 0.0) {
            return handleReject(promise, LdkErrors.invoice_payment_fail_must_specify_amount)
        }

        //Amount was set but not allowed to set own amount
        if (amountSats > 0 && !isZeroValueInvoice) {
            return handleReject(promise, LdkErrors.invoice_payment_fail_must_not_specify_amount)
        }

        val paymentId = invoice.payment_hash()
        val detailsRes = if (isZeroValueInvoice)
            UtilMethods.payment_parameters_from_zero_amount_invoice(invoice, amountSats.toLong() * 1000) else
            UtilMethods.payment_parameters_from_invoice(invoice)

        if (!detailsRes.is_ok) {
            return handleReject(promise, LdkErrors.invoice_payment_fail_invoice)
        }

        val sendDetails = detailsRes as Result_C3Tuple_ThirtyTwoBytesRecipientOnionFieldsRouteParametersZNoneZ_OK
        val paymentHash = sendDetails.res._a
        val recipientOnion = sendDetails.res._b
        val routeParams = sendDetails.res._c

        val res = channelManager!!.send_payment(paymentHash, recipientOnion, paymentId, routeParams, Retry.timeout(timeoutSeconds.toLong()))

        if (res.is_ok) {
            channelManagerPersister.persistPaymentSent(hashMapOf(
                "bolt11_invoice" to paymentRequest,
                "description" to (invoice.into_signed_raw().raw_invoice().description()?.to_str() ?: ""),
                "payment_id" to paymentId.hexEncodedString(),
                "payment_hash" to invoice.payment_hash().hexEncodedString(),
                "amount_sat" to if (isZeroValueInvoice) amountSats.toLong() else ((invoice.amount_milli_satoshis() as Option_u64Z.Some).some.toInt() / 1000),
                "unix_timestamp" to (System.currentTimeMillis() / 1000).toInt(),
                "state" to "pending"
            ))

            return handleResolve(promise, LdkCallbackResponses.invoice_payment_success)
        }

        val error = res as? Result_NoneRetryableSendFailureZ_Err
            ?: return handleReject(promise, LdkErrors.invoice_payment_fail_unknown)

        when (error.err) {
            RetryableSendFailure.LDKRetryableSendFailure_DuplicatePayment -> {
                handleReject(promise, LdkErrors.invoice_payment_fail_duplicate_payment)
            }

            RetryableSendFailure.LDKRetryableSendFailure_PaymentExpired -> {
                handleReject(promise, LdkErrors.invoice_payment_fail_payment_expired)
            }

            RetryableSendFailure.LDKRetryableSendFailure_RouteNotFound -> {
                handleReject(promise, LdkErrors.invoice_payment_fail_route_not_found)
            }

            else -> handleReject(promise, LdkErrors.invoice_payment_fail_unknown)
        }
    }

    @ReactMethod
    fun abandonPayment(paymentId: String, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        channelManager!!.abandon_payment(paymentId.hexa())
    }

    @ReactMethod
    fun createPaymentRequest(amountSats: Double, description: String, expiryDelta: Double, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)
        keysManager ?: return handleReject(promise, LdkErrors.init_keys_manager)
        ldkCurrency ?: return handleReject(promise, LdkErrors.init_ldk_currency)

        val res = UtilMethods.create_invoice_from_channelmanager(
            channelManager,
            keysManager!!.inner.as_NodeSigner(),
            logger.logger,
            ldkCurrency,
            if (amountSats == 0.0) Option_u64Z.none() else Option_u64Z.some((amountSats * 1000).toLong()),
            description,
            expiryDelta.toInt(),
            Option_u16Z.none()
        )

        if (res.is_ok) {
            return promise.resolve((res as Result_Bolt11InvoiceSignOrCreationErrorZ_OK).res.asJson)
        }

        val error = res as Result_Bolt11InvoiceSignOrCreationErrorZ
        return handleReject(promise, LdkErrors.invoice_create_failed, Error(error.toString()))
    }

    @ReactMethod
    fun processPendingHtlcForwards(promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        channelManager!!.process_pending_htlc_forwards()

        return handleResolve(promise, LdkCallbackResponses.process_pending_htlc_forwards_success)
    }

    @ReactMethod
    fun claimFunds(paymentPreimage: String, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        channelManager!!.claim_funds(paymentPreimage.hexa())

        return handleResolve(promise, LdkCallbackResponses.claim_funds_success)
    }

    @ReactMethod
    fun failHtlcBackwards(paymentHash: String, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        channelManager!!.fail_htlc_backwards(paymentHash.hexa())

        return handleResolve(promise, LdkCallbackResponses.fail_htlc_backwards_success)
    }

    //MARK: Fetch methods

    @ReactMethod
    fun version(promise: Promise) {
        val res = JSONObject()
        res.put("c_bindings", get_ldk_c_bindings_version())
        res.put("ldk", get_ldk_version())
        promise.resolve(res.toString())
    }

    @ReactMethod
    fun nodeId(promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        promise.resolve(channelManager!!._our_node_id.hexEncodedString())
    }

    @ReactMethod
    fun listPeers(promise: Promise) {
        peerManager ?: return handleReject(promise, LdkErrors.init_peer_manager)

        val res = Arguments.createArray()
        val list = peerManager!!.list_peers()
        list.iterator().forEach {
            res.pushString(it._counterparty_node_id.hexEncodedString())
        }

        promise.resolve(res)
    }

    @ReactMethod
    fun listChannels(promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        val list = Arguments.createArray()
        channelManager!!.list_channels().iterator().forEach { list.pushMap(it.asJson) }

        promise.resolve(list)
    }

    @ReactMethod
    fun listUsableChannels(promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        val list = Arguments.createArray()
        channelManager!!.list_usable_channels().iterator().forEach { list.pushMap(it.asJson) }

        promise.resolve(list)
    }

    @ReactMethod
    fun listChannelFiles(promise: Promise) {
        if (channelStoragePath == "") {
            return handleReject(promise, LdkErrors.init_storage_path)
        }

        val list = Arguments.createArray()
        Files.walk(Paths.get(channelStoragePath))
            .filter { Files.isRegularFile(it) }
            .forEach {
                list.pushString(it.fileName.toString())
            }

        promise.resolve(list)
    }

    @ReactMethod
    fun listChannelMonitors(ignoreOpenChannels: Boolean, promise: Promise) {
        val channelManager = channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)
        val keysManager = keysManager ?: return handleReject(promise, LdkErrors.init_keys_manager)
        if (channelStoragePath == "") {
            return handleReject(promise, LdkErrors.init_storage_path)
        }

        val ignoredChannels = if (ignoreOpenChannels)
            channelManager.list_channels().map { it._channel_id._a.hexEncodedString() }.toTypedArray() else
            arrayOf()

        val channelFiles = File(channelStoragePath).listFiles()

        val result = Arguments.createArray()
        for (channelFile in channelFiles) {
            val channelId = channelFile.nameWithoutExtension

            //Ignore open channels
            if (ignoredChannels.contains(channelId)) {
                continue
            }

            val channelMonitor = UtilMethods.C2Tuple_ThirtyTwoBytesChannelMonitorZ_read(channelFile.readBytes(), keysManager!!.inner.as_EntropySource(), SignerProvider.new_impl(keysManager!!.signerProvider))

            if (channelMonitor.is_ok) {
                val channelMonitorResult = (channelMonitor as Result_C2Tuple_ThirtyTwoBytesChannelMonitorZDecodeErrorZ_OK)
                result.pushMap(channelMonitorResult.res._b.asJson(channelId))
            }
        }

        promise.resolve(result)
    }

    @ReactMethod
    fun networkGraphListNodeIds(promise: Promise) {
        val graph = networkGraph?.read_only() ?: return handleReject(promise, LdkErrors.init_network_graph)

        val total = graph.list_nodes().count()
        if (total > 100) {
            return handleReject(promise, LdkErrors.data_too_large_for_rn, Error("Too many nodes to return (${total})")) //"Too many nodes to return (\(total))"
        }

        val list = Arguments.createArray()
        graph.list_nodes().iterator().forEach { list.pushHexString(it.as_slice()) }

        promise.resolve(list)
    }

    @ReactMethod
    fun networkGraphNodes(nodeIds: ReadableArray, promise: Promise) {
        val graph = networkGraph?.read_only() ?: return handleReject(promise, LdkErrors.init_network_graph)

        val graphNodes = graph.list_nodes().map { it.as_slice().hexEncodedString() }

        //Filter out nodes we don't know about as querying unknown nodes will cause a crash
        val includedList: List<String> = nodeIds.toArrayList().map { it as String }.filter { graphNodes.contains(it) }

        val list = Arguments.createArray()
        includedList.forEach {
            val node = graph.node(NodeId.from_pubkey(it.hexa()))?.asJson
            if (node != null) {
                node.putString("id", it)
                list.pushMap(node)
            }
        }

        promise.resolve(list)
    }

    @ReactMethod
    fun networkGraphListChannels(promise: Promise) {
        val graph = networkGraph?.read_only() ?: return handleReject(promise, LdkErrors.init_network_graph)

        val total = graph.list_channels().count()
        if (total > 100) {
            return handleReject(promise, LdkErrors.data_too_large_for_rn, Error("Too many channels to return (${total})")) //"Too many nodes to return (\(total))"
        }

        val list = Arguments.createArray()
        graph.list_channels().iterator().forEach { list.pushString(it.toString()) }

        promise.resolve(list)
    }

    @ReactMethod
    fun networkGraphChannel(shortChannelId: String, promise: Promise) {
        val graph = networkGraph?.read_only() ?: return handleReject(promise, LdkErrors.init_network_graph)

        promise.resolve(graph.channel(shortChannelId.toLong())?.asJson)
    }

    @ReactMethod
    fun claimableBalances(ignoreOpenChannels: Boolean, promise: Promise) {
        val channelManager = channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)
        val chainMonitor = chainMonitor ?: return handleReject(promise, LdkErrors.init_chain_monitor)

        val ignoredChannels = if (ignoreOpenChannels)
            channelManager.list_channels() else
            arrayOf<ChannelDetails>()

        promise.resolve(chainMonitor.getClaimableBalancesAsJson(ignoredChannels))
    }

    //MARK: Misc methods
    @ReactMethod
    fun writeToFile(fileName: String, path: String, content: String, format: String, remotePersist: Boolean, promise: Promise) {
        val file: File

        try {
            if (path != "") {
                //Make sure custom path exists by creating if missing
                val filePath = File(path)
                if (!filePath.exists()) {
                    filePath.mkdirs()
                }

                file = File("$path/$fileName")
            } else {
                //Assume default directory if no path was set
                if (accountStoragePath == "") {
                    return handleReject(promise, LdkErrors.init_storage_path)
                }

                file = File("$accountStoragePath/$fileName")
            }

            if (format == "hex") {
                file.writeBytes(content.hexa())
            } else {
                file.writeText(content)
            }

            if (remotePersist) {
                BackupClient.addToPersistQueue(BackupClient.Label.MISC(fileName), file.readBytes())
            }

            handleResolve(promise, LdkCallbackResponses.file_write_success)
        } catch (e: Exception) {
            handleReject(promise, LdkErrors.write_fail, Error(e))
        }
    }

    @ReactMethod
    fun readFromFile(fileName: String, path: String, format: String, promise: Promise) {
        val file = if (path != "") {
            File("$path/$fileName")
        } else {
            //Assume default directory if no path was set
            if (accountStoragePath == "") {
                return handleReject(promise, LdkErrors.init_storage_path)
            }

            File("$accountStoragePath/$fileName")
        }

        if (!file.exists()) {
            return handleReject(promise, LdkErrors.file_does_not_exist, Error("Could not locate file at ${file.absolutePath}"))
        }

        try {
            val result = Arguments.createMap()
            result.putInt("timestamp", file.lastModified().toInt())

            if (format == "hex") {
                result.putHexString("content", file.readBytes())
            } else {
                result.putString("content", file.readText())
            }

            promise.resolve(result)
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.read_fail, Error(e))
        }
    }

    @ReactMethod
    fun reconstructAndSpendOutputs(outputScriptPubKey: String, outputValue: Double, outpointTxId: String, outpointIndex: Double, feeRate: Double, changeDestinationScript: String, promise: Promise) {
        keysManager ?: return handleReject(promise, LdkErrors.init_keys_manager)

        val output = TxOut(outputValue.toLong(), outputScriptPubKey.hexa())
        val outpoint = OutPoint.of(outpointTxId.hexa().reversedArray(), outpointIndex.toInt().toShort())
        val descriptor = SpendableOutputDescriptor.static_output(outpoint, output, byteArrayOf())

        val ldkDescriptors: MutableList<SpendableOutputDescriptor> = arrayListOf()
        ldkDescriptors.add(descriptor)

        val res = keysManager!!.spend_spendable_outputs(
            ldkDescriptors.toTypedArray(),
            emptyArray(),
            changeDestinationScript.hexa(),
            feeRate.toInt(),
            Option_u32Z.none()
        )

        if (!res.is_ok) {
            return handleReject(promise, LdkErrors.spend_outputs_fail)
        }

        promise.resolve((res as Result_TransactionNoneZ.Result_TransactionNoneZ_OK).res.hexEncodedString())
    }

    @ReactMethod
    fun spendRecoveredForceCloseOutputs(transaction: String, confirmationHeight: Double, changeDestinationScript: String, useInner: Boolean, promise: Promise) {
        if (channelStoragePath == "") {
            return handleReject(promise, LdkErrors.init_storage_path)
        }

        if (channelManager == null) {
            return handleReject(promise, LdkErrors.init_channel_manager)
        }

        if (keysManager == null) {
            return handleReject(promise, LdkErrors.init_keys_manager)
        }

        val openChannelIds = channelManager!!.list_channels().map { it._channel_id._a.hexEncodedString() }

        //Get list of files in this path
        val channelFiles = File(channelStoragePath).listFiles()

        val txs = Arguments.createArray()

        for (channelFile in channelFiles) {
            val channelId = channelFile.nameWithoutExtension

            //Ignore open channels
            if (openChannelIds.contains(channelId)) {
                continue
            }

            LdkEventEmitter.send(EventTypes.native_log, "Loading channel from file to attempt sweep " + channelId)

            //byte[] ser, EntropySource arg_a, SignerProvider arg_b)
            val channelMonitor = UtilMethods.C2Tuple_ThirtyTwoBytesChannelMonitorZ_read(channelFile.readBytes(), keysManager!!.inner.as_EntropySource(), SignerProvider.new_impl(keysManager!!.signerProvider))

            if (channelMonitor.is_ok) {
                val monitor = (channelMonitor as Result_C2Tuple_ThirtyTwoBytesChannelMonitorZDecodeErrorZ_OK).res._b

                val descriptors = monitor.get_spendable_outputs(transaction.hexa(), confirmationHeight.toInt())
                if (descriptors.isEmpty()) {
                    LdkEventEmitter.send(EventTypes.native_log, "No spendable outputs found for channel $channelId")
                    continue
                }

                val res = if (useInner) {
                    keysManager!!.inner.as_OutputSpender().spend_spendable_outputs(
                        descriptors,
                        emptyArray(),
                        changeDestinationScript.hexa(),
                        feeEstimator.onChainSweep,
                        Option_u32Z.none()
                    )
                } else {
                    keysManager!!.spend_spendable_outputs(
                        descriptors,
                        emptyArray(),
                        changeDestinationScript.hexa(),
                        feeEstimator.onChainSweep,
                        Option_u32Z.none()
                    )
                }

                if (res.is_ok) {
                    txs.pushHexString((res as Result_TransactionNoneZ.Result_TransactionNoneZ_OK).res)
                } else {
                    LdkEventEmitter.send(EventTypes.native_log, "Failed to spend outputs for channel $channelId")
                }
            }
        }

        promise.resolve(txs)
    }

    @ReactMethod
    fun nodeSign(message: String, promise: Promise) {
        keysManager ?: return handleReject(promise, LdkErrors.init_keys_manager)

        val res = UtilMethods.sign(message.toByteArray(Charsets.UTF_8), keysManager!!.inner._node_secret_key)

        if (!res.is_ok) {
            return handleReject(promise, LdkErrors.failed_signing_request)
        }

        promise.resolve((res as Result_StrSecp256k1ErrorZ_OK).res)
    }

    @ReactMethod
    fun nodeStateDump(promise: Promise) {
        val logDump: MutableList<String> = mutableListOf()

        keysManager?.inner?.as_NodeSigner()
            ?.get_node_id(Recipient.LDKRecipient_Node)?.let { pubKeyRes ->
            if (pubKeyRes.is_ok) {
                logDump.add("NodeID: ${(pubKeyRes as Result_PublicKeyNoneZ_OK).res.hexEncodedString()}")
            }
        }

        channelManager?.list_channels()?.forEach { channel ->
            logDump.add("Open channel:")

            channel._funding_txo?._txid?.let { txId ->
                logDump.add("Funding txid: ${txId.reversedArray().hexEncodedString()}")
            }

            logDump.add("Ready: ${if (channel._is_channel_ready) "YES" else "NO"}")
            logDump.add("Usable: ${if (channel._is_usable) "YES" else "NO"}")
            logDump.add("Balance: ${channel._balance_msat / 1000} sats")
        }

        chainMonitor?.getClaimableBalancesAsJson(arrayOf())?.let { claimableBalances ->
            logDump.add("All claimable balances:\n $claimableBalances")
        } ?: run {
            logDump.add("Claimable balances unavailable. Chain monitor not set yet")
        }

        channelManagerConstructor?.net_graph?._last_rapid_gossip_sync_timestamp?.let { res ->
            val syncTimestamp = if (res is Option_u32Z.Some) (res as Option_u32Z.Some).some.toLong() else 0
            if (syncTimestamp == 0L) {
                logDump.add("Last rapid gossip sync time: NEVER")
            } else {
                val date = Date(syncTimestamp * 1000)
                val dateFormatter = SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                logDump.add("Last rapid gossip sync time: ${dateFormatter.format(date)}")
            }
        } ?: run {
            logDump.add("RGS last sync time unavailable.")
        }

        peerManager?.list_peers()?.let { peers ->
            if (peers.isNotEmpty()) {
                peers.forEach { peer ->
                    logDump.add("Connected peer: ${peer._counterparty_node_id.hexEncodedString()}")
                }
            } else {
                logDump.add("No connected peers")
            }
        } ?: run {
            logDump.add("Connected peers unavailable. Peer manager not set.")
        }

        logDump.add("Storage: ${accountStoragePath}")

        logDump.add("BackupClient setup: ${if (BackupClient.requiresSetup) "NO" else "YES"}")
        logDump.add("Skip remote backups: ${if (BackupClient.skipRemoteBackup) "YES" else "NO"}")

        val logString = "********NODE STATE********\n" + logDump.joinToString("\n") + "\n****************"
        LogFile.write(logString)

        promise.resolve(logString)
    }

    //Backup methods
    @ReactMethod
    fun backupSetup(seed: String, network: String, server: String, serverPubKey: String, promise: Promise) {
        val seedBytes = seed.hexa()
        if (seedBytes.count() != 32) {
            return handleReject(promise, LdkErrors.invalid_seed_hex)
        }

        val nanoSeconds = System.currentTimeMillis() * 1000
        val seconds = nanoSeconds / 1000 / 1000
        val keysManager = KeysManager.of(seedBytes, seconds, nanoSeconds.toInt())
        val pubKeyRes = keysManager.as_NodeSigner().get_node_id(Recipient.LDKRecipient_Node)
        if (!pubKeyRes.is_ok) {
            return handleReject(promise, LdkErrors.backup_setup_failed)
        }

        try {
            BackupClient.skipRemoteBackup = false
            BackupClient.setup(
                keysManager._node_secret_key,
                (pubKeyRes as Result_PublicKeyNoneZ_OK).res,
                network,
                server,
                serverPubKey
            )

            handleResolve(promise, LdkCallbackResponses.backup_client_setup_success)
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.backup_setup_failed, Error(e))
        }
    }

    @ReactMethod
    fun restoreFromRemoteBackup(overwrite: Boolean, promise: Promise) {
        if (BackupClient.requiresSetup) {
            return handleReject(promise, LdkErrors.backup_setup_required)
        }

        if (accountStoragePath == "") {
            return handleReject(promise, LdkErrors.init_storage_path)
        }
        if (channelStoragePath == "") {
            return handleReject(promise, LdkErrors.init_storage_path)
        }

        try {
            if (!overwrite) {
                val accountStoragePath = File(accountStoragePath)
                val channelStoragePath = File(channelStoragePath)

                if (accountStoragePath.exists() || channelStoragePath.exists()) {
                    return handleReject(promise, LdkErrors.backup_restore_failed_existing_files)
                }
            }

            val completeBackup = BackupClient.retrieveCompleteBackup()
            for (file in completeBackup.files) {
                val key = file.key.replace(".bin", "")
                var fileName = "$key.json"

                val ldkFileName = LdkFileNames.values().firstOrNull { it.fileName.contains(key) }
                if (ldkFileName != null) {
                    fileName = ldkFileName.fileName
                }

                val newFile = File(accountStoragePath + "/" + fileName)
                newFile.writeBytes(file.value)
            }

            for (channelFile in completeBackup.channelFiles) {
                val newFile = File(channelStoragePath + "/" + channelFile.key)
                newFile.writeBytes(channelFile.value)
            }

            handleResolve(promise, LdkCallbackResponses.backup_restore_success)
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.backup_restore_failed, Error(e))
        }
    }

    @ReactMethod
    fun backupSelfCheck(promise: Promise) {
        if (BackupClient.requiresSetup) {
            return handleReject(promise, LdkErrors.backup_setup_required)
        }

        try {
            BackupClient.selfCheck()
            handleResolve(promise, LdkCallbackResponses.backup_client_check_success)
        } catch (e: Exception) {
            handleReject(promise, LdkErrors.backup_check_failed, Error(e))
        }
    }

    @ReactMethod
    fun backupListFiles(promise: Promise) {
        if (BackupClient.requiresSetup) {
            return handleReject(promise, LdkErrors.backup_setup_required)
        }

        try {
            val list = BackupClient.listFiles()

            val map = Arguments.createMap()
            val files = Arguments.createArray()
            list.first.forEach { files.pushString(it) }
            val channelMonitors = Arguments.createArray()
            list.second.forEach { channelMonitors.pushString(it) }
            map.putArray("list", files)
            map.putArray("channel_monitors", channelMonitors)

            promise.resolve(map)
        } catch (e: Exception) {
            handleReject(promise, LdkErrors.backup_check_failed, Error(e))
        }
    }

    @ReactMethod
    fun backupFile(fileName: String, content: String, promise: Promise) {
        if (BackupClient.requiresSetup) {
            return handleReject(promise, LdkErrors.backup_setup_required)
        }

        BackupClient.addToPersistQueue(BackupClient.Label.MISC(fileName), content.toByteArray(Charsets.UTF_8)) { error ->
            if (error != null) {
                handleReject(promise, LdkErrors.backup_file_failed, Error(error))
            } else {
                handleResolve(promise, LdkCallbackResponses.backup_file_success)
            }
        }
    }

    @ReactMethod
    fun fetchBackupFile(fileName: String, promise: Promise) {
        if (BackupClient.requiresSetup) {
            return handleReject(promise, LdkErrors.backup_setup_required)
        }

        try {
            val bytes = BackupClient.retrieve(BackupClient.Label.MISC(fileName))
            promise.resolve(bytes.toString(Charsets.UTF_8))
        } catch (e: Exception) {
            handleReject(promise, LdkErrors.backup_file_failed, Error(e))
        }
    }
}

object LdkEventEmitter {
    private var reactContext: ReactContext? = null

    fun setContext(reactContext: ReactContext) {
        this.reactContext = reactContext
    }

    fun send(eventType: EventTypes, body: Any) {
        if (this.reactContext === null) {
            return
        }

        this.reactContext!!.getJSModule(RCTDeviceEventEmitter::class.java).emit(eventType.toString(), body)

        if (eventType == EventTypes.native_log) {
            LogFile.write("DEBUG (KOTLIN): $body")
        }
    }
}
