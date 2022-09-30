package com.reactnativeldk.classes

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.reactnativeldk.*
import org.ldk.structs.*
import org.ldk.structs.Persist.PersistInterface
import java.io.File

class LdkPersister {
    fun saveChannel(id: OutPoint, data: ChannelMonitor): Result_NoneChannelMonitorUpdateErrZ {
        if (LdkModule.channelStoragePath != "") {
            File(LdkModule.channelStoragePath + "/" + id.to_channel_id().hexEncodedString() + ".bin").writeBytes(data.write())
        }
        return Result_NoneChannelMonitorUpdateErrZ.ok();
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