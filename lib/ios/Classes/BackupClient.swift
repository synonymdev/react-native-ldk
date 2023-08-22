//
//  Backups.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2023/08/21.
//

import Foundation
import LightningDevKit
import CryptoKit

class BackupClient {
    enum BackupError: Error {
        case invalidNetwork
        case requiresSetup

        var localizedDescription: String {
            switch self {
                case .invalidNetwork:
                    return NSLocalizedString("Invalid network passed to BackupClient setup", comment: "")
                case .requiresSetup:
                    return NSLocalizedString("BackupClient requires setup", comment: "")
            }
        }
    }
    
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
    static var server: String?
    static var network: String?
    static var encryptionKey: SymmetricKey?

    static func setup(seed: [UInt8], network: String, server: String) throws {
        guard getNetwork(network) != nil else {
            throw BackupError.invalidNetwork
        }

        Self.network = network
        Self.server = server
        Self.encryptionKey = SymmetricKey(data: seed)
    }
    
    static private func backupUrl(_ label: Label, _ method: Method) throws -> URL {
        guard let network = Self.network, let server = Self.server else {
            throw BackupError.requiresSetup
        }
        
        var urlString = "\(server)/\(method.rawValue)?label=\(label.string)&network=\(network)"
        
        if case let .channelMonitor(id) = label {
            urlString = "\(urlString)&id=\(id)"
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

        let sealedBox = try AES.GCM.SealedBox(combined: blob)
        let decryptedData = try AES.GCM.open(sealedBox, using: key)
        return decryptedData
    }
    
    //TODO multiple monitors
    //TODO authentication
    //TODO restore
    //TODO write to log file
    
    static func persist(_ label: Label, _ bytes: [UInt8]) throws {
        guard !skipRemoteBackup else {
            print("Skipping remote backup for \(label.string)")
            return
        }
        
        let encryptedBackup = try encrypt(Data(bytes))
        
        var request = URLRequest(url: try backupUrl(label, .persist))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = encryptedBackup
        
        var requestError: Error?
        //Thread blocking, backups must be synchronous
        let semaphore = DispatchSemaphore(value: 0)
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            defer {
                semaphore.signal()
            }
            
            requestError = error
            
            if let data = data {
                let response = String(data: data, encoding: .utf8) ?? ""
                if response == "success" {
                    print("Remote persist success")
                    return;
                }
            }
        }
        
        task.resume()
        semaphore.wait()
        
        if let error = requestError {
            throw error
        }
    }

    static func retrieve(_ label: Label) throws -> Data {
        var encryptedBackup: Data?
        var request = URLRequest(url: try backupUrl(label, .retrieve))
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        var requestError: Error?
        
        let semaphore = DispatchSemaphore(value: 0)
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            defer {
                semaphore.signal()
            }
            
            requestError = error
            encryptedBackup = data
        }
        
        task.resume()
        
        semaphore.wait()
        
        if let error = requestError {
            throw error
        }
        
        guard let encryptedBackup else {
            //TODO make custom error to throw
            return Data()
        }
                
        let backup = try decrypt(encryptedBackup)
        
        return backup
    }
}
