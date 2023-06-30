package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.reactnativeldk.*
import org.json.JSONArray
import org.ldk.batteries.ChannelManagerConstructor
import org.ldk.structs.Event
import org.ldk.structs.Option_u64Z
import org.ldk.structs.PaymentPurpose
import java.io.File

class LdkChannelManagerPersister: ChannelManagerConstructor.EventHandler {
    override fun handle_event(event: Event) {
        (event as? Event.FundingGenerationReady)?.let { fundingGenerationReady ->
            val body = Arguments.createMap()
            body.putHexString("temp_channel_id", fundingGenerationReady.temporary_channel_id)
            body.putHexString("output_script", fundingGenerationReady.output_script)
            body.putString("user_channel_id", fundingGenerationReady.user_channel_id.toString())
            body.putInt("value_satoshis", fundingGenerationReady.channel_value_satoshis.toInt())
            return LdkEventEmitter.send(EventTypes.channel_manager_funding_generation_ready, body)
        }

        (event as? Event.PaymentClaimable)?.let { paymentClaimable ->
            val body = Arguments.createMap()
            body.putHexString("payment_hash", paymentClaimable.payment_hash)
            body.putInt("amount_sat", paymentClaimable.amount_msat.toInt() / 1000)
            (paymentClaimable.purpose as? PaymentPurpose.InvoicePayment)?.let {
                body.putHexString("payment_preimage", it.payment_preimage)
                body.putHexString("payment_secret", it.payment_secret)
            }
            (paymentClaimable.purpose as? PaymentPurpose.SpontaneousPayment)?.let {
                body.putHexString("spontaneous_payment_preimage", it.spontaneous_payment)
            }
            body.putInt("unix_timestamp", (System.currentTimeMillis() / 1000).toInt())
            body.putString("state", "pending")

            persistPaymentClaimed(body)
            return LdkEventEmitter.send(EventTypes.channel_manager_payment_claimable, body)
        }

        (event as? Event.PaymentSent)?.let { paymentSent ->
            val body = Arguments.createMap()
            body.putHexString("payment_id", paymentSent.payment_id)
            body.putHexString("payment_preimage", paymentSent.payment_preimage)
            body.putHexString("payment_hash", paymentSent.payment_hash)
            body.putInt("fee_paid_sat", (paymentSent.fee_paid_msat as Option_u64Z.Some).some.toInt() / 1000)
            body.putInt("unix_timestamp", (System.currentTimeMillis() / 1000).toInt())
            body.putString("state", "successful")

            persistPaymentSent(body.toHashMap())

            return LdkEventEmitter.send(EventTypes.channel_manager_payment_sent, body)
        }

        (event as? Event.OpenChannelRequest)?.let { openChannelRequest ->
            //Use if we ever manually accept inbound channels. Setting in initConfig.
            val body = Arguments.createMap()
            body.putHexString("temp_channel_id", openChannelRequest.temporary_channel_id)
            body.putHexString("counterparty_node_id", openChannelRequest.counterparty_node_id)
            body.putInt("push_sat", openChannelRequest.push_msat.toInt() / 1000)
            body.putInt("funding_satoshis", openChannelRequest.funding_satoshis.toInt())
            body.putHexString("channel_type", openChannelRequest.channel_type.write())
            return LdkEventEmitter.send(EventTypes.channel_manager_open_channel_request, body)
        }

        (event as? Event.PaymentPathSuccessful)?.let { paymentPathSuccessful ->
            val body = Arguments.createMap()

            body.putHexString("payment_id", paymentPathSuccessful.payment_id)
            body.putHexString("payment_hash", paymentPathSuccessful.payment_hash)

            val pathHops = Arguments.createArray()
            println(paymentPathSuccessful.path)
            body.putArray("path_hops", pathHops)

            return LdkEventEmitter.send(EventTypes.channel_manager_payment_path_successful, body)
        }

        (event as? Event.PaymentPathFailed)?.let { paymentPathFailed ->
            val body = Arguments.createMap()
            body.putHexString("payment_id", paymentPathFailed.payment_id)
            body.putHexString("payment_hash", paymentPathFailed.payment_hash)
            body.putBoolean("payment_failed_permanently", paymentPathFailed.payment_failed_permanently)
            body.putInt("short_channel_id", (paymentPathFailed.short_channel_id as Option_u64Z.Some).some.toInt())
//            val path = Arguments.createArray()
//            paymentPathFailed.path.iterator().forEach { path.pushMap(it.asJson) }
//            body.putArray("path_hops", path)

            if (paymentPathFailed.payment_id != null) {
                persistPaymentSent(hashMapOf(
                    "payment_id" to paymentPathFailed.payment_id!!.hexEncodedString(),
                    "payment_hash" to paymentPathFailed.payment_hash.hexEncodedString(),
                    "unix_timestamp" to (System.currentTimeMillis() / 1000).toInt(),
                    "state" to if (paymentPathFailed.payment_failed_permanently) "failed" else "pending"
                ))
            }

            return LdkEventEmitter.send(EventTypes.channel_manager_payment_path_failed, body)
        }

        (event as? Event.PaymentFailed)?.let { paymentFailed ->
            val body = Arguments.createMap()
            body.putHexString("payment_id", paymentFailed.payment_id)
            body.putHexString("payment_hash", paymentFailed.payment_hash)

            persistPaymentSent(hashMapOf(
                "payment_id" to paymentFailed.payment_id!!.hexEncodedString(),
                "payment_hash" to paymentFailed.payment_hash.hexEncodedString(),
                "unix_timestamp" to (System.currentTimeMillis() / 1000).toInt(),
                "state" to "failed"
            ))

            return LdkEventEmitter.send(EventTypes.channel_manager_payment_failed, body)
        }

        (event as? Event.PaymentForwarded)?.let { paymentForwarded ->
            //Unused on mobile
        }

        (event as? Event.PendingHTLCsForwardable)?.let { pendingHTLCsForwardable ->
            val body = Arguments.createMap()
            body.putInt("time_forwardable", pendingHTLCsForwardable.time_forwardable.toInt())
            return LdkEventEmitter.send(EventTypes.channel_manager_pending_htlcs_forwardable, body)
        }

        (event as? Event.SpendableOutputs)?.let { spendableOutputs ->
            val body = Arguments.createMap()
            val outputs = Arguments.createArray()
            spendableOutputs.outputs.iterator().forEach {
                outputs.pushHexString(it.write())
            }
            body.putArray("outputsSerialized", outputs)
            return LdkEventEmitter.send(EventTypes.channel_manager_spendable_outputs, body)
        }

        (event as? Event.ChannelClosed)?.let { channelClosed ->
            val body = Arguments.createMap()
            body.putString("user_channel_id", channelClosed.user_channel_id.toString())
            body.putHexString("channel_id", channelClosed.channel_id)
            body.putHexString("reason", channelClosed.reason.write())
            return LdkEventEmitter.send(EventTypes.channel_manager_channel_closed, body)
        }

        (event as? Event.DiscardFunding)?.let { discardFunding ->
            val body = Arguments.createMap()
            body.putHexString("channel_id", discardFunding.channel_id)
            body.putHexString("tx", discardFunding.transaction)
            return LdkEventEmitter.send(EventTypes.channel_manager_discard_funding, body)
        }

        (event as? Event.PaymentClaimed)?.let { paymentClaimed ->
            val body = Arguments.createMap()
            body.putHexString("payment_hash", paymentClaimed.payment_hash)
            body.putInt("amount_sat", paymentClaimed.amount_msat.toInt() / 1000)
            (paymentClaimed.purpose as? PaymentPurpose.InvoicePayment)?.let {
                body.putHexString("payment_preimage", it.payment_preimage)
                body.putHexString("payment_secret", it.payment_secret)
            }
            (paymentClaimed.purpose as? PaymentPurpose.SpontaneousPayment)?.let {
                body.putHexString("spontaneous_payment_preimage", it.spontaneous_payment)
            }
            body.putInt("unix_timestamp", (System.currentTimeMillis() / 1000).toInt())
            body.putString("state", "successful")

            persistPaymentClaimed(body)
            return LdkEventEmitter.send(EventTypes.channel_manager_payment_claimed, body)
        }
    }

