//
//  Helpers.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation

//TODO replicate in typescript
enum LdkEventNames: String {
    case register_tx = "register_tx"
    case register_output = "register_output"
    case broadcast_transaction = "broadcast_transaction"
    case log = "log"
    case persist_manager = "persist_manager"
    case persist_new_channel = "persist_new_channel"
    case update_persisted_channel = "update_persisted_channel"
}

func sendEvent(eventName: LdkEventNames, eventBody: [String: String]) {
//    ReactEventEmitter.sharedInstance()?.sendEvent(withName: eventName, body: eventBody)
    print("\(eventName)")
    print(eventBody)
}

extension Data {
    struct HexEncodingOptions: OptionSet {
        let rawValue: Int
        static let upperCase = HexEncodingOptions(rawValue: 1 << 0)
    }

    func hexEncodedString(options: HexEncodingOptions = []) -> String {
        let format = options.contains(.upperCase) ? "%02hhX" : "%02hhx"
        return self.map { String(format: format, $0) }.joined()
    }
}
