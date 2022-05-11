//
//  LdkPersist.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LDKFramework

class LdkPersister: Persist {
    override func persist_new_channel(channel_id: OutPoint, data: ChannelMonitor, update_id: MonitorUpdateId) -> Result_NoneChannelMonitorUpdateErrZ {
        let idHex = Data(channel_id.write()).hexEncodedString()
        let data = Data(data.write()).hexEncodedString()
        sendEvent(eventName: .persist_new_channel, eventBody: ["id": idHex, "data": data])
                                                               
        return Result_NoneChannelMonitorUpdateErrZ.ok()
    }
    
    override func update_persisted_channel(channel_id: OutPoint, update: ChannelMonitorUpdate, data: ChannelMonitor, update_id: MonitorUpdateId) -> Result_NoneChannelMonitorUpdateErrZ {
        let idHex = Data(channel_id.write()).hexEncodedString()
        let data = Data(data.write()).hexEncodedString()
        sendEvent(eventName: .update_persisted_channel, eventBody: ["id": idHex, "data": data])
        
        return Result_NoneChannelMonitorUpdateErrZ.ok()
    }
}
