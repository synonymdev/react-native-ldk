package com.reactnativeldk
import com.facebook.react.bridge.*
import org.ldk.enums.Currency
import org.ldk.enums.Network
import org.ldk.structs.*
import java.io.File
import java.io.FileOutputStream
import java.net.URL
import java.nio.channels.Channels

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
    val params = ProbabilisticScoringParameters.with_default()

    //TODO loading cached scorer currently broken
//    val scorerFile = File(path + "/" + LdkFileNames.scorer.fileName)
//    if (scorerFile.exists()) {
//        val read = ProbabilisticScorer.read(scorerFile.readBytes(), params, networkGraph, logger)
//        if (read.is_ok) {
//            LdkEventEmitter.send(EventTypes.native_log, "Loaded scorer from disk")
//            return (read as Result_ProbabilisticScorerDecodeErrorZ.Result_ProbabilisticScorerDecodeErrorZ_OK).res
//        } else {
//            LdkEventEmitter.send(EventTypes.native_log, "Failed to load cached scorer")
//        }
//    }

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

val Invoice.asJson: WritableMap
    get() {
        val result = Arguments.createMap()
        val signedInv = into_signed_raw()
        val rawInvoice = signedInv.raw_invoice()

        if (amount_milli_satoshis() is Option_u64Z.Some) result.putInt("amount_satoshis", ((amount_milli_satoshis() as Option_u64Z.Some).some.toInt() / 1000)) else  result.putNull("amount_satoshis")
        result.putString("description", rawInvoice.description()?.into_inner())
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
        result.putInt("currency", currency().ordinal)
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

        result.putHexString("channel_id", _channel_id)
        result.putBoolean("is_public", _is_public)
        result.putBoolean("is_usable", _is_usable)
        result.putBoolean("is_channel_ready", _is_channel_ready)
        result.putBoolean("is_outbound", _is_outbound)
        result.putInt("balance_sat", (_balance_msat / 1000).toInt())
        result.putHexString("counterparty_node_id", _counterparty._node_id)
        result.putHexString("funding_txid", _funding_txo?._txid?.reversed()?.toByteArray())
        result.putHexString("channel_type", _channel_type?.write())
        result.putString("user_channel_id", _user_channel_id.leBytes.hexEncodedString())
        result.putInt("confirmations_required", (_confirmations_required as Option_u32Z.Some).some)
        (_short_channel_id as? Option_u64Z.Some)?.some?.toInt()
            ?.let { result.putString("short_channel_id", it.toString()) } //Optional number
        (_inbound_scid_alias as? Option_u64Z.Some)?.some?.toInt()
            ?.let { result.putInt("inbound_scid_alias", it) }
        (_inbound_scid_alias as? Option_u64Z.Some)?.some?.toInt()
            ?.let { result.putInt("inbound_payment_scid", it) }
        result.putInt("inbound_capacity_sat", (_inbound_capacity_msat / 1000).toInt())
        result.putInt("outbound_capacity_sat", (_outbound_capacity_msat / 1000).toInt())
        result.putInt("channel_value_satoshis", _channel_value_satoshis.toInt())
        (_force_close_spend_delay as? Option_u16Z.Some)?.some?.toInt()
            ?.let { result.putInt("force_close_spend_delay", it) }
        result.putInt("unspendable_punishment_reserve", (_unspendable_punishment_reserve as Option_u64Z.Some).some.toInt())

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

fun WritableMap.putHexString(key: String, bytes: ByteArray?) {
    if (bytes != null) {
        putString(key, bytes.hexEncodedString())
    } else {
        putString(key, null)
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
    val destinationFile = "$tempStoragePath$timestamp.bin"

    URL(downloadUrl + timestamp).downloadFile(destinationFile) {
        if (it != null) {
            return@downloadFile completion(it)
        }

        val res = update_network_graph(File(destinationFile).readBytes())
        if (!res.is_ok()) {
            val error = res as? Result_u32GraphSyncErrorZ.Result_u32GraphSyncErrorZ_Err

            (error?.err as? GraphSyncError.LightningError)?.let { lightningError ->
                return@downloadFile completion(Error("Rapid sync LightningError. " + lightningError.lightning_error._err))
            }

            (error?.err as? GraphSyncError.DecodeError)?.let { decodeError ->
                (decodeError.decode_error as? DecodeError.Io)?.let { decodeIOError ->
                    return@downloadFile completion(Error("Rapid sync DecodeError. " + decodeIOError.io.ordinal))
                }

                return@downloadFile completion(Error("Rapid sync DecodeError"))
            }

            return@downloadFile completion(Error("Unknown rapid sync error."))
        }

        val usedFile = File(destinationFile)
        if (usedFile.exists()) {
            usedFile.delete()
        }

        completion(null)
    }
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
        _max_dust_htlc_exposure_msat = map.getInt("max_dust_htlc_exposure_msat").toLong()
    } catch (_: Exception) {}
    try {
        _force_close_avoidance_max_fee_satoshis = map.getInt("force_close_avoidance_max_fee_satoshis").toLong()
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

    return this
}

/// Helper for returning real network and currency as a tuple from a string
fun getNetwork(chain: String): Pair<Network, Currency> {
    return when (chain) {
        "regtest" -> Pair(Network.LDKNetwork_Regtest, Currency.LDKCurrency_Regtest)
        "testnet" -> Pair(Network.LDKNetwork_Testnet, Currency.LDKCurrency_BitcoinTestnet)
        "mainnet" -> Pair(Network.LDKNetwork_Bitcoin, Currency.LDKCurrency_Bitcoin)
        else -> Pair(Network.LDKNetwork_Bitcoin, Currency.LDKCurrency_Bitcoin)
    }
}