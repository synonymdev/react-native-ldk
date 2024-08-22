package com.reactnativeldk
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.*
import org.json.JSONObject
import org.ldk.enums.Currency
import org.ldk.enums.Network
import org.ldk.structs.*
import java.io.File
import java.io.FileOutputStream
import java.net.URL
import java.nio.channels.Channels
import java.util.Date

fun handleResolve(promise: Promise, res: LdkCallbackResponses) {
    if (res != LdkCallbackResponses.log_write_success) {
        LdkEventEmitter.send(EventTypes.native_log, "Success: ${res}")
    }
    promise.resolve(res.toString());
}

fun handleReject(promise: Promise, ldkError: LdkErrors, error: Error? = null) {
    if (error !== null) {
        LdkEventEmitter.send(EventTypes.native_log, "Error: ${ldkError}. Message: ${error.toString()}")
        promise.reject(ldkError.toString(), error);
    } else {
        LdkEventEmitter.send(EventTypes.native_log, "Error: ${ldkError}")
        promise.reject(ldkError.toString(), ldkError.toString())
    }
}

fun ByteArray.hexEncodedString(): String {
    return joinToString("") { "%02x".format(it) }
}

fun String.hexa(): ByteArray {
    check(length % 2 == 0) { "Must have an even length" }
    return chunked(2)
        .map { it.toInt(16).toByte() }
        .toByteArray()
}

fun getProbabilisticScorer(path: String, networkGraph: NetworkGraph, logger: Logger): ProbabilisticScorer? {
    val params = ProbabilisticScoringDecayParameters.with_default()

    val scorerFile = File(path + "/" + LdkFileNames.Scorer.fileName)
    if (scorerFile.exists()) {
        val read = ProbabilisticScorer.read(scorerFile.readBytes(), params, networkGraph, logger)
        if (read.is_ok) {
            LdkEventEmitter.send(EventTypes.native_log, "Loaded scorer from disk")
            return (read as Result_ProbabilisticScorerDecodeErrorZ.Result_ProbabilisticScorerDecodeErrorZ_OK).res
        } else {
            LdkEventEmitter.send(EventTypes.native_log, "Failed to load cached scorer")
        }
    }

    val default_scorer = ProbabilisticScorer.of(params, networkGraph, logger)
    val score_res = ProbabilisticScorer.read(
        default_scorer.write(), params, networkGraph,
        logger
    )
    if (!score_res.is_ok) {
        return null
    }
    return (score_res as Result_ProbabilisticScorerDecodeErrorZ.Result_ProbabilisticScorerDecodeErrorZ_OK).res
}

val Bolt11Invoice.asJson: WritableMap
    get() {
        val result = Arguments.createMap()
        val signedInv = into_signed_raw()
        val rawInvoice = signedInv.raw_invoice()

        if (amount_milli_satoshis() is Option_u64Z.Some) result.putInt("amount_satoshis", ((amount_milli_satoshis() as Option_u64Z.Some).some.toInt() / 1000)) else  result.putNull("amount_satoshis")
        result.putString("description", rawInvoice.description()?.to_str())
        result.putBoolean("check_signature",  signedInv.check_signature())
        result.putBoolean("is_expired",  is_expired)
        result.putInt("duration_since_epoch",  duration_since_epoch().toInt())
        result.putInt("expiry_time",  expiry_time().toInt())
        result.putInt("min_final_cltv_expiry",  min_final_cltv_expiry_delta().toInt())
        result.putHexString("payee_pub_key", rawInvoice.payee_pub_key()?._a)
        result.putHexString("recover_payee_pub_key", recover_payee_pub_key())
        result.putHexString("payment_hash", payment_hash())
        result.putHexString("payment_secret", payment_secret())
        result.putInt("timestamp", timestamp().toInt())
        result.putHexString("features", features()?.write())
        result.putString("currency", currencyString(currency()))
        result.putString("to_str", signedInv.to_str())

        val hints = Arguments.createArray()
        route_hints().iterator().forEach { routeHint ->
            val hops = Arguments.createArray()
            routeHint._a.iterator().forEach { hop ->
                hops.pushMap(hop.asJson)
            }
            hints.pushArray(hops)
        }
        result.putArray("route_hints", hints)

        return result
    }

