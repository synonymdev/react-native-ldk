//
//  LdkChannelManagerPersister.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LDKFramework

class LdkChannelManagerPersister: Persister, ExtendedChannelManagerPersister {
    func handle_event(event: Event) {
        //TODO handle in swift or RN?
    }
    
    override func persist_manager(channel_manager: ChannelManager) -> Result_NoneErrorZ {
        let channelManagerHex = Data(channel_manager.write()).hexEncodedString()
        sendEvent(eventName: .persist_manager, eventBody: ["channel_manager": channelManagerHex])
        return Result_NoneErrorZ.ok()
    }
    
    override func persist_graph(network_graph: NetworkGraph) -> Result_NoneErrorZ {
        
        return Result_NoneErrorZ.ok()
    }
}
