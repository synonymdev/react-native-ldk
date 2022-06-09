package com.reactnativeldk
import com.facebook.react.bridge.Promise

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

fun bytesToHex(bytes: ByteArray): String {
    val hex = ""
    for (b in bytes) {
        hex.plus(String.format("%02X", b))
    }

    return hex
}