val RouteHintHop.asJson: WritableMap
    get() {
        val result = Arguments.createMap()

        result.putHexString("src_node_id", _src_node_id)
        result.putString("short_channel_id", _short_channel_id.toString())

        return result
    }

//Our own channels
val ChannelDetails.asJson: WritableMap
    get() {
        val result = Arguments.createMap()

        result.putHexString("channel_id", _channel_id._a)
        result.putBoolean("is_public", _is_public)
        result.putBoolean("is_usable", _is_usable)
        result.putBoolean("is_channel_ready", _is_channel_ready)
        result.putBoolean("is_outbound", _is_outbound)
        result.putInt("balance_sat", (_balance_msat / 1000).toInt())
        result.putHexString("counterparty_node_id", _counterparty._node_id)
        result.putHexString("funding_txid", _funding_txo?._txid?.reversed()?.toByteArray())
        _funding_txo?._index?.toInt()?.let { result.putInt("funding_output_index", it) }
        result.putHexString("channel_type", _channel_type?.write())
        result.putString("user_channel_id", _user_channel_id.leBytes.hexEncodedString())
        result.putInt("confirmations_required", (_confirmations_required as Option_u32Z.Some).some)
        if (_short_channel_id is Option_u64Z.Some) {
            result.putString("short_channel_id", (_short_channel_id as Option_u64Z.Some).some.toULong().toString())
        } else {
            result.putString("short_channel_id", "")
        }
        if (_inbound_scid_alias is Option_u64Z.Some) {
            result.putString("inbound_scid_alias", (_inbound_scid_alias as Option_u64Z.Some).some.toULong().toString())
        } else {
            result.putString("inbound_scid_alias", "")
        }
        if (_inbound_payment_scid is Option_u64Z.Some) {
            result.putString("inbound_payment_scid", (_inbound_payment_scid as Option_u64Z.Some).some.toULong().toString())
        } else {
            result.putString("inbound_payment_scid", "")
        }
        result.putInt("inbound_capacity_sat", (_inbound_capacity_msat / 1000).toInt())
        result.putInt("outbound_capacity_sat", (_outbound_capacity_msat / 1000).toInt())
        result.putInt("channel_value_satoshis", _channel_value_satoshis.toInt())
        (_force_close_spend_delay as? Option_u16Z.Some)?.some?.toInt()
            ?.let { result.putInt("force_close_spend_delay", it) }
        result.putInt("unspendable_punishment_reserve", (_unspendable_punishment_reserve as Option_u64Z.Some).some.toInt())
        result.putInt("config_forwarding_fee_base_msat", (_config?._forwarding_fee_base_msat ?: 0))
        result.putInt("config_forwarding_fee_proportional_millionths", (_config?._forwarding_fee_proportional_millionths ?: 0))
        result.putInt("confirmations", (_confirmations_required as Option_u32Z.Some).some)

        return result
    }

