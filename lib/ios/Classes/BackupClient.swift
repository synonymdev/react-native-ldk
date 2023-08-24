//
//  Backups.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2023/08/21.
//

import Foundation
import LightningDevKit
import CryptoKit

enum BackupError: Error {
    case invalidNetwork
    case requiresSetup
    case missingBackup
    case invalidServerResponse(Int)
    case decryptFailed(String)
}

extension BackupError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .invalidNetwork:
            return NSLocalizedString("Invalid network passed to BackupClient setup", comment: "")
        case .requiresSetup:
            return NSLocalizedString("BackupClient requires setup", comment: "")
        case .missingBackup:
            return NSLocalizedString("Retrieve failed. Missing backup.", comment: "")
        case .invalidServerResponse(let code):
            return NSLocalizedString("Invalid backup server response (\(code))", comment: "")
        case .decryptFailed(let msg):
            return NSLocalizedString("Failed to decrypt backup payload. \(msg)", comment: "")
        }
    }
}

class BackupClient {
    enum Label {
        case channelManager
        case channelMonitor(id: String)
        
        var string: String {
            switch self {
            case .channelManager:
                return "channel-manager"
            case .channelMonitor:
                return "channel-monitor"
            }
        }
    }
    
    enum Method: String {
        case persist = "persist"
        case retrieve = "retrieve"
    }
    
    static var skipRemoteBackup = false //Allow dev to opt out (for development), will not throw error when attempting to persist
    
    static var network: String?
    static var server: String?
    static var token: String?
    static var encryptionKey: SymmetricKey?
    
    static var requiresSetup: Bool {
        return server == nil
    }
    
    static func setup(seed: [UInt8], network: String, server: String, token: String) throws {
        guard getNetwork(network) != nil else {
            throw BackupError.invalidNetwork
        }
        
        Self.network = network
        Self.server = server
        Self.encryptionKey = SymmetricKey(data: seed)
        Self.token = token
        
        Logfile.log.swiftLog("BackupClient setup for synchronous remote persistence. Server: \(server)")
    }
    
    static private func backupUrl(_ label: Label, _ method: Method) throws -> URL {
        guard let network = Self.network, let server = Self.server else {
            throw BackupError.requiresSetup
        }
        
        var urlString = "\(server)/\(method.rawValue)?label=\(label.string)&network=\(network)"
        
        if case let .channelMonitor(id) = label {
            urlString = "\(urlString)&channelId=\(id)"
        }
        
        return URL(string: urlString)!
    }
    
    private static func encrypt(_ blob: Data) throws -> Data {
        guard let key = Self.encryptionKey else {
            throw BackupError.requiresSetup
        }
        
        let sealedBox = try AES.GCM.seal(blob, using: key)
        return sealedBox.combined!
    }
    
    private static func decrypt(_ blob: Data) throws -> Data {
        guard let key = Self.encryptionKey else {
            throw BackupError.requiresSetup
        }
        
        do {
            let sealedBox = try AES.GCM.SealedBox(combined: blob)
            let decryptedData = try AES.GCM.open(sealedBox, using: key)
            return decryptedData
        } catch {
            if let ce = error as? CryptoKitError {
                throw BackupError.decryptFailed(ce.localizedDescription)
            } else {
                throw error
            }
        }
    }
    
    //TODO multiple monitors
    //TODO authentication
    //TODO restore
    //TODO write to log file
    
    static func persist(_ label: Label, _ bytes: [UInt8]) throws {
        guard !skipRemoteBackup else {
            Logfile.log.swiftLog("Skipping remote backup for \(label.string)")
            return
        }
        
        let encryptedBackup = try encrypt(Data(bytes))
        
        var request = URLRequest(url: try backupUrl(label, .persist))
        request.httpMethod = "POST"
        request.setValue("application/octet-stream", forHTTPHeaderField: "Content-Type")
        request.setValue(token, forHTTPHeaderField: "Authorization")
        request.httpBody = encryptedBackup
        
        var requestError: Error?
        //Thread blocking, backups must be synchronous
        let semaphore = DispatchSemaphore(value: 0)
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            defer {
                semaphore.signal()
            }
            
            if let httpURLResponse = response as? HTTPURLResponse {
                let statusCode = httpURLResponse.statusCode
                if statusCode == 200 {
                    return;
                } else {
                    requestError = BackupError.invalidServerResponse(httpURLResponse.statusCode)
                    return
                }
            } else {
                requestError = BackupError.invalidServerResponse(0)
            }
            
            requestError = error
        }
        
        task.resume()
        semaphore.wait()
        
        if let error = requestError {
            Logfile.log.swiftLog("Remote persist failed for \(label.string). \(error.localizedDescription)")
            LdkEventEmitter.shared.send(withEvent: .backup_sync_persist_error, body: error.localizedDescription)
            throw error
        }
        
        Logfile.log.swiftLog("Remote persist success for \(label.string)")
    }
    
    static func retrieve(_ label: Label) throws -> Data {
        var encryptedBackup: Data?
        var request = URLRequest(url: try backupUrl(label, .retrieve))
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(token, forHTTPHeaderField: "Authorization")
        
        var requestError: Error?
        let semaphore = DispatchSemaphore(value: 0)
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            defer {
                semaphore.signal()
            }
            
            if let httpURLResponse = response as? HTTPURLResponse {
                let statusCode = httpURLResponse.statusCode
                if statusCode == 200 {
                    encryptedBackup = data
                    return
                } else {
                    requestError = BackupError.invalidServerResponse(httpURLResponse.statusCode)
                    return
                }
            } else {
                requestError = BackupError.invalidServerResponse(0)
            }
        }
        
        task.resume()
        semaphore.wait()
        
        if let error = requestError {
            Logfile.log.swiftLog("Remote retrieve failed for \(label.string). \(error.localizedDescription)")
            throw error
        }
        
        guard let encryptedBackup else {
            throw BackupError.missingBackup
        }
        
        Logfile.log.swiftLog("Remote retrieve success for \(label.string).")
        return try decrypt(encryptedBackup)
    }
}
