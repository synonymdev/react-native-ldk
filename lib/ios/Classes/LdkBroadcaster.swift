//
//  LdkBroardcaster.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkBroadcaster: BroadcasterInterface {
    override func free() {
        //TODO find out what this is for
    }
    
    override func broadcast_transaction(tx: [UInt8]) {
        LdkEventEmitter.shared.send(withEvent: .broadcast_transaction, body: ["tx": Data(tx).hexEncodedString()])
    }
}