//Channels in our network graph
val ChannelInfo.asJson: WritableMap
    get() {
        val result = Arguments.createMap()

        if (_capacity_sats is Option_u64Z.Some) result.putInt("capacity_sats", ((_capacity_sats as Option_u64Z.Some).some.toInt())) else result.putNull("capacity_sats")
        result.putHexString("node_one", _node_one.as_slice())
        result.putHexString("node_two", _node_two.as_slice())

        result.putInt("one_to_two_fees_base_sats", _one_to_two?._fees?._base_msat?.div(1000) ?: 0)
        result.putInt("one_to_two_fees_proportional_millionths", _one_to_two?._fees?._proportional_millionths ?: 0)
        result.putBoolean("one_to_two_enabled", _one_to_two?._enabled ?: false)
        result.putInt("one_to_two_last_update", _one_to_two?._last_update ?: 0)
        result.putInt("one_to_two_htlc_maximum_sats", ((_one_to_two?._htlc_maximum_msat ?: 0) / 1000).toInt())
        result.putInt("one_to_two_htlc_minimum_sats", ((_one_to_two?._htlc_minimum_msat ?: 0) / 1000).toInt())

        result.putInt("two_to_one_fees_base_sats", _two_to_one?._fees?._base_msat?.div(1000) ?: 0)
        result.putInt("two_to_one_fees_proportional_millionths", _two_to_one?._fees?._proportional_millionths ?: 0)
        result.putBoolean("two_to_one_enabled", _two_to_one?._enabled ?: false)
        result.putInt("two_to_one_last_update", _two_to_one?._last_update ?: 0)
        result.putInt("two_to_one_htlc_maximum_sats", ((_two_to_one?._htlc_maximum_msat ?: 0) / 1000).toInt())
        result.putInt("two_to_one_htlc_minimum_sats", ((_two_to_one?._htlc_minimum_msat ?: 0) / 1000).toInt())

        return result
    }

val NodeInfo.asJson: WritableMap
    get() {
        val result = Arguments.createMap()

        val shortChannelIds = Arguments.createArray()
        _channels.iterator().forEach { shortChannelIds.pushString(it.toString()) }
        result.putArray("shortChannelIds", shortChannelIds)
        result.putDouble("announcement_info_last_update", (_announcement_info?._last_update ?: 0).toDouble() * 1000)
        return result
    }

val RouteHop.asJson: WritableMap
    get() {
        val hop = Arguments.createMap()
        hop.putHexString("pubkey", _pubkey)
        hop.putInt("fee_sat", (_fee_msat / 1000).toInt())
        return hop
    }


fun ChannelMonitor.asJson(channelId: String): WritableMap {
    val result = Arguments.createMap()
    result.putString("channel_id", channelId)
    result.putInt("funding_txo_index", _funding_txo._a._index.toInt())
    result.putHexString("funding_txo_txid", _funding_txo._a._txid.reversedArray())
    result.putHexString("counterparty_node_id", _counterparty_node_id)

    val balances = Arguments.createArray()
    _claimable_balances.iterator().forEach { balance ->
        balances.pushMap(balance.asJson)
    }
    result.putArray("claimable_balances", balances)
    return result
}

fun WritableMap.putHexString(key: String, bytes: ByteArray?) {
    if (bytes != null) {
        putString(key, bytes.hexEncodedString())
    } else {
        putString(key, null)
    }
}

/**
 * Adds a Date object into the map.
 * If the date is not null, it is converted to a double representing the unix timestamp.
 * If it's null, a null value is added to the map.
 *
 * @param key The key under which the date will be stored in the map.
 * @param date The date to be stored in the map. Can be null.
 */
fun WritableMap.putDateOrNull(key: String, date: Date?) {
    if (date != null) {
        putDouble(key, date.time.toDouble())
    } else {
        putNull(key)
    }
}

fun WritableArray.pushHexString(bytes: ByteArray) {
    pushString(bytes.hexEncodedString())
}

fun URL.downloadFile(destination: String, completion: (error: Error?) -> Unit) {
    try {
        openStream().use {
            Channels.newChannel(it).use { rbc ->
                FileOutputStream(destination).use { fos ->
                    fos.channel.transferFrom(rbc, 0, Long.MAX_VALUE)
                    completion(null)
                }
            }
        }
    } catch (e: Exception) {
        completion(Error(e))
    }
}