    override fun persist_manager(channel_manager_bytes: ByteArray?) {
        if (channel_manager_bytes != null && LdkModule.accountStoragePath != "") {
            File(LdkModule.accountStoragePath + "/" + LdkFileNames.channel_manager.fileName).writeBytes(channel_manager_bytes)
            LdkEventEmitter.send(EventTypes.native_log, "Persisted channel manager to disk")
            LdkEventEmitter.send(EventTypes.backup, "")
        }
    }

    override fun persist_network_graph(network_graph: ByteArray?) {
        if (network_graph != null && LdkModule.accountStoragePath != "") {
            File(LdkModule.accountStoragePath + "/" + LdkFileNames.network_graph.fileName).writeBytes(network_graph)
            LdkEventEmitter.send(EventTypes.native_log, "Persisted network graph to disk")
        } else {
            LdkEventEmitter.send(EventTypes.native_log, "Error. Failed to persist network graph to disk.")
        }
    }

    override fun persist_scorer(p0: ByteArray?) {
        if (p0 != null && LdkModule.accountStoragePath != "") {
            File(LdkModule.accountStoragePath + "/" + LdkFileNames.scorer.fileName).writeBytes(p0)
            LdkEventEmitter.send(EventTypes.native_log, "Persisted scorer to disk")
        }
    }

