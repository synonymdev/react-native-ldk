//
//  LdkPersist.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkPersister: Persist {
    private func handleChannel(_ channelId: OutPoint, _ data: ChannelMonitor) -> ChannelMonitorUpdateStatus {
        let channelId = Data(channelId.toChannelId()).hexEncodedString()
        let body = [
            "channel_id": channelId,
            "counterparty_node_id": Data(data.getCounterpartyNodeId() ?? []).hexEncodedString()
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
            
            return ChannelMonitorUpdateStatus.Completed
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist channel (\(channelId)) to disk Error \(error.localizedDescription).")
            LdkEventEmitter.shared.send(
                withEvent: .emergency_force_close_channel,
                body: body
            )

            return ChannelMonitorUpdateStatus.PermanentFailure
        }
    }
    
    override func persistNewChannel(channelId: Bindings.OutPoint, data: Bindings.ChannelMonitor, updateId: Bindings.MonitorUpdateId) -> Bindings.ChannelMonitorUpdateStatus {
        return handleChannel(channelId, data)
    }
    
    override func updatePersistedChannel(channelId: Bindings.OutPoint, update: Bindings.ChannelMonitorUpdate, data: Bindings.ChannelMonitor, updateId: Bindings.MonitorUpdateId) -> Bindings.ChannelMonitorUpdateStatus {
        return handleChannel(channelId, data)
    }
}
