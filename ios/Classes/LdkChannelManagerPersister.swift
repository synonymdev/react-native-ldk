//
//  LdkChannelManagerPersister.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LDKFramework

class LdkChannelManagerPersister: Persister, ExtendedChannelManagerPersister {
    override func free() {
        //TODO find out what this is for
    }
    
    func handle_event(event: Event) {
        //TODO pass back all relevent info to RN
        let body = [
            "event": "TODO implement handle_event correctly"
        ]
        
        // https://github.com/lightningdevkit/ldk-sample/blob/c0a722430b8fbcb30310d64487a32aae839da3e8/src/main.rs#L600
        
        print("TODO handle_event")
        
        LdkEventEmitter.shared.send(withEvent: .channel_manager_event, body: body)
    }
    
    override func persist_manager(channel_manager: ChannelManager) -> Result_NoneErrorZ {
        LdkEventEmitter.shared.send(withEvent: .persist_manager, body: ["channel_manager": Data(channel_manager.write()).hexEncodedString()])
        
        return Result_NoneErrorZ.ok()
    }
    
    override func persist_graph(network_graph: NetworkGraph) -> Result_NoneErrorZ {
        //TODO persist and then load in initNetworkGraph instead of passing genesis hash each time
        
        print("**TODO persist graph \(Data(network_graph.write()).hexEncodedString())")
        
        return Result_NoneErrorZ.ok()
    }
}
