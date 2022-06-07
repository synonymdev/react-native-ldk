package com.reactnativeldk
import com.facebook.react.bridge.Promise

fun handleResolve(promise: Promise, res: LdkCallbackResponses) {
    //TODO log
    LdkEventEmitter.send(EventTypes.swift_log, "Success: ${res}")
    promise.resolve(res.toString());
}