//
//  LdkPersist.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkPersister: Persist {
    private func handleChannel(_ channelFundingOutpoint: Bindings.OutPoint, _ data: ChannelMonitor, _ updateId: Bindings.MonitorUpdateId) -> ChannelMonitorUpdateStatus {
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
            
            //If we're not remotely backing up no need to update status later
            if BackupClient.skipRemoteBackup {
                try Data(data.write()).write(to: channelStoragePath)
                if isNew {
                    LdkEventEmitter.shared.send(withEvent: .new_channel, body: body)
                }
                return ChannelMonitorUpdateStatus.Completed
            }
                         
            BackupClient.addToPersistQueue(.channelMonitor(id: channelIdHex), data.write()) { error in
                if let error {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed persist channel on remote server (\(channelIdHex)). \(error.localizedDescription)")
                    return
                }
                
                //Callback for when the persist queue queue entry is processed
                do {
                    try Data(data.write()).write(to: channelStoragePath)
                } catch {
                    //If this fails we can't do much but LDK will retry on startup
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to locally persist channel (\(channelIdHex)). \(error.localizedDescription)")
                    return
                }
                                
                //Update chainmonitor with successful persist
                let res = Ldk.chainMonitor?.channelMonitorUpdated(fundingTxo: channelFundingOutpoint, completedUpdateId: updateId)
                if let error = res?.getError() {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to update chain monitor for channel (\(channelIdHex)) Error \(error.getValueType()).")
                } else {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted channel \(channelIdHex). Update ID: \(updateId.hash())")
                    if isNew {
                        LdkEventEmitter.shared.send(withEvent: .new_channel, body: body)
                    }
                }
            }
            
            return ChannelMonitorUpdateStatus.InProgress
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist channel (\(channelIdHex)) to disk Error \(error.localizedDescription).")
            return ChannelMonitorUpdateStatus.UnrecoverableError
        }
    }
    
    override func persistNewChannel(channelFundingOutpoint: Bindings.OutPoint, data: Bindings.ChannelMonitor, updateId: Bindings.MonitorUpdateId) -> Bindings.ChannelMonitorUpdateStatus {
        return handleChannel(channelFundingOutpoint, data, updateId)
    }
    
    override func updatePersistedChannel(channelFundingOutpoint: Bindings.OutPoint, update: Bindings.ChannelMonitorUpdate, data: Bindings.ChannelMonitor, updateId: Bindings.MonitorUpdateId) -> Bindings.ChannelMonitorUpdateStatus {
        return handleChannel(channelFundingOutpoint, data, updateId)
    }
}
