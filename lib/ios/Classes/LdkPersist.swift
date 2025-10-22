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

            // Always write locally first
            let serialized = Data(data.write())
            try serialized.write(to: channelStoragePath)

            // Notify chain monitor on main thread to avoid threading issues
            DispatchQueue.main.async {
                let res = Ldk.chainMonitor?.channelMonitorUpdated(
                    fundingTxo: channelFundingOutpoint,
                    completedUpdateId: data.getLatestUpdateId()
                )
                if let error = res?.getError() {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to update chain monitor for channel (\(channelIdHex)) Error \(error.getValueType()).")
                } else {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted channel \(channelIdHex). Update ID: \(data.getLatestUpdateId())")
                    if isNew {
                        LdkEventEmitter.shared.send(withEvent: .new_channel, body: body)
                    }
                }
            }

            // Kick off remote backup asynchronously; log but never block/skip local persist
            if !BackupClient.skipRemoteBackup {
                BackupClient.addToPersistQueue(.channelMonitor(id: channelIdHex), [UInt8](serialized)) { error in
                    if let error {
                        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed persist channel on remote server (\(channelIdHex)). \(error.localizedDescription)")
                    }
                }
            }

            return ChannelMonitorUpdateStatus.Completed
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to locally persist channel (\(channelIdHex)). \(error.localizedDescription)")
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
