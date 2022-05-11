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
    case unknown_method = "unknown_method"
    case init_fee_estimator = "init_fee_estimator"
    case already_init = "already_init"
    case init_logger = "init_logger"
    case init_broadcaster = "init_broadcaster"
    case init_persister = "init_persister"
    case init_filter = "init_filter"
    case invalid_seed_hex = "invalid_seed_hex"
}

enum LdkCallbackResponses: String {
    case fee_estimator_init_success = "fee_estimator_init_success"
    case fees_updated = "fees_updated"
    case logger_init_success = "logger_init_success"
    case log_level_updated = "log_level_updated"
    case broadcaster_init_success = "broadcaster_init_success"
    case persister_init_success = "persister_init_success"
    case chain_monitor_init_success = "chain_monitor_init_success"
    case keys_manager_init_success = "keys_manager_init_success"
    case channel_manager_init_success = "channel_manager_init_success"
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

extension StringProtocol {
    var hexaData: Data { .init(hexa) }
    var hexaBytes: [UInt8] { .init(hexa) }
    private var hexa: UnfoldSequence<UInt8, Index> {
        sequence(state: startIndex) { startIndex in
            guard startIndex < self.endIndex else { return nil }
            let endIndex = self.index(startIndex, offsetBy: 2, limitedBy: self.endIndex) ?? self.endIndex
            defer { startIndex = endIndex }
            return UInt8(self[startIndex..<endIndex], radix: 16)
        }
    }
}

extension Ldk {
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