fun RapidGossipSync.downloadAndUpdateGraph(downloadUrl: String, tempStoragePath: String, timestamp: Long, completion: (error: Error?) -> Unit) {
    Thread(Runnable {
        val destinationFile = "$tempStoragePath$timestamp.bin"

        URL(downloadUrl + timestamp).downloadFile(destinationFile) {
            if (it != null) {
                UiThreadUtil.runOnUiThread {
                    completion(it)
                }
                return@downloadFile
            }

            val res = update_network_graph(File(destinationFile).readBytes())
            if (!res.is_ok()) {
                val error = res as? Result_u32GraphSyncErrorZ.Result_u32GraphSyncErrorZ_Err

                (error?.err as? GraphSyncError.LightningError)?.let { lightningError ->
                    UiThreadUtil.runOnUiThread {
                        completion(Error("Rapid sync LightningError. " + lightningError.lightning_error._err))
                    }
                    return@downloadFile
                }

                (error?.err as? GraphSyncError.DecodeError)?.let { decodeError ->
                    (decodeError.decode_error as? DecodeError.Io)?.let { decodeIOError ->
                        UiThreadUtil.runOnUiThread {
                            completion(Error("Rapid sync DecodeError. " + decodeIOError.io.ordinal))
                        }
                        return@downloadFile
                    }

                    UiThreadUtil.runOnUiThread {
                        completion(Error("Rapid sync DecodeError"))
                    }
                    return@downloadFile
                }

                UiThreadUtil.runOnUiThread {
                    completion(Error("Unknown rapid sync error."))
                }
                return@downloadFile
            }

            val usedFile = File(destinationFile)
            if (usedFile.exists()) {
                usedFile.delete()
            }

            UiThreadUtil.runOnUiThread {
                completion(null)
            }
        }
    }).start()
}

fun ChannelHandshakeConfig.mergeWithMap(map: ReadableMap?): ChannelHandshakeConfig {
    if (map == null) {
        return this
    }

    try {
        _minimum_depth = map.getInt("minimum_depth")
    } catch (_: Exception) {}
    try {
        _our_to_self_delay = map.getInt("our_to_self_delay").toShort()
    } catch (_: Exception) {}
    try {
        _our_htlc_minimum_msat = map.getInt("our_htlc_minimum_msat").toLong()
    } catch (_: Exception) {}
    try {
        _max_inbound_htlc_value_in_flight_percent_of_channel = map.getInt("max_inbound_htlc_value_in_flight_percent_of_channel").toByte()
    } catch (_: Exception) {}
    try {
        _negotiate_scid_privacy = map.getBoolean("negotiate_scid_privacy")
    } catch (_: Exception) {}
    try {
        _announced_channel = map.getBoolean("announced_channel")
    } catch (_: Exception) {}
    try {
        _commit_upfront_shutdown_pubkey = map.getBoolean("commit_upfront_shutdown_pubkey")
    } catch (_: Exception) {}
    try {
        _commit_upfront_shutdown_pubkey = map.getBoolean("commit_upfront_shutdown_pubkey")
    } catch (_: Exception) {}
    try {
        _their_channel_reserve_proportional_millionths = map.getInt("their_channel_reserve_proportional_millionths")
    } catch (_: Exception) {}
    try {
        _negotiate_anchors_zero_fee_htlc_tx = map.getBoolean("negotiate_anchors_zero_fee_htlc_tx")
    } catch (_: Exception) {}
    try {
        _our_max_accepted_htlcs = map.getInt("our_max_accepted_htlcs_arg").toShort()
    } catch (_: Exception) {}

    return this
}

fun ChannelHandshakeLimits.mergeWithMap(map: ReadableMap?): ChannelHandshakeLimits {
    if (map == null) {
        return this
    }

    try {
        _min_funding_satoshis = map.getInt("min_funding_satoshis").toLong()
    } catch (_: Exception) {}
    try {
        _max_funding_satoshis = map.getInt("max_funding_satoshis").toLong()
    } catch (_: Exception) {}
    try {
        _max_htlc_minimum_msat = map.getInt("max_htlc_minimum_msat").toLong()
    } catch (_: Exception) {}
    try {
        _min_max_htlc_value_in_flight_msat = map.getInt("min_max_htlc_value_in_flight_msat").toLong()
    } catch (_: Exception) {}
    try {
        _max_channel_reserve_satoshis = map.getInt("max_channel_reserve_satoshis").toLong()
    } catch (_: Exception) {}
    try {
        _min_max_accepted_htlcs = map.getInt("min_max_accepted_htlcs").toShort()
    } catch (_: Exception) {}
    try {
        _max_minimum_depth = map.getInt("max_minimum_depth")
    } catch (_: Exception) {}
    try {
        _trust_own_funding_0conf = map.getBoolean("trust_own_funding_0conf")
    } catch (_: Exception) {}
    try {
        _force_announced_channel_preference = map.getBoolean("force_announced_channel_preference")
    } catch (_: Exception) {}
    try {
        _their_to_self_delay = map.getInt("their_to_self_delay").toShort()
    } catch (_: Exception) {}

    return this
}

