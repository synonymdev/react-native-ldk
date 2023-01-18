package com.reactnativeldk

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.reactnativeldk.classes.*
import org.json.JSONObject
import org.ldk.batteries.ChannelManagerConstructor
import org.ldk.batteries.NioPeerHandler
import org.ldk.enums.Currency
import org.ldk.enums.Network
import org.ldk.impl.bindings.get_ldk_c_bindings_version
import org.ldk.impl.bindings.get_ldk_version
import org.ldk.structs.*
import org.ldk.structs.Result_InvoiceParseOrSemanticErrorZ.Result_InvoiceParseOrSemanticErrorZ_OK
import org.ldk.structs.Result_InvoiceSignOrCreationErrorZ.Result_InvoiceSignOrCreationErrorZ_OK
import org.ldk.structs.Result_ProbabilisticScorerDecodeErrorZ.Result_ProbabilisticScorerDecodeErrorZ_OK
import java.io.File
import java.net.InetSocketAddress
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*
import kotlin.collections.ArrayList
import kotlin.collections.HashMap


//MARK: ************Replicate in typescript and swift************
enum class EventTypes {
    ldk_log,
    native_log,
    register_tx,
    register_output,
    broadcast_transaction,
    backup,
    channel_manager_funding_generation_ready,
    channel_manager_payment_received,
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
    emergency_force_close_channel,
    new_channel,
    network_graph_updated
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
    init_invoice_payer,
    invoice_payment_fail_unknown,
    invoice_payment_fail_must_specify_amount,
    invoice_payment_fail_must_not_specify_amount,
    invoice_payment_fail_invoice,
    invoice_payment_fail_routing,
    invoice_payment_fail_sending,
    invoice_payment_fail_retry_safe,
    invoice_payment_fail_parameter_error,
    invoice_payment_fail_partial,
    invoice_payment_fail_path_parameter_error,
    init_ldk_currency,
    invoice_create_failed,
    init_scorer_failed,
    channel_close_fail,
    spend_outputs_fail,
    write_fail,
    read_fail,
    file_does_not_exist,
    data_too_large_for_rn
}

enum class LdkCallbackResponses {
    storage_path_set,
    fees_updated,
    log_level_updated,
    log_path_updated,
    log_write_success,
    chain_monitor_init_success,
    keys_manager_init_success,
    channel_manager_init_success,
    config_init_success,
    network_graph_init_success,
    add_peer_success,
    chain_sync_success,
    invoice_payment_success,
    tx_set_confirmed,
    tx_set_unconfirmed,
    process_pending_htlc_forwards_success,
    claim_funds_success,
    ldk_reset,
    close_channel_success,
    file_write_success
}

enum class LdkFileNames(val fileName: String) {
    network_graph("network_graph.bin"),
    channel_manager("channel_manager.bin")
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
    private var chainMonitor: ChainMonitor? = null
    private var keysManager: KeysManager? = null
    private var channelManager: ChannelManager? = null
    private var userConfig: UserConfig? = null
    private var networkGraph: NetworkGraph? = null
    private var rapidGossipSync: RapidGossipSync? = null
    private var peerManager: PeerManager? = null
    private var peerHandler: NioPeerHandler? = null
    private var channelManagerConstructor: ChannelManagerConstructor? = null
    private var invoicePayer: InvoicePayer? = null
    private var ldkNetwork: Network? = null
    private var ldkCurrency: Currency? = null

    //Static to be accessed from other classes
    companion object {
        lateinit var accountStoragePath: String
        lateinit var channelStoragePath: String
    }

    init {
        accountStoragePath = ""
        channelStoragePath = ""
    }

    //Startup methods

