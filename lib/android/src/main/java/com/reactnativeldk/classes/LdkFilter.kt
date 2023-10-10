package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import com.reactnativeldk.hexEncodedString
import com.reactnativeldk.putHexString
import org.ldk.structs.Filter
import org.ldk.structs.Filter.FilterInterface
import org.ldk.structs.Option_ThirtyTwoBytesZ
import org.ldk.structs.WatchedOutput

class LdkFilter {
    var filter = Filter.new_impl(object : FilterInterface {
        override fun register_tx(txid: ByteArray, script_pubkey: ByteArray) {
            val body = Arguments.createMap()
            body.putString("txid", txid.reversedArray().hexEncodedString())
            body.putString("script_pubkey", script_pubkey.hexEncodedString())
            LdkEventEmitter.send(EventTypes.register_tx, body)
        }

        override fun register_output(output: WatchedOutput) {
            val body = Arguments.createMap()
            if (output._block_hash is Option_ThirtyTwoBytesZ.Some) {
                body.putHexString("block_hash", (output._block_hash as Option_ThirtyTwoBytesZ.Some).some)
            }
            body.putInt("index", output._outpoint._index.toInt())
            body.putString("script_pubkey", output._script_pubkey.hexEncodedString())
            LdkEventEmitter.send(EventTypes.register_output, body)
        }
    })
}