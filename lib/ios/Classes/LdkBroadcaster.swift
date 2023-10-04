//
//  LdkBroardcaster.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkBroadcaster: BroadcasterInterface {    
    override func broadcastTransactions(txs: [[UInt8]]) {
        txs.forEach { tx in
            LdkEventEmitter.shared.send(withEvent: .broadcast_transaction, body: ["tx": Data(tx).hexEncodedString()])
        }
    }
}
