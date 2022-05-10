//
//  LdkBroardcaster.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LDKFramework

class LdkBroadcaster: BroadcasterInterface {
    override func broadcast_transaction(tx: [UInt8]) {
        sendEvent(eventName: .broadcast_transaction, eventBody: ["txhex": Data(tx).hexEncodedString()])
    }
}
