package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import com.reactnativeldk.hexEncodedString
import org.ldk.structs.*
import org.ldk.structs.Persist.PersistInterface

class LdkPersister {
    fun getResponseBody(id: OutPoint, data: ChannelMonitor): WritableMap {
        val body = Arguments.createMap()
        body.putString("id", id.write().hexEncodedString())
        body.putString("data", data.write().hexEncodedString())
        return body
    }

    var persister = Persist.new_impl(object : PersistInterface {
        override fun persist_new_channel(id: OutPoint, data: ChannelMonitor, update_id: MonitorUpdateId): Result_NoneChannelMonitorUpdateErrZ {
            LdkEventEmitter.send(EventTypes.persist_new_channel, getResponseBody(id, data))
            return Result_NoneChannelMonitorUpdateErrZ.ok();
        }

        override fun update_persisted_channel(id: OutPoint, update: ChannelMonitorUpdate?, data: ChannelMonitor, update_id: MonitorUpdateId): Result_NoneChannelMonitorUpdateErrZ {
            LdkEventEmitter.send(EventTypes.update_persisted_channel, getResponseBody(id, data))
            return Result_NoneChannelMonitorUpdateErrZ.ok();
        }
    })
}