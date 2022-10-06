package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.reactnativeldk.*
import org.ldk.enums.ChannelMonitorUpdateErr
import org.ldk.structs.*
import org.ldk.structs.Persist.PersistInterface
import java.io.File

class LdkPersister {
    fun saveChannel(id: OutPoint, data: ChannelMonitor): Result_NoneChannelMonitorUpdateErrZ {
        try {
            if (LdkModule.channelStoragePath != "") {
                File(LdkModule.channelStoragePath + "/" + id.to_channel_id().hexEncodedString() + ".bin").writeBytes(data.write())
            }

            LdkEventEmitter.send(EventTypes.native_log, "Persisted channel (${id.to_channel_id().hexEncodedString()}) to disk")
            LdkEventEmitter.send(EventTypes.backup, "")

            return Result_NoneChannelMonitorUpdateErrZ.ok();
        } catch (e: Exception) {
            val body = Arguments.createMap()
            body.putHexString("channel_id", id.to_channel_id())
            body.putHexString("counterparty_node_id", data._counterparty_node_id)
            LdkEventEmitter.send(EventTypes.emergency_force_close_channel, body)
            return Result_NoneChannelMonitorUpdateErrZ.err(ChannelMonitorUpdateErr.LDKChannelMonitorUpdateErr_PermanentFailure)
        }
    }

    var persister = Persist.new_impl(object : PersistInterface {
        override fun persist_new_channel(id: OutPoint, data: ChannelMonitor, update_id: MonitorUpdateId): Result_NoneChannelMonitorUpdateErrZ {
            return saveChannel(id, data)
        }

        override fun update_persisted_channel(id: OutPoint, update: ChannelMonitorUpdate?, data: ChannelMonitor, update_id: MonitorUpdateId): Result_NoneChannelMonitorUpdateErrZ {
            return saveChannel(id, data)
        }
    })
}