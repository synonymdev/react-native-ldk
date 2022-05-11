//
//  Helpers.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation

//TODO replicate in typescript and kotlin
enum LdkEventNames: String {
    case register_tx = "register_tx"
    case register_output = "register_output"
    case broadcast_transaction = "broadcast_transaction"
    case log = "log"
    case persist_manager = "persist_manager"
    case persist_new_channel = "persist_new_channel"
    case update_persisted_channel = "update_persisted_channel"
}

enum LdkErrors: String {
    case unknown_error = "unknown_error"
    case init_fee_estimator = "init_fee_estimator"
    case already_initialised = "already_initialised"
    case init_logger = "init_logger"
}

enum LdkCallbackResponses: String {
    case fee_estimator_initialised = "fee_estimator_initialised"
    case fees_updated = "fees_updated"
    case logger_initialised = "logger_initialised"
    case log_level_updated = "log_level_updated"
}

func handleResolve(_ resolve: RCTPromiseResolveBlock, _ res: LdkCallbackResponses) {
    //TODO log
    resolve(res.rawValue)
}

func handleReject(_ reject: RCTPromiseRejectBlock, _ error: LdkErrors) {
    //TODO log
    reject(error.rawValue, error.rawValue, NSError(domain: error.rawValue, code: error.hashValue))
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


extension Ldk {
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