fun ChannelConfig.mergeWithMap(map: ReadableMap?): ChannelConfig {
    if (map == null) {
        return this
    }

    try {
        _forwarding_fee_base_msat = map.getInt("forwarding_fee_base_msat")
    } catch (_: Exception) {}
    try {
        _forwarding_fee_base_msat = map.getInt("forwarding_fee_base_msat")
    } catch (_: Exception) {}
    try {
        _cltv_expiry_delta = map.getInt("cltv_expiry_delta").toShort()
    } catch (_: Exception) {}
    try {
        if (map.getString("max_dust_htlc_exposure_type") == "fixed_limit") {
            _max_dust_htlc_exposure = MaxDustHTLCExposure.fixed_limit_msat(map.getInt("max_dust_htlc_exposure").toLong())
        } else if (map.getString("max_dust_htlc_exposure_type") == "fee_rate_multiplier") {
            _max_dust_htlc_exposure = MaxDustHTLCExposure.fee_rate_multiplier(map.getInt("max_dust_htlc_exposure").toLong())
        }
    } catch (_: Exception) {}
    try {
        _force_close_avoidance_max_fee_satoshis = map.getInt("force_close_avoidance_max_fee_satoshis").toLong()
    } catch (_: Exception) {}
    try {
        _accept_underpaying_htlcs = map.getBoolean("_accept_underpaying_htlcs")
    } catch (_: Exception) {}

    return this
}

fun UserConfig.mergeWithMap(map: ReadableMap): UserConfig {
    _channel_handshake_config = _channel_handshake_config.mergeWithMap(map.getMap("channel_handshake_config"))
    _channel_handshake_limits = _channel_handshake_limits.mergeWithMap(map.getMap("channel_handshake_limits"))
    _channel_config = _channel_config.mergeWithMap(map.getMap("channel_config"))

    try {
        _accept_forwards_to_priv_channels = map.getBoolean("accept_forwards_to_priv_channels")
    } catch (_: Exception) {}

    try {
        _accept_inbound_channels = map.getBoolean("accept_inbound_channels")
    } catch (_: Exception) {}

    try {
        _manually_accept_inbound_channels = map.getBoolean("manually_accept_inbound_channels")
    } catch (_: Exception) {}

    try {
        _accept_intercept_htlcs = map.getBoolean("accept_intercept_htlcs")
    } catch (_: Exception) {}

    try {
        _accept_mpp_keysend = map.getBoolean("accept_mpp_keysend")
    } catch (_: Exception) {}

    return this
}

