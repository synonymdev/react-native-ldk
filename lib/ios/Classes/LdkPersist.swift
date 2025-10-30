//
//  LdkPersist.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkPersister: Persist {
    private func handleChannel(_ channelFundingOutpoint: Bindings.OutPoint, _ data: ChannelMonitor) -> ChannelMonitorUpdateStatus {
        guard let channelId = data.channelId().getA() else {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Missing channelFundingOutpoint.getTxid(). Cannot persist channel")
            return .UnrecoverableError
        }
        
        let channelIdHex = Data(channelId).hexEncodedString()
        let body = [
            "channel_id": channelIdHex,
            "counterparty_node_id": Data(data.getCounterpartyNodeId() ?? []).hexEncodedString()
        ]
        
        do {
            guard let channelStoragePath = Ldk.channelStoragePath?.appendingPathComponent("\(channelIdHex).bin") else {
                throw "Channel storage path not set"
            }
            
            let isNew = !FileManager().fileExists(atPath: channelStoragePath.path)
            let serialized = Data(data.write())
            
            // If we're not remotely backing up no need to update status later
            if BackupClient.skipRemoteBackup {
                try serialized.write(to: channelStoragePath)
                if isNew {
                    LdkEventEmitter.shared.send(withEvent: .new_channel, body: body)
                }
                return ChannelMonitorUpdateStatus.Completed
            }
            
            // For new channels: write locally first to prevent loss if app is killed during backup
            // Then try remote backup asynchronously
            if isNew {
                try serialized.write(to: channelStoragePath)
                
                // Notify chain monitor on main thread
                DispatchQueue.main.async {
                    let res = Ldk.chainMonitor?.channelMonitorUpdated(
                        fundingTxo: channelFundingOutpoint,
                        completedUpdateId: data.getLatestUpdateId()
                    )
                    if let error = res?.getError() {
                        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to update chain monitor for channel (\(channelIdHex)) Error \(error.getValueType()).")
                    } else {
                        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted channel \(channelIdHex). Update ID: \(data.getLatestUpdateId())")
                        LdkEventEmitter.shared.send(withEvent: .new_channel, body: body)
                    }
                }
                
                // Kick off remote backup asynchronously (non-blocking)
                BackupClient.addToPersistQueue(.channelMonitor(id: channelIdHex), [UInt8](serialized)) { error in
                    if let error {
                        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Warning. Remote backup failed for new channel (\(channelIdHex)), but channel was persisted locally. \(error.localizedDescription)")
                    }
                }
                
                return ChannelMonitorUpdateStatus.Completed
            }
            
            // For updates: try remote backup first, then write locally on success (original behavior)
            BackupClient.addToPersistQueue(.channelMonitor(id: channelIdHex), [UInt8](serialized)) { error in
                if let error {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed persist channel on remote server (\(channelIdHex)). \(error.localizedDescription)")
                    return
                }
                
                // Callback for when the persist queue entry is processed
                do {
                    try serialized.write(to: channelStoragePath)
                } catch {
                    // If this fails we can't do much but LDK will retry on startup
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to locally persist channel (\(channelIdHex)). \(error.localizedDescription)")
                    return
                }
                                
                // Update chainmonitor with successful persist on main thread
                DispatchQueue.main.async {
                    let res = Ldk.chainMonitor?.channelMonitorUpdated(fundingTxo: channelFundingOutpoint, completedUpdateId: data.getLatestUpdateId())
                    if let error = res?.getError() {
                        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to update chain monitor for channel (\(channelIdHex)) Error \(error.getValueType()).")
                    } else {
                        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted channel \(channelIdHex). Update ID: \(data.getLatestUpdateId())")
                    }
                }
            }
            
            return ChannelMonitorUpdateStatus.InProgress
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist channel (\(channelIdHex)) to disk Error \(error.localizedDescription).")
            return ChannelMonitorUpdateStatus.UnrecoverableError
        }
    }

    override func persistNewChannel(channelFundingOutpoint: Bindings.OutPoint, monitor: Bindings.ChannelMonitor) -> Bindings.ChannelMonitorUpdateStatus {
        return handleChannel(channelFundingOutpoint, monitor)
    }
    
    override func updatePersistedChannel(channelFundingOutpoint: Bindings.OutPoint, monitorUpdate: Bindings.ChannelMonitorUpdate, monitor: Bindings.ChannelMonitor) -> Bindings.ChannelMonitorUpdateStatus {
        return handleChannel(channelFundingOutpoint, monitor)
    }
}
