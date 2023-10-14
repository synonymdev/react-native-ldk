package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.reactnativeldk.*
import org.ldk.structs.*
import org.ldk.enums.*;
import org.ldk.structs.Persist.PersistInterface
import java.io.File

class LdkPersister {
    fun handleChannel(id: OutPoint, data: ChannelMonitor): ChannelMonitorUpdateStatus {
        val body = Arguments.createMap()
        body.putHexString("channel_id", id.to_channel_id())
        body.putHexString("counterparty_node_id", data._counterparty_node_id)

        try {
            if (LdkModule.channelStoragePath == "") {
                throw Exception("Channel storage path not set")
            }

            val channelId = id.to_channel_id().hexEncodedString()

            val file = File(LdkModule.channelStoragePath + "/" + channelId  + ".bin")

            val isNew = !file.exists()

            file.writeBytes(data.write())
            BackupClient.persist(BackupClient.Label.CHANNEL_MONITOR(channelId=channelId), data.write())

            LdkEventEmitter.send(EventTypes.native_log, "Persisted channel (${id.to_channel_id().hexEncodedString()}) to disk")
            LdkEventEmitter.send(EventTypes.backup, "")

            if (isNew) {
                LdkEventEmitter.send(EventTypes.new_channel, body)
            }

            return ChannelMonitorUpdateStatus.LDKChannelMonitorUpdateStatus_Completed
        } catch (e: Exception) {
            return ChannelMonitorUpdateStatus.LDKChannelMonitorUpdateStatus_UnrecoverableError
        }
    }

    var persister = Persist.new_impl(object : PersistInterface {
        override fun persist_new_channel(id: OutPoint, data: ChannelMonitor, update_id: MonitorUpdateId): ChannelMonitorUpdateStatus {
            return handleChannel(id, data)
        }

        override fun update_persisted_channel(id: OutPoint, update: ChannelMonitorUpdate?, data: ChannelMonitor, update_id: MonitorUpdateId): ChannelMonitorUpdateStatus {
            return handleChannel(id, data)
        }
    })
}