    @ReactMethod
    fun setAccountStoragePath(storagePath: String, promise: Promise) {
        if (accountStoragePath != "") {
            return handleReject(promise, LdkErrors.already_init)
        }

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
    fun initChainMonitor(promise: Promise) {
        if (chainMonitor !== null) {
            return handleReject(promise, LdkErrors.already_init)
        }

        chainMonitor = ChainMonitor.of(
            Option_FilterZ.some(filter.filter),
            broadcaster.broadcaster,
            logger.logger,
            feeEstimator.feeEstimator,
            persister.persister
        )

        handleResolve(promise, LdkCallbackResponses.chain_monitor_init_success)
    }

    @ReactMethod
    fun initKeysManager(seed: String, promise: Promise) {
        if (keysManager !== null) {
            return handleReject(promise, LdkErrors.already_init)
        }

        val nanoSeconds = System.currentTimeMillis() * 1000
        val seconds = nanoSeconds / 1000 / 1000
        val seedBytes = seed.hexa()

        if (seedBytes.count() != 32) {
            return handleReject(promise, LdkErrors.invalid_seed_hex)
        }

        keysManager = KeysManager.of(seedBytes, seconds, nanoSeconds.toInt())

        handleResolve(promise, LdkCallbackResponses.keys_manager_init_success)
    }

    @ReactMethod
    fun initConfig(acceptInboundChannels: Boolean, manuallyAcceptInboundChannels: Boolean, announcedChannels: Boolean, minChannelHandshakeDepth: Double, forceAnnouncedChannelPreference: Boolean, promise: Promise) {
        if (userConfig !== null) {
            return handleReject(promise, LdkErrors.already_init)
        }

        userConfig = UserConfig.with_default()
        userConfig!!._accept_inbound_channels = acceptInboundChannels
        userConfig!!._manually_accept_inbound_channels = manuallyAcceptInboundChannels

        val channelConfig = ChannelConfig.with_default()
        userConfig!!._channel_config = channelConfig

        val channelHandshakeConfig = ChannelHandshakeConfig.with_default()
        channelHandshakeConfig._minimum_depth = minChannelHandshakeDepth.toInt()
        channelHandshakeConfig._announced_channel = announcedChannels
        userConfig!!._channel_handshake_config = channelHandshakeConfig

        val channelHandshakeLimits = ChannelHandshakeLimits.with_default()
        channelHandshakeLimits._force_announced_channel_preference = forceAnnouncedChannelPreference
        channelHandshakeLimits._max_minimum_depth = minChannelHandshakeDepth.toInt()
        userConfig!!._channel_handshake_limits = channelHandshakeLimits

        handleResolve(promise, LdkCallbackResponses.config_init_success)
    }

    @ReactMethod
    fun initNetworkGraph(genesisHash: String, rapidGossipSyncUrl: String, promise: Promise) {
        if (networkGraph !== null) {
            return handleReject(promise, LdkErrors.already_init)
        }

        val file = File(accountStoragePath + "/" + LdkFileNames.network_graph.fileName)
        if (file.exists()) {
            (NetworkGraph.read(file.readBytes(), logger.logger) as? Result_NetworkGraphDecodeErrorZ.Result_NetworkGraphDecodeErrorZ_OK)?.let { res ->
                networkGraph = res.res
            }
        }

        if (networkGraph == null) {
            LdkEventEmitter.send(EventTypes.native_log, "Failed to load cached network graph from disk. Will sync from scratch.")
            networkGraph = NetworkGraph.of(genesisHash.hexa(), logger.logger)
        }

        if (rapidGossipSyncUrl != "") {
            val rapidGossipSyncStoragePath = File("$accountStoragePath/rapid_gossip_sync/")
            try {
                if (!rapidGossipSyncStoragePath.exists()) {
                    rapidGossipSyncStoragePath.mkdirs()
                }
            } catch (e: Exception) {
                return handleReject(promise, LdkErrors.create_storage_dir_fail, Error(e))
            }

            rapidGossipSync = RapidGossipSync.of(networkGraph)

            //If it's been more than 24 hours then we need to update RGS
            var timestamp = if (networkGraph!!._last_rapid_gossip_sync_timestamp is Option_u32Z.Some) (networkGraph!!._last_rapid_gossip_sync_timestamp as Option_u32Z.Some).some.toLong() else 0 // (networkGraph!!._last_rapid_gossip_sync_timestamp as Option_u32Z.Some).some
            val hoursDiffSinceLastRGS = (System.currentTimeMillis() / 1000 - timestamp) / 60 / 60
            if (hoursDiffSinceLastRGS < 24) {
                LdkEventEmitter.send(EventTypes.native_log, "Skipping rapid gossip sync. Last updated $hoursDiffSinceLastRGS hours ago.")
                return handleResolve(promise, LdkCallbackResponses.network_graph_init_success)
            }

            LdkEventEmitter.send(EventTypes.native_log, "Rapid gossip sync applying update. Last updated $hoursDiffSinceLastRGS hours ago.")

            //TODO remove this incremental updates temp broken. Possibly related to https://github.com/lightningdevkit/rust-lightning/issues/1784
            //TODO check if this is still an issue in 0.0.113
            //If network graph is older than 24h download from scratch until incremental updates are working
            //>>>>>> DELETE ME
            val networkGraphFile = File(accountStoragePath + "/" + LdkFileNames.network_graph.fileName)
            if (networkGraphFile.exists()) {
                networkGraphFile.delete()
            }
            networkGraph = NetworkGraph.of(genesisHash.hexa(), logger.logger)
            rapidGossipSync = RapidGossipSync.of(networkGraph)
            timestamp = 0
            LdkEventEmitter.send(EventTypes.native_log, "Rapid sync from scratch. Try remove in 0.0.113.")
            //<<<<<< DELETE ME

            rapidGossipSync!!.downloadAndUpdateGraph(rapidGossipSyncUrl, "$accountStoragePath/rapid_gossip_sync/", timestamp) { error ->
                LdkEventEmitter.send(EventTypes.native_log, "Rapid gossip sync file downloaded.")

                if (error != null) {
                    LdkEventEmitter.send(EventTypes.native_log, error.localizedMessage)
                    return@downloadAndUpdateGraph
                }

                LdkEventEmitter.send(EventTypes.native_log, "Rapid gossip sync completed.")

                if (networkGraph == null) {
                    LdkEventEmitter.send(EventTypes.native_log, "Failed to use network graph.")
                    return@downloadAndUpdateGraph
                }

                channelManagerPersister.persist_network_graph(networkGraph!!.write())

                val body = Arguments.createMap()
                body.putInt("channel_count", networkGraph!!.read_only().list_channels().count())
                body.putInt("node_count", networkGraph!!.read_only().list_nodes().count())
                LdkEventEmitter.send(EventTypes.network_graph_updated, body)
            }
        }

        handleResolve(promise, LdkCallbackResponses.network_graph_init_success)
    }

    @ReactMethod
    fun initChannelManager(network: String, blockHash: String, blockHeight: Double, promise: Promise) {
        if (channelManager !== null) {
            return handleReject(promise, LdkErrors.already_init)
        }

        chainMonitor ?: return handleReject(promise, LdkErrors.init_chain_monitor)
        keysManager ?: return handleReject(promise, LdkErrors.init_keys_manager)
        userConfig ?: return handleReject(promise, LdkErrors.init_user_config)
        networkGraph ?: return handleReject(promise, LdkErrors.init_network_graph)
        if (accountStoragePath == "") {
            return handleReject(promise, LdkErrors.init_storage_path)
        }
        if (channelStoragePath == "") {
            return handleReject(promise, LdkErrors.init_storage_path)
        }

        when (network) {
            "regtest" -> {
                ldkNetwork = Network.LDKNetwork_Regtest
                ldkCurrency = Currency.LDKCurrency_Regtest
            }
            "testnet" -> {
                ldkNetwork = Network.LDKNetwork_Testnet
                ldkCurrency = Currency.LDKCurrency_BitcoinTestnet
            }
            "mainnet" -> {
                ldkNetwork = Network.LDKNetwork_Bitcoin
                ldkCurrency = Currency.LDKCurrency_Bitcoin
            }
            else -> {
                return handleReject(promise, LdkErrors.invalid_network)
            }
        }
        
        var channelManagerSerialized: ByteArray? = null
        val channelManagerFile = File(accountStoragePath + "/" + LdkFileNames.channel_manager.fileName)
        if (channelManagerFile.exists()) {
           channelManagerSerialized = channelManagerFile.readBytes()
        }

        try {
            if (channelManagerSerialized != null) {
                //Restoring node
                LdkEventEmitter.send(EventTypes.native_log, "Restoring node from disk")
                var channelMonitors: MutableList<ByteArray> = arrayListOf()
                Files.walk(Paths.get(channelStoragePath))
                    .filter { Files.isRegularFile(it) }
                    .forEach {
                        LdkEventEmitter.send(EventTypes.native_log, "Loading channel from file " + it.fileName)
                        channelMonitors.add(it.toFile().readBytes())
                    }

                channelManagerConstructor = ChannelManagerConstructor(
                    channelManagerSerialized,
                    channelMonitors.toTypedArray(),
                    userConfig,
                    keysManager!!.as_KeysInterface(),
                    feeEstimator.feeEstimator,
                    chainMonitor,
                    filter.filter,
                    networkGraph!!.write(),
                    broadcaster.broadcaster,
                    logger.logger
                )
            } else {
                //New node
                LdkEventEmitter.send(EventTypes.native_log, "Creating new channel manager")
                channelManagerConstructor = ChannelManagerConstructor(
                    ldkNetwork,
                    userConfig,
                    blockHash.hexa(),
                    blockHeight.toInt(),
                    keysManager!!.as_KeysInterface(),
                    feeEstimator.feeEstimator,
                    chainMonitor,
                    networkGraph!!,
                    broadcaster.broadcaster,
                    logger.logger,
                )
            }
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.unknown_error, Error(e))
        }

        channelManager = channelManagerConstructor!!.channel_manager

        //Scorer setup
        val params = ProbabilisticScoringParameters.with_default()
        val default_scorer = ProbabilisticScorer.of(params, networkGraph, logger.logger)
        val score_res = ProbabilisticScorer.read(
            default_scorer.write(), params, networkGraph,
            logger.logger
        )
        if (!score_res.is_ok) {
            return handleReject(promise, LdkErrors.init_scorer_failed)
        }
        val score = (score_res as Result_ProbabilisticScorerDecodeErrorZ_OK).res.as_Score()
        val scorer = MultiThreadedLockableScore.of(score)

        channelManagerConstructor!!.chain_sync_completed(channelManagerPersister, scorer)
        peerManager = channelManagerConstructor!!.peer_manager

        peerHandler = channelManagerConstructor!!.nio_peer_handler
        invoicePayer = channelManagerConstructor!!.payer

        handleResolve(promise, LdkCallbackResponses.channel_manager_init_success)
    }

