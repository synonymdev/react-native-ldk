package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.reactnativeldk.*
import org.ldk.structs.*
import org.ldk.enums.*;
import org.ldk.structs.Persist.PersistInterface
import java.io.File

class LdkPersister {
    fun handleChannel(channelFundingOutpoint: OutPoint, data: ChannelMonitor, update_id: MonitorUpdateId): ChannelMonitorUpdateStatus {
        val channelId = data.channel_id()._a.hexEncodedString()
        val body = Arguments.createMap()
        body.putString("channel_id", channelId)
        body.putHexString("counterparty_node_id", data._counterparty_node_id)

        try {
            if (LdkModule.channelStoragePath == "") {
                throw Exception("Channel storage path not set")
            }

            val file = File(LdkModule.channelStoragePath + "/" + channelId  + ".bin")

            val isNew = !file.exists()

            if (BackupClient.skipRemoteBackup) {
                file.writeBytes(data.write())
                if (isNew) {
                    LdkEventEmitter.send(EventTypes.new_channel, body)
                }
                return ChannelMonitorUpdateStatus.LDKChannelMonitorUpdateStatus_Completed
            }

            BackupClient.addToPersistQueue(BackupClient.Label.CHANNEL_MONITOR(channelId=channelId), data.write()) { error ->
                if (error != null) {
                    LdkEventEmitter.send(EventTypes.native_log, "Failed to persist channel (${channelId}) to remote backup: $error")
                    return@addToPersistQueue
                }

                try {
                    file.writeBytes(data.write())
                } catch (e: Exception) {
                    //If this fails we can't do much but LDK will retry on startup
                    LdkEventEmitter.send(EventTypes.native_log, "Failed to locally persist channel (${channelId}) to disk")
                    return@addToPersistQueue
                }

                //Update chain monitor with successful persist
                val res = LdkModule.chainMonitor?.channel_monitor_updated(channelFundingOutpoint, update_id)
                if (res == null || !res.is_ok) {
                    LdkEventEmitter.send(EventTypes.native_log, "Failed to update chain monitor with persisted channel (${channelId})")
                } else {
                    LdkEventEmitter.send(EventTypes.native_log, "Persisted channel (${channelId}) to disk")
                    if (isNew) {
                        LdkEventEmitter.send(EventTypes.new_channel, body)
                    }
                }
            }

            return ChannelMonitorUpdateStatus.LDKChannelMonitorUpdateStatus_InProgress
        } catch (e: Exception) {
            return ChannelMonitorUpdateStatus.LDKChannelMonitorUpdateStatus_UnrecoverableError
        }
    }

    var persister = Persist.new_impl(object : PersistInterface {
        override fun persist_new_channel(channelFundingOutpoint: OutPoint, data: ChannelMonitor, update_id: MonitorUpdateId): ChannelMonitorUpdateStatus {
            return handleChannel(channelFundingOutpoint, data, update_id)
        }

        override fun update_persisted_channel(channelFundingOutpoint: OutPoint, update: ChannelMonitorUpdate?, data: ChannelMonitor, update_id: MonitorUpdateId): ChannelMonitorUpdateStatus {
            return handleChannel(channelFundingOutpoint, data, update_id)
        }

        override fun archive_persisted_channel(p0: OutPoint?) {
            TODO("Not yet implemented")
        }
    })
}