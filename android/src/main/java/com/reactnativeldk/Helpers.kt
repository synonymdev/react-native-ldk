package com.reactnativeldk
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import org.ldk.structs.Option_u64Z
import org.ldk.structs.Result_InvoiceParseOrSemanticErrorZ.Result_InvoiceParseOrSemanticErrorZ_OK

fun handleResolve(promise: Promise, res: LdkCallbackResponses) {
    LdkEventEmitter.send(EventTypes.swift_log, "Success: ${res}")
    promise.resolve(res.toString());
}

fun handleReject(promise: Promise, ldkError: LdkErrors, error: Error? = null) {
    if (error !== null) {
        LdkEventEmitter.send(EventTypes.swift_log, "Error: ${ldkError}. Message: ${error.toString()}")
        promise.reject(ldkError.toString(), error);
    } else {
        LdkEventEmitter.send(EventTypes.swift_log, "Error: ${ldkError}")
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
fun Result_InvoiceParseOrSemanticErrorZ_OK.json(): WritableMap {
    val result = Arguments.createMap()
    val inv = this.res
    val signedInv = inv.into_signed_raw()
    val rawInvoice = signedInv.raw_invoice()

    result.putDouble("amount_milli_satoshis", (this.res.amount_milli_satoshis() as Option_u64Z.Some).some.toDouble())
    result.putString("description", rawInvoice.description()?.into_inner())
    result.putBoolean("check_signature",  signedInv.check_signature())
    result.putBoolean("is_expired",  inv.is_expired)
    result.putInt("duration_since_epoch",  inv.duration_since_epoch().toInt())
    result.putInt("expiry_time",  inv.expiry_time().toInt())
    result.putInt("min_final_cltv_expiry",  inv.min_final_cltv_expiry().toInt())
    result.putString("payee_pub_key", rawInvoice.payee_pub_key()?._a?.hexEncodedString())

//            recover_payee_pub_key: string;
//            payment_hash: string;
//            payment_secret: string;
//            timestamp: number;
//            features: string;
//            currency: number;
//            to_str: string; //Actual bolt11 invoice string


    return result
}