//
//  LdkPersist.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkPersister: Persist {
    private func handleChannel(_ channelId: OutPoint, _ data: ChannelMonitor, _ updateId: Bindings.MonitorUpdateId) -> ChannelMonitorUpdateStatus {
        let channelIdHex = Data(channelId.toChannelId()).hexEncodedString()
        let body = [
            "channel_id": channelIdHex,
            "counterparty_node_id": Data(data.getCounterpartyNodeId() ?? []).hexEncodedString()
        ]
        
        do {
            guard let channelStoragePath = Ldk.channelStoragePath?.appendingPathComponent("\(channelIdHex).bin") else {
                throw "Channel storage path not set"
            }
            
            let isNew = !FileManager().fileExists(atPath: channelStoragePath.path)
                        
            BackupClient.addToPersistQueue(.channelMonitor(id: channelIdHex), data.write()) {
                //Callback for when the persist queue queue entry is processed
                try! Data(data.write()).write(to: channelStoragePath)
                
                //Update chainmonitor with successful persist
                let res = Ldk.chainMonitor?.channelMonitorUpdated(fundingTxo: channelId, completedUpdateId: updateId)
                if let error = res?.getError() {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to update chain monitor for channel (\(channelIdHex)) Error \(error.getValueType()).")
                } else {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted channel \(channelIdHex). Update ID: \(updateId.hash())")
                    LdkEventEmitter.shared.send(withEvent: .backup, body: "") //TODO remove after old backup is deprecated
                }
            }
            
            if isNew {
                LdkEventEmitter.shared.send(
                    withEvent: .new_channel,
                    body: body
                )
            }
            
            return ChannelMonitorUpdateStatus.InProgress
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist channel (\(channelIdHex)) to disk Error \(error.localizedDescription).")
            return ChannelMonitorUpdateStatus.UnrecoverableError
        }
    }
    
    override func persistNewChannel(channelId: Bindings.OutPoint, data: Bindings.ChannelMonitor, updateId: Bindings.MonitorUpdateId) -> Bindings.ChannelMonitorUpdateStatus {
        return handleChannel(channelId, data, updateId)
    }
    
    override func updatePersistedChannel(channelId: Bindings.OutPoint, update: Bindings.ChannelMonitorUpdate, data: Bindings.ChannelMonitor, updateId: Bindings.MonitorUpdateId) -> Bindings.ChannelMonitorUpdateStatus {
        return handleChannel(channelId, data, updateId)
    }
}
