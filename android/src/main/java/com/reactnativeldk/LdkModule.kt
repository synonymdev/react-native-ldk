package com.reactnativeldk

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
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

//TODO move it helpers file
fun handleResolve(promise: Promise, response: LdkCallbackResponses) {

}

class LdkModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "Ldk"
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
    fun loadChannelMonitors(channelMonitorStrings: Array<String>, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.load_channel_monitors_success)
    }

    @ReactMethod
    fun initConfig(acceptInboundChannels: Boolean, manuallyAcceptInboundChannels: Boolean, announcedChannels: Boolean, minChannelHandshakeDepth: Boolean, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.config_init_success)
    }

    @ReactMethod
    fun initNetworkGraph(genesisHash: String, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.network_graph_init_success)
    }

    @ReactMethod
    fun initChannelManager(network: String, serializedChannelManager: String, blockHash: String, blockHeight: Int, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.channel_manager_init_success)
    }

    @ReactMethod
    fun syncChainMonitorWithChannelMonitor(blockHash: String, blockHeight: Int, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.chain_monitor_updated)
    }

    //MARK: Update methods

    @ReactMethod
    fun updateFees(high: Int, normal: Int, low: Int, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.fees_updated)
    }

    @ReactMethod
    fun setLogLevel(level: Int, active: Boolean, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.log_level_updated)
    }

    @ReactMethod
    fun syncToTip(header: String, height: Int, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.chain_sync_success)
    }

    @ReactMethod
    fun addPeer(address: String, port: Int, pubKey: String, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.add_peer_success)
    }

    @ReactMethod
    fun setTxConfirmed(header: String, transaction: String, pos: Int, height: Int, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.tx_set_confirmed)
    }

    @ReactMethod
    fun setTxUnconfirmed(txId: String, promise: Promise) {
        //TODO
        handleResolve(promise, LdkCallbackResponses.tx_set_unconfirmed)
    }

    //MARK: Payments

    //MARK: Fetch methods

    @ReactMethod
    fun version(promise: Promise) {
        val res = JSONObject()
        res.put("c_bindings", get_ldk_c_bindings_version())
        res.put("ldk", get_ldk_version())
        promise.resolve(res.toString())
    }

    @ReactMethod
    fun test(promise: Promise) {
        val res = JSONObject()
        res.put("c_bindings", "get_ldk_c_bindings_version()")
        res.put("ldk", "feeEstimator.toString()")

        try {
            val feeEstimator = FeeEstimator.new_impl { confirmation_target: ConfirmationTarget? ->
                1000;
            }

            res.put("ldk", feeEstimator.get_est_sat_per_1000_weight(ConfirmationTarget.LDKConfirmationTarget_Background))

            promise.resolve(res.toString())
        } catch (e: Exception) {
            promise.resolve(res.toString())
        }
    }
}
