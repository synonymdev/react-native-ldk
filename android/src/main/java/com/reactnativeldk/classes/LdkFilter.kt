package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import com.reactnativeldk.bytesToHex
import org.ldk.structs.Filter
import org.ldk.structs.Filter.FilterInterface
import org.ldk.structs.Option_C2Tuple_usizeTransactionZZ
import org.ldk.structs.WatchedOutput

class LdkFilter {
    var filter = Filter.new_impl(object : FilterInterface {
        override fun register_tx(txid: ByteArray, script_pubkey: ByteArray) {
            val body = Arguments.createMap()
            body.putString("txid", bytesToHex(txid))
            body.putString("script_pubkey", bytesToHex(script_pubkey))
            LdkEventEmitter.send(EventTypes.register_tx, body)
        }

        override fun register_output(output: WatchedOutput): Option_C2Tuple_usizeTransactionZZ {
            val body = Arguments.createMap()
            if (output._block_hash != null) {
                body.putString("block_hash", bytesToHex(output._block_hash!!))
            }
            body.putInt("index", output._outpoint._index.toInt())
            body.putString("script_pubkey", bytesToHex(output._script_pubkey))
            LdkEventEmitter.send(EventTypes.register_tx, body)
            return Option_C2Tuple_usizeTransactionZZ.none();
        }
    })
}