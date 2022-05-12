//
//  LdkLogger.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LDKFramework

class LdkLogger: Logger {
    var activeLevels: [UInt32: Bool] = [:]
  
    override func log(record: Record) {
        let level = record.get_level().rawValue
        
        //Only when the JS code has set the log level to active
        if activeLevels[level] == true {
            let line = "LDK: \(record.get_args())"
            LdkEventEmitter.shared.send(withEvent: .ldk_log, body: line)
        }
    }
    
    func setLevel(level: UInt32, active: Bool) {
        self.activeLevels[level] = active
        
        LdkEventEmitter.shared.send(withEvent: .swift_log, body: "Log level \(level) set to \(active)")
    }
}
