package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import com.reactnativeldk.hexEncodedString
import org.ldk.structs.BroadcasterInterface

class LdkBroadcaster {
    var broadcaster = BroadcasterInterface.new_impl{ txs ->
        txs.forEach { tx ->
            val body = Arguments.createMap()
            body.putString("tx", tx.hexEncodedString())
            LdkEventEmitter.send(EventTypes.broadcast_transaction, body)
        }
    }
}