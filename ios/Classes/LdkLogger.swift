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
            let line = "\(record.get_args())"
            sendEvent(eventName: .log, eventBody: ["line" : line, "level": "\(level)" ])
        }
        
    }
    
    func setLevel(level: UInt32, active: Bool) {
        print("SETTING \(level) as \(active)")
        self.activeLevels[level] = active
    }
}
