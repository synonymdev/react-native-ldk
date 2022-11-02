//
//  LdkPersist.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkPersister: Persist {
    override func free() {
        //TODO find out what this is for
    }
    
    private func handleChannel(_ channel_id: OutPoint, _ data: ChannelMonitor) -> LDKChannelMonitorUpdateStatus {
        let channelId = Data(channel_id.to_channel_id()).hexEncodedString()
        let body = [
            "channel_id": channelId,
            "counterparty_node_id": Data(data.get_counterparty_node_id()).hexEncodedString()
        ]
        
        do {
            guard let channelStoragePath = Ldk.channelStoragePath?.appendingPathComponent("\(channelId).bin") else {
                throw "Channel storage path not set"
            }
            
            let isNew = !FileManager().fileExists(atPath: channelStoragePath.path)
            
            try Data(data.write()).write(to: channelStoragePath)
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted channel (\(channelId)) to disk")
            LdkEventEmitter.shared.send(withEvent: .backup, body: "")
            
            if isNew {
                LdkEventEmitter.shared.send(
                    withEvent: .new_channel,
                    body: body
                )
            }
            
            return LDKChannelMonitorUpdateStatus_Completed
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist channel (\(channelId)) to disk Error \(error.localizedDescription).")
            LdkEventEmitter.shared.send(
                withEvent: .emergency_force_close_channel,
                body: body
            )

            return LDKChannelMonitorUpdateStatus_PermanentFailure
        }
    }
    
    override func persist_new_channel(channel_id: Bindings.OutPoint, data: Bindings.ChannelMonitor, update_id: Bindings.MonitorUpdateId) -> LDKChannelMonitorUpdateStatus {
        return handleChannel(channel_id, data)
    }
    
    override func update_persisted_channel(channel_id: Bindings.OutPoint, update: Bindings.ChannelMonitorUpdate, data: Bindings.ChannelMonitor, update_id: Bindings.MonitorUpdateId) -> LDKChannelMonitorUpdateStatus {
        return handleChannel(channel_id, data)
    }
}
