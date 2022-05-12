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
        //TODO pass back all relevent info to RN
        let body = [
            "event": "TODO"
        ]
        
        LdkEventEmitter.shared.send(withEvent: .channel_manager_event, body: body)
    }
    
    override func persist_manager(channel_manager: ChannelManager) -> Result_NoneErrorZ {
        LdkEventEmitter.shared.send(withEvent: .persist_manager, body: ["channel_manager": Data(channel_manager.write()).hexEncodedString()])
        
        return Result_NoneErrorZ.ok()
    }
    
    override func persist_graph(network_graph: NetworkGraph) -> Result_NoneErrorZ {
        
        return Result_NoneErrorZ.ok()
    }
}
