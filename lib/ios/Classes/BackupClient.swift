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
    
    static fileprivate func backupUrl(_ label: Label, _ method: Method) throws -> URL {
        guard let network = Self.network, let server = Self.server else {
            throw BackupError.requiresSetup
        }
        
        var urlString = "\(server)/\(method.rawValue)?label=\(label.string)&network=\(network)"
        
        if case let .channelMonitor(id) = label {
            urlString = "\(urlString)&id=\(id)"
        }
        
        return URL(string: urlString)!
    }

    fileprivate func encrypt(blob: Data) throws {
        guard let key = Self.encryptionKey else {
            throw BackupError.requiresSetup
        }
        
        let signature = HMAC<SHA256>.authenticationCode(for: blob, using: key)
    }
    
    //TODO multiple monitors
    //TODO authentication
    //TODO encryption with seed
    //TODO restore
    //TODO write to log file
    
    static func persist(_ label: Label, _ bytes: [UInt8]) throws {
        guard !skipRemoteBackup else {
            print("Skipping remote backup for \(label.string)")
            return
        }
        
        print("\n\n\n\n\n************************* BACKUP")
        let backupData = Data(bytes)
        print("Save bytes: ", backupData.count)
        
        var request = URLRequest(url: try backupUrl(label, .persist))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = backupData
        
        //Thread blocking, backups must be synchronous
        let semaphore = DispatchSemaphore(value: 0)
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            defer {
                semaphore.signal()
            }
            
            if let error = error {
                //TODO throw error
                print("BACKUP ERROR: ", error.localizedDescription)
                return
            }
            
            if let data = data {
                print(">>>>>>>>>><<<<<<<<<<<")

                let response = String(data: data, encoding: .utf8) ?? ""
                if response != "success" {
                    print("Remote persist success")
                    return;
                }
                
                print("TODO HANDLE ERROR: \(response)")
            }
        }
        
        task.resume()
        
        semaphore.wait()
        
        print("**************************\n\n\n")
    }

    static func retrieve(_ label: Label) throws -> Data {
        print("\n\n\n\n\n************************* RESTORE")
        
        var backup: Data?
        var request = URLRequest(url: try backupUrl(label, .retrieve))
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let semaphore = DispatchSemaphore(value: 0)
        
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            defer {
                semaphore.signal()
            }
            
            if let error = error {
                print("RESTORE ERROR: ", error.localizedDescription)
                return
            }
            
            if let data = data {
                print(">>>>>>>>>><<<<<<<<<<<")
                print("TODO HANDLE RESPONSE")
                print(data.hexEncodedString())
                backup = data
            }
        }
        
        task.resume()
        
        semaphore.wait()
        
        guard let backup else {
            //TODO make custom error to throw
            return Data()
        }
        
        print("**************************\n\n\n")
        return backup
    }
}
