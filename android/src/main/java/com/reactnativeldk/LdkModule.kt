package com.reactnativeldk

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.reactnativeldk.classes.LdkFeeEstimator
import org.json.JSONObject
import org.ldk.impl.version.*
import org.ldk.impl.bindings.*
import org.ldk.structs.FeeEstimator
import org.ldk.enums.ConfirmationTarget
import java.util.*

//var channel_manager: ChannelManager? = null;

//MARK: ************Replicate in typescript and swift************
enum class EventTypes {
    ldk_log,
    swift_log,
    register_tx,
    register_output,
    broadcast_transaction,
    persist_manager,
    persist_new_channel,
    persist_graph,
    update_persisted_channel,
    channel_manager_funding_generation_ready,
    channel_manager_payment_received,
    channel_manager_payment_sent,
    channel_manager_open_channel_request,
    channel_manager_payment_path_successful,
    channel_manager_payment_path_failed,
    channel_manager_payment_failed,
    channel_manager_spendable_outputs,
    channel_manager_channel_closed,
    channel_manager_discard_funding
}
//*****************************************************************

enum class LdkErrors {
    unknown_error,
    already_init,
    invalid_seed_hex,
    init_chain_monitor,
    init_keys_manager,
    init_user_config,
    init_peer_manager,
    invalid_network,
    load_channel_monitors,
    init_channel_monitor,
    init_network_graph,
    init_peer_handler,
    add_peer_fail,
    init_channel_manager,
    decode_invoice_fail,
    init_invoice_payer,
    invoice_payment_fail,
    init_ldk_currency,
    invoice_create_failed
}

enum class LdkCallbackResponses {
    fees_updated,
    log_level_updated,
    chain_monitor_init_success,
    keys_manager_init_success,
    channel_manager_init_success,
    load_channel_monitors_success,
    config_init_success,
    net_graph_msg_handler_init_success,
    chain_monitor_updated,
    network_graph_init_success,
    add_peer_success,
    chain_sync_success,
    invoice_payment_success,
    tx_set_confirmed,
    tx_set_unconfirmed
}

class LdkModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    init {
        LdkEventEmitter.setContext(reactContext)
    }

    override fun getName(): String {
        return "Ldk"
    }

    val feeEstimator: LdkFeeEstimator by lazy {
        LdkFeeEstimator()
    }

    //Startup methods
    @ReactMethod
    fun initChainMonitor(promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.chain_monitor_init_success)
    }

    @ReactMethod
    fun initKeysManager(seed: String, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.keys_manager_init_success)
    }

    @ReactMethod
    fun loadChannelMonitors(channelMonitorStrings: ReadableArray, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.load_channel_monitors_success)
    }

    @ReactMethod
    fun initConfig(acceptInboundChannels: Boolean, manuallyAcceptInboundChannels: Boolean, announcedChannels: Boolean, minChannelHandshakeDepth: Double, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.config_init_success)
    }

    @ReactMethod
    fun initNetworkGraph(genesisHash: String, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.network_graph_init_success)
    }

    @ReactMethod
    fun initChannelManager(network: String, serializedChannelManager: String, blockHash: String, blockHeight: Double, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.channel_manager_init_success)
    }

    @ReactMethod
    fun syncChainMonitorWithChannelMonitor(blockHash: String, blockHeight: Double, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.chain_monitor_updated)
    }

    //MARK: Update methods

    @ReactMethod
    fun updateFees(high: Double, normal: Double, low: Double, promise: Promise) {
        feeEstimator.update(high.toInt(), normal.toInt(), low.toInt())
        handleResolve(promise, LdkCallbackResponses.fees_updated)
    }

    @ReactMethod
    fun setLogLevel(level: Double, active: Boolean, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.log_level_updated)
    }

    @ReactMethod
    fun syncToTip(header: String, height: Double, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.chain_sync_success)
    }

    @ReactMethod
    fun addPeer(address: String, port: Double, pubKey: String, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.add_peer_success)
    }

    @ReactMethod
    fun setTxConfirmed(header: String, transaction: String, pos: Double, height: Double, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.tx_set_confirmed)
    }

    @ReactMethod
    fun setTxUnconfirmed(txId: String, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.tx_set_unconfirmed)
    }

    //MARK: Payments
    @ReactMethod
    fun decode(paymentRequest: String, promise: Promise) {
        //TODO
        val response = Arguments.createMap().apply {
            putString("todo", "val")
        }

        promise.resolve(response) //TODO test
    }

    @ReactMethod
    fun pay(paymentRequest: String, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.invoice_payment_success)
    }

    @ReactMethod
    fun createPaymentRequest(amountSats: Double, description: String, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.invoice_payment_success)
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
        //TODO
        promise.resolve("TODO nodeid")
    }

    @ReactMethod
    fun listPeers(promise: Promise) {
        //TODO
        promise.resolve("[]")
    }

    @ReactMethod
    fun listChannels(promise: Promise) {
        //TODO
        promise.resolve("[]")
    }

    @ReactMethod
    fun listUsableChannels(promise: Promise) {
        //TODO
        promise.resolve("[]")
    }
}

object LdkEventEmitter {
    private var reactContext: ReactContext? = null

    fun setContext(reactContext: ReactContext) {
        this.reactContext = reactContext
    }

    //body could also become WritableMap for more data in events
    fun send(eventType: EventTypes, body: String) {
        if (this.reactContext === null) {
            return
        }

        this.reactContext!!.getJSModule(RCTDeviceEventEmitter::class.java).emit(eventType.toString(), body)
    }
}