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

fun ByteArray.hexEncodedString(): String {
    return joinToString("") { "%02x".format(it) }
}

fun String.hexa(): ByteArray {
    check(length % 2 == 0) { "Must have an even length" }
    return chunked(2)
        .map { it.toInt(16).toByte() }
        .toByteArray()
}