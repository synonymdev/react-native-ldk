//
//  LdkLogger.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

fileprivate func levelString(_ level: Level) -> String {
    switch level {
    case .Gossip:
        return "GOSSIP"
    case .Trace:
        return "TRACE"
    case .Debug:
        return "DEBUG"
    case .Info:
        return "INFO"
    case .Warn:
        return "WARN"
    case .Error:
        return "ERROR"
    default:
        return "LEVEL \(level)"
    }
}

class LdkLogger: LightningDevKit.Bindings.Logger {
    var activeLevels: [String: Bool] = [:]
    
    override func log(record: Record) {
        let level = levelString(record.getLevel())
        
        //Only when the JS code has set the log level to active
        if activeLevels[level] == true {
            let line = "\(level) (LDK): \(record.getArgs()) (\(record.getModulePath()) \(record.getLine()))"
            LdkEventEmitter.shared.send(withEvent: .ldk_log, body: line)
            Logfile.log.write(line)
        }
    }
    
    func setLevel(level: String, active: Bool) {
        self.activeLevels[level] = active
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Log level \(level) set to \(active)")
    }
}

class Logfile: TextOutputStream {
    var logfile: URL?
    
    func setFilePath(_ file: URL) {
        logfile = file
    }
    
    func write(_ str: String) {
        guard let logfile = logfile else {
            return
        }
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        let line = "\(dateFormatter.string(from: Date())) \(str)\n"
        
        if let handle = try? FileHandle(forWritingTo: logfile) {
            handle.seekToEndOfFile()
            handle.write(line.data(using: .utf8)!)
            handle.closeFile()
        } else {
            try? line.data(using: .utf8)?.write(to: logfile)
        }
    }
    static var log = Logfile()
    private init() {}
}