val Balance.asJson: WritableMap
    get() {
        val map = Arguments.createMap()
        //Defaults if all castings for balance fail
        map.putInt("amount_satoshis", 0)
        map.putString("type", "Unknown")

        (this as? Balance.ClaimableAwaitingConfirmations)?.let { claimableAwaitingConfirmations ->
            map.putInt("amount_satoshis", claimableAwaitingConfirmations.amount_satoshis.toInt())
            map.putInt("confirmation_height", claimableAwaitingConfirmations.confirmation_height)
            map.putString("type", "ClaimableAwaitingConfirmations")
        }

        (this as? Balance.ClaimableOnChannelClose)?.let { claimableOnChannelClose ->
            map.putInt("amount_satoshis", claimableOnChannelClose.amount_satoshis.toInt())
            map.putString("type", "ClaimableOnChannelClose")
        }

        (this as? Balance.ContentiousClaimable)?.let { contentiousClaimable ->
            map.putInt("amount_satoshis", contentiousClaimable.amount_satoshis.toInt())
            map.putInt("timeout_height", contentiousClaimable.timeout_height)
            map.putString("type", "ContentiousClaimable")
        }

        (this as? Balance.CounterpartyRevokedOutputClaimable)?.let { counterpartyRevokedOutputClaimable ->
            map.putInt("amount_satoshis", counterpartyRevokedOutputClaimable.amount_satoshis.toInt())
            map.putString("type", "CounterpartyRevokedOutputClaimable")
        }

        (this as? Balance.MaybePreimageClaimableHTLC)?.let { maybePreimageClaimableHTLC ->
            map.putInt("amount_satoshis", maybePreimageClaimableHTLC.amount_satoshis.toInt())
            map.putInt("expiry_height", maybePreimageClaimableHTLC.expiry_height)
            map.putString("type", "MaybePreimageClaimableHTLC")
        }

        (this as? Balance.MaybeTimeoutClaimableHTLC)?.let { maybeTimeoutClaimableHTLC ->
            map.putInt("amount_satoshis", maybeTimeoutClaimableHTLC.amount_satoshis.toInt())
            map.putInt("claimable_height", maybeTimeoutClaimableHTLC.claimable_height)
            map.putString("type", "MaybeTimeoutClaimableHTLC")
        }

        return map
    }

fun ChainMonitor.getClaimableBalancesAsJson(ignoredChannels: Array<ChannelDetails>): WritableArray {
    val result = Arguments.createArray()

    get_claimable_balances(ignoredChannels).iterator().forEach { balance ->
        result.pushMap(balance.asJson)
    }

    return result
}

/// Helper for returning real network and currency as a tuple from a string
fun getNetwork(chain: String): Pair<Network, Currency> {
    return when (chain) {
        "bitcoin" -> Pair(Network.LDKNetwork_Bitcoin, Currency.LDKCurrency_Bitcoin)
        "testnet" -> Pair(Network.LDKNetwork_Testnet, Currency.LDKCurrency_BitcoinTestnet)
        "regtest" -> Pair(Network.LDKNetwork_Regtest, Currency.LDKCurrency_Regtest)
        "signet" -> Pair(Network.LDKNetwork_Signet, Currency.LDKCurrency_Signet)
        else -> Pair(Network.LDKNetwork_Bitcoin, Currency.LDKCurrency_Bitcoin)
    }
}

fun currencyString(currency: Currency): String {
    return when (currency) {
        Currency.LDKCurrency_Bitcoin -> "Bitcoin"
        Currency.LDKCurrency_BitcoinTestnet -> "BitcoinTestnet"
        Currency.LDKCurrency_Regtest -> "Regtest"
        Currency.LDKCurrency_Simnet -> "Simnet"
        Currency.LDKCurrency_Signet -> "Signet"
        else -> "Unknown"
    }
}

fun mergeObj(obj1: JSONObject, obj2: HashMap<String, Any>): HashMap<String, Any> {
    val newObj = HashMap<String, Any>()

    obj1.keys().forEach { key ->
        newObj[key] = obj1[key]
    }

    obj2.keys.forEach { key ->
        newObj[key] = obj2[key]!!
    }

    return newObj
}

object UiThreadDebouncer {
    private val pending = hashMapOf<String, Runnable>()
    private val handler = Handler(Looper.getMainLooper())

    /**
     * Used to debounce an [action] function call to be executed after a delay on the main thread
     *
     * @param interval The delay in milliseconds after which the action will be executed. Default value is 250ms.
     * @param key The unique identifier for the action to be debounced. If an action with the same key is already pending, it will be cancelled.
     * @param action The function to be executed after the interval.
     */
    fun debounce(interval: Long = 250, key: String, action: () -> Unit) {
        pending[key]?.let { handler.removeCallbacks(it) }
        val runnable = Runnable(action)
        pending[key] = runnable

        handler.postDelayed(runnable, interval)
    }
}
