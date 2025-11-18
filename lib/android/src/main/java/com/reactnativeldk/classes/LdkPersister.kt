package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.reactnativeldk.*
import org.ldk.structs.*
import org.ldk.enums.*;
import org.ldk.structs.Persist.PersistInterface
import java.io.File

class LdkPersister {
    fun handleChannel(channelFundingOutpoint: OutPoint, data: ChannelMonitor): ChannelMonitorUpdateStatus {
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
            val serialized = data.write()

            // If we're not remotely backing up, write locally and return
            if (BackupClient.skipRemoteBackup) {
                file.writeBytes(serialized)
                if (isNew) {
                    LdkEventEmitter.send(EventTypes.new_channel, body)
                }
                return ChannelMonitorUpdateStatus.LDKChannelMonitorUpdateStatus_Completed
            }

            // For new channels: write locally first to prevent loss if app is killed during backup
            // Then try remote backup asynchronously
            if (isNew) {
                file.writeBytes(serialized)
                
                // Update chain monitor on main thread
                LdkEventEmitter.getReactContext()?.runOnUiQueueThread {
                    val res = LdkModule.chainMonitor?.channel_monitor_updated(channelFundingOutpoint, data._latest_update_id)
                    if (res == null || !res.is_ok) {
                        LdkEventEmitter.send(EventTypes.native_log, "Failed to update chain monitor with persisted channel (${channelId})")
                    } else {
                        LdkEventEmitter.send(EventTypes.native_log, "Persisted channel (${channelId}) to disk")
                        LdkEventEmitter.send(EventTypes.new_channel, body)
                    }
                }
                
                // Kick off remote backup asynchronously (non-blocking)
                BackupClient.addToPersistQueue(BackupClient.Label.CHANNEL_MONITOR(channelId=channelId), serialized) { error ->
                    if (error != null) {
                        LdkEventEmitter.send(EventTypes.native_log, "Warning. Remote backup failed for new channel (${channelId}), but channel was persisted locally. $error")
                    }
                }
                
                return ChannelMonitorUpdateStatus.LDKChannelMonitorUpdateStatus_Completed
            }

            // For updates: try remote backup first, then write locally on success (original behavior)
            BackupClient.addToPersistQueue(BackupClient.Label.CHANNEL_MONITOR(channelId=channelId), serialized) { error ->
                if (error != null) {
                    LdkEventEmitter.send(EventTypes.native_log, "Failed to persist channel (${channelId}) to remote backup: $error")
                    return@addToPersistQueue
                }

                try {
                    file.writeBytes(serialized)
                } catch (e: Exception) {
                    //If this fails we can't do much but LDK will retry on startup
                    LdkEventEmitter.send(EventTypes.native_log, "Failed to locally persist channel (${channelId}) to disk")
                    return@addToPersistQueue
                }

                //Update chain monitor with successful persist on main thread
                LdkEventEmitter.getReactContext()?.runOnUiQueueThread {
                    val res = LdkModule.chainMonitor?.channel_monitor_updated(channelFundingOutpoint, data._latest_update_id)
                    if (res == null || !res.is_ok) {
                        LdkEventEmitter.send(EventTypes.native_log, "Failed to update chain monitor with persisted channel (${channelId})")
                    } else {
                        LdkEventEmitter.send(EventTypes.native_log, "Persisted channel (${channelId}) to disk")
                    }
                }
            }

            return ChannelMonitorUpdateStatus.LDKChannelMonitorUpdateStatus_InProgress
        } catch (e: Exception) {
            return ChannelMonitorUpdateStatus.LDKChannelMonitorUpdateStatus_UnrecoverableError
        }
    }

    var persister = Persist.new_impl(object : PersistInterface {
        override fun persist_new_channel(channelFundingOutpoint: OutPoint, data: ChannelMonitor): ChannelMonitorUpdateStatus {
            return handleChannel(channelFundingOutpoint, data)
        }

        override fun update_persisted_channel(channelFundingOutpoint: OutPoint, update: ChannelMonitorUpdate?, data: ChannelMonitor): ChannelMonitorUpdateStatus {
            return handleChannel(channelFundingOutpoint, data)
        }

        override fun archive_persisted_channel(p0: OutPoint?) {
            TODO("Not yet implemented")
        }
    })
}