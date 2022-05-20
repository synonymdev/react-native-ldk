//
//  Helpers.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation

func handleResolve(_ resolve: RCTPromiseResolveBlock, _ res: LdkCallbackResponses) {
    LdkEventEmitter.shared.send(withEvent: .swift_log, body: "Success: \(res.rawValue)")
    resolve(res.rawValue)
}

func handleReject(_ reject: RCTPromiseRejectBlock, _ ldkError: LdkErrors, _ error: Error? = nil, _ message: String? = nil) {
    if let error = error as? NSError {
        LdkEventEmitter.shared.send(withEvent: .swift_log, body: "Error: \(error.localizedDescription). Message: '\(message ?? "")'")
        reject(ldkError.rawValue, message ?? error.localizedDescription, error)
        return
    }
    
    LdkEventEmitter.shared.send(withEvent: .swift_log, body: "Error: \(ldkError.rawValue). Message: '\(message ?? "")'")
    reject(ldkError.rawValue, message ?? ldkError.rawValue, NSError(domain: ldkError.rawValue, code: ldkError.hashValue))
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

//MARK: Module can be initialised on main thread as LDK handles all it's own tasks on background threads  (https://reactnative.dev/docs/native-modules-ios#implementing--requiresmainqueuesetup)
extension Ldk {
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

extension LdkEventEmitter {
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
