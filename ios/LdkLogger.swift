//
//  LdkLogger.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LDKFramework

class LdkLogger: Logger {
    override func log(record: Record) {
        
        //TODO separate logs for:
//        LDKLevel_Info
//        LDKLevel_Warn
//        LDKLevel_Debug
//        LDKLevel_Error
//        LDKLevel_Trace
        
        let line = "LDK Log \(record.get_level()): \(record.get_args())"
        sendEvent(eventName: .log, eventBody: ["line" : line])
    }
}