    private fun persistPaymentClaimed(payment: WritableMap) {
        if (LdkModule.accountStoragePath == "") {
            LdkEventEmitter.send(EventTypes.native_log, "Error. Failed to persist claimed payment to disk (No set storage)")
            return
        }

        var payments: Array<HashMap<String, Any>> = arrayOf()
        var paymentReplaced = false

        try {
            if (File(LdkModule.accountStoragePath + "/" + LdkFileNames.paymentsClaimed.fileName).exists()) {
                val data = File(LdkModule.accountStoragePath + "/" + LdkFileNames.paymentsClaimed.fileName).readBytes()
                val existingPayments = JSONArray(String(data))
                for (i in 0 until existingPayments.length()) {
                    val existingPayment = existingPayments.getJSONObject(i)
                    //Replace entry if payment hash exists (Confirmed payment replacing pending)
                    if (existingPayment.getString("payment_hash") == payment.getString("payment_hash")) {
                        payments[i] = mergeObj(existingPayment, payment.toHashMap())
                        paymentReplaced = true
                        continue
                    }

                    val map = HashMap<String, Any>()
                    for (key in existingPayment.keys()) {
                        map[key] = existingPayments.getJSONObject(i).get(key)
                    }

                    payments = payments.plus(map)
                }
            }
        } catch (e: Exception) {
            LdkEventEmitter.send(EventTypes.native_log, "Error could not read existing claimed payments")
        }

        //No existing payment found, append as new payment
        if (!paymentReplaced) {
            payments = payments.plus(payment.toHashMap())
        }

        File(LdkModule.accountStoragePath + "/" + LdkFileNames.paymentsClaimed.fileName).writeText(JSONArray(payments).toString())
    }

    fun persistPaymentSent(payment: HashMap<String, Any>) {
        if (LdkModule.accountStoragePath == "") {
            LdkEventEmitter.send(EventTypes.native_log, "Error. Failed to persist sent payment to disk (No set storage)")
            return
        }

        var payments: Array<HashMap<String, Any>> = arrayOf()
        var paymentReplaced = false

        try {
            if (File(LdkModule.accountStoragePath + "/" + LdkFileNames.paymentsSent.fileName).exists()) {
                val data = File(LdkModule.accountStoragePath + "/" + LdkFileNames.paymentsSent.fileName).readBytes()
                val existingPayments = JSONArray(String(data))
                for (i in 0 until existingPayments.length()) {
                    val existingPayment = existingPayments.getJSONObject(i)
                    //Replace entry if payment ID exists (Confirmed payment replacing pending)
                    if (existingPayment.getString("payment_id") == payment["payment_id"]) {
                        var merged = mergeObj(existingPayment, payment)
                        payments = payments.plus(merged)
                        paymentReplaced = true
                        continue
                    }

                    val map = HashMap<String, Any>()
                    for (key in existingPayment.keys()) {
                        map[key] = existingPayment.get(key)
                    }

                    payments = payments.plus(map)
                }
            }
        } catch (e: Exception) {
            LdkEventEmitter.send(EventTypes.native_log, "Error could not read existing sent payments")
        }

        //No existing payment found, append as new payment
        if (!paymentReplaced) {
            payments = payments.plus(payment)
        }

        File(LdkModule.accountStoragePath + "/" + LdkFileNames.paymentsSent.fileName).writeText(JSONArray(payments).toString())
    }
}
