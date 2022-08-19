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
    
    override func persist_new_channel(channel_id: OutPoint, data: ChannelMonitor, update_id: MonitorUpdateId) -> Result_NoneChannelMonitorUpdateErrZ {
        LdkEventEmitter.shared.send(
            withEvent: .persist_new_channel,
            body: [
                "id": Data(channel_id.write()).hexEncodedString(),
                "data": Data(data.write()).hexEncodedString()
            ]
        )
                                                               
        return Result_NoneChannelMonitorUpdateErrZ.ok()
    }
    
    override func update_persisted_channel(channel_id: OutPoint, update: ChannelMonitorUpdate, data: ChannelMonitor, update_id: MonitorUpdateId) -> Result_NoneChannelMonitorUpdateErrZ {
        LdkEventEmitter.shared.send(
            withEvent: .update_persisted_channel,
            body: [
                "id": Data(channel_id.write()).hexEncodedString(),
                "data": Data(data.write()).hexEncodedString()
            ]
        )

        return Result_NoneChannelMonitorUpdateErrZ.ok()
    }
}