    @ReactMethod
    fun reset(promise: Promise) {
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
        accountStoragePath = ""
        channelStoragePath = ""

        handleResolve(promise, LdkCallbackResponses.ldk_reset)
    }

    //MARK: Update methods

    @ReactMethod
    fun updateFees(high: Double, normal: Double, low: Double, promise: Promise) {
        feeEstimator.update(high.toInt(), normal.toInt(), low.toInt())
        handleResolve(promise, LdkCallbackResponses.fees_updated)
    }

    @ReactMethod
    fun setLogLevel(level: Double, active: Boolean, promise: Promise) {
        logger.setLevel(level.toInt(), active)
        handleResolve(promise, LdkCallbackResponses.log_level_updated)
    }

    @ReactMethod
    fun syncToTip(header: String, height: Double, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)
        chainMonitor ?: return handleReject(promise, LdkErrors.init_chain_monitor)

        try {
            channelManager!!.as_Confirm().best_block_updated(header.hexa(), height.toInt())
            chainMonitor!!.as_Confirm().best_block_updated(header.hexa(), height.toInt())
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.unknown_error, Error(e))
        }

        handleResolve(promise, LdkCallbackResponses.chain_sync_success)
    }

    @ReactMethod
    fun addPeer(address: String, port: Double, pubKey: String, timeout: Double, promise: Promise) {
        peerHandler ?: return handleReject(promise, LdkErrors.init_peer_handler)

        try {
            peerHandler!!.connect(pubKey.hexa(), InetSocketAddress(address, port.toInt()), timeout.toInt())
        } catch (e: Exception) {
            return handleReject(promise, LdkErrors.add_peer_fail, Error(e))
        }

        handleResolve(promise, LdkCallbackResponses.add_peer_success)
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
    fun closeChannel(channelId: String, counterpartyNodeId: String, force: Boolean, promise: Promise) {
        channelManager ?: return handleReject(promise, LdkErrors.init_channel_manager)

        val res = if (force) channelManager!!.force_close_broadcasting_latest_txn(channelId.hexa(), counterpartyNodeId.hexa()) else channelManager!!.close_channel(channelId.hexa(), counterpartyNodeId.hexa())
        if (!res.is_ok) {
            return handleReject(promise, LdkErrors.channel_close_fail)
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

        val res = keysManager!!.spend_spendable_outputs(
            ldkDescriptors.toTypedArray(),
            ldkOutputs.toTypedArray(),
            changeDestinationScript.hexa(),
            feeRate.toInt()
        )

        if (!res.is_ok) {
            return handleReject(promise, LdkErrors.spend_outputs_fail)
        }

        promise.resolve((res as Result_TransactionNoneZ.Result_TransactionNoneZ_OK).res.hexEncodedString())
    }

    //MARK: Payments
    @ReactMethod
    fun decode(paymentRequest: String, promise: Promise) {
        val parsed = Invoice.from_str(paymentRequest)
        if (!parsed.is_ok) {
            return handleReject(promise, LdkErrors.decode_invoice_fail)
        }

        val parsedInvoice = parsed as Result_InvoiceParseOrSemanticErrorZ_OK

        promise.resolve(parsedInvoice.res.asJson)
    }

    @ReactMethod
    fun pay(paymentRequest: String, amountSats: Double, promise: Promise) {
        invoicePayer ?: return handleReject(promise, LdkErrors.init_invoice_payer)

        val invoiceParse = Invoice.from_str(paymentRequest)
        if (!invoiceParse.is_ok) {
            return handleReject(promise, LdkErrors.decode_invoice_fail)
        }
        val invoice = (invoiceParse as Result_InvoiceParseOrSemanticErrorZ_OK).res

        val isZeroValueInvoice = invoice.amount_milli_satoshis() is Option_u64Z.None

        //If it's a zero invoice and we don't have an amount then don't proceed
        if (isZeroValueInvoice && amountSats == 0.0) {
            return handleReject(promise, LdkErrors.invoice_payment_fail_must_specify_amount)
        }

        //Amount was set but not allowed to set own amount
        if (amountSats > 0 && !isZeroValueInvoice) {
            return handleReject(promise, LdkErrors.invoice_payment_fail_must_not_specify_amount)
        }

        val res = if (isZeroValueInvoice)
                invoicePayer!!.pay_zero_value_invoice(invoice, amountSats.toLong() * 1000) else
                invoicePayer!!.pay_invoice(invoice)
        if (res.is_ok) {
            return handleResolve(promise, LdkCallbackResponses.invoice_payment_success)
        }

        val error = res as? Result_PaymentIdPaymentErrorZ.Result_PaymentIdPaymentErrorZ_Err

        val invoiceError = error?.err as? PaymentError.Invoice
        if (invoiceError != null) {
            return handleReject(promise, LdkErrors.invoice_payment_fail_invoice, Error(invoiceError.invoice))
        }

        val routingError = error?.err as? PaymentError.Routing
        if (routingError != null) {
            return handleReject(promise, LdkErrors.invoice_payment_fail_routing, Error(routingError.routing._err))
        }

        val sendingError = error?.err as? PaymentError.Sending
        if (sendingError != null) {
            val paymentAllFailedRetrySafe = sendingError.sending as? PaymentSendFailure.AllFailedRetrySafe
            if (paymentAllFailedRetrySafe != null) {
                return handleReject(promise, LdkErrors.invoice_payment_fail_retry_safe, Error(paymentAllFailedRetrySafe.all_failed_retry_safe.map { it.toString() }.toString()))
            }

            val paymentParameterError = sendingError.sending as? PaymentSendFailure.ParameterError
            if (paymentParameterError != null) {
                return handleReject(promise, LdkErrors.invoice_payment_fail_parameter_error, Error(paymentParameterError.parameter_error.toString()))
            }

            val paymentPartialFailure = sendingError.sending as? PaymentSendFailure.PartialFailure
            if (paymentPartialFailure != null) {
                return handleReject(promise, LdkErrors.invoice_payment_fail_partial, Error(paymentPartialFailure.toString()))
            }

            val paymentPathParameterError = sendingError.sending as? PaymentSendFailure.PathParameterError
            if (paymentPathParameterError != null) {
                return handleReject(promise, LdkErrors.invoice_payment_fail_path_parameter_error, Error(paymentPartialFailure.toString()))
            }

            return handleReject(promise, LdkErrors.invoice_payment_fail_sending, Error("PaymentError.Sending"))
        }

        return handleReject(promise, LdkErrors.invoice_payment_fail_unknown)
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
            keysManager!!.as_KeysInterface(),
            logger.logger,
            ldkCurrency,
            if (amountSats == 0.0) Option_u64Z.none() else Option_u64Z.some((amountSats * 1000).toLong()),
            description,
            expiryDelta.toInt()
        );

        if (res.is_ok) {
            return promise.resolve((res as Result_InvoiceSignOrCreationErrorZ_OK).res.asJson)
        }

        val error = res as Result_InvoiceSignOrCreationErrorZ
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
        val list = peerManager!!._peer_node_ids
        list.iterator().forEach {
            res.pushString(it.hexEncodedString())
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

        val result = Arguments.createArray()

        chainMonitor.get_claimable_balances(ignoredChannels).iterator().forEach { balance ->
            val map = Arguments.createMap()
            //Defaults if all castings for balance fail
            map.putInt("claimable_amount_satoshis", 0)
            map.putString("type", "Unknown")

            (balance as? Balance.ClaimableAwaitingConfirmations)?.let { claimableAwaitingConfirmations ->
                map.putInt("claimable_amount_satoshis", claimableAwaitingConfirmations.claimable_amount_satoshis.toInt())
                map.putInt("confirmation_height", claimableAwaitingConfirmations.confirmation_height)
                map.putString("type", "ClaimableAwaitingConfirmations")
            }

            (balance as? Balance.ClaimableOnChannelClose)?.let { claimableOnChannelClose ->
                map.putInt("claimable_amount_satoshis", claimableOnChannelClose.claimable_amount_satoshis.toInt())
                map.putString("type", "ClaimableOnChannelClose")
            }

            (balance as? Balance.ContentiousClaimable)?.let { contentiousClaimable ->
                map.putInt("claimable_amount_satoshis", contentiousClaimable.claimable_amount_satoshis.toInt())
                map.putInt("timeout_height", contentiousClaimable.timeout_height)
                map.putString("type", "ContentiousClaimable")
            }

            (balance as? Balance.CounterpartyRevokedOutputClaimable)?.let { counterpartyRevokedOutputClaimable ->
                map.putInt("claimable_amount_satoshis", counterpartyRevokedOutputClaimable.claimable_amount_satoshis.toInt())
                map.putString("type", "CounterpartyRevokedOutputClaimable")
            }

            (balance as? Balance.MaybePreimageClaimableHTLC)?.let { maybePreimageClaimableHTLC ->
                map.putInt("claimable_amount_satoshis", maybePreimageClaimableHTLC.claimable_amount_satoshis.toInt())
                map.putInt("expiry_height", maybePreimageClaimableHTLC.expiry_height)
                map.putString("type", "MaybePreimageClaimableHTLC")
            }

            (balance as? Balance.MaybeTimeoutClaimableHTLC)?.let { maybeTimeoutClaimableHTLC ->
                map.putInt("claimable_amount_satoshis", maybeTimeoutClaimableHTLC.claimable_amount_satoshis.toInt())
                map.putInt("claimable_height", maybeTimeoutClaimableHTLC.claimable_height)
                map.putString("type", "MaybeTimeoutClaimableHTLC")
            }

            result.pushMap(map)
        }

        promise.resolve(result)
    }

    //MARK: Misc methods
    @ReactMethod
    fun writeToFile(fileName: String, path: String, content: String, format: String, promise: Promise) {
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
    }
}