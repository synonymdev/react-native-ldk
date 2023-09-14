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

struct CompleteBackup {
    let files: [String: Data]
    let channelFiles: [String: Data]
}

class BackupClient {
    private static let version = "v1"
    
    enum Label {
        case ping
        case channelManager
        case channelMonitor(id: String)
        case misc(fileName: String)
        
        var string: String {
            switch self {
            case .ping:
                return "ping"
            case .channelManager:
                return "channel_manager"
            case .channelMonitor:
                return "channel_monitor"
            case .misc(let fileName): //Tx history, watch txs, etc
                return fileName
                    .replacingOccurrences(of: ".json", with: "")
                    .replacingOccurrences(of: ".bin", with: "")
            }
        }
    }
    
    enum Method: String {
        case persist = "persist"
        case retrieve = "retrieve"
        case list = "list"
    }
    
    static var skipRemoteBackup = true //Allow dev to opt out (for development), will not throw error when attempting to persist
    
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
        
        print("ENCRYPTION KEY \(Data(seed).hexEncodedString())")
        
        Self.token = token
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "BackupClient setup for synchronous remote persistence. Server: \(server)")
    }
    
    static private func backupUrl(_ method: Method, _ label: Label? = nil) throws -> URL {
        guard let network = Self.network, let server = Self.server else {
            throw BackupError.requiresSetup
        }
        
        var urlString = "\(server)/\(version)/\(method.rawValue)?network=\(network)"
        
        if let label {
            urlString = "\(urlString)&label=\(label.string)"
        }
        
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
                
        //Remove appended 12 bytes nonce and 16 byte trailing tag
        let encryptedData: Data = {
            var bytes = blob.subdata(in: 12..<blob.count)
            let removalRange = bytes.count - 16 ..< bytes.count
            bytes.removeSubrange(removalRange)
            return bytes
        }()
        let nonce = blob.prefix(12)
        let tag = blob.suffix(16)
        
        do {
            let sealedBox = try AES.GCM.SealedBox(nonce: .init(data: nonce), ciphertext: encryptedData, tag: tag)
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
    
    //TODO authentication
    
    static func persist(_ label: Label, _ bytes: [UInt8]) throws {
        guard !skipRemoteBackup else {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Skipping remote backup for \(label.string)")
            return
        }
        
        let encryptedBackup = try encrypt(Data(bytes))
        
        var request = URLRequest(url: try backupUrl(.persist, label))
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
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote persist failed for \(label.string). \(error.localizedDescription)")
            LdkEventEmitter.shared.send(withEvent: .backup_sync_persist_error, body: error.localizedDescription)
            throw error
        }
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote persist success for \(label.string)")
    }
    
    static func retrieve(_ label: Label) throws -> Data {
        var encryptedBackup: Data?
        var request = URLRequest(url: try backupUrl(.retrieve, label))
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
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote retrieve failed for \(label.string). \(error.localizedDescription)")
            throw error
        }
        
        guard let encryptedBackup else {
            throw BackupError.missingBackup
        }
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote retrieve success for \(label.string).")
        return try decrypt(encryptedBackup)
    }
    
    static func retrieveCompleteBackup() throws -> CompleteBackup {
        struct ListFilesResponse: Codable {
            let list: [String]
            let channel_monitors: [String]
        }
        
        var backedUpFilenames: ListFilesResponse?
        
        var request = URLRequest(url: try backupUrl(.list))
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
                if statusCode == 200, let data {
                    do {
                        backedUpFilenames = try JSONDecoder().decode(ListFilesResponse.self, from: data)
                        return
                    } catch {
                        requestError = BackupError.invalidServerResponse(0)
                        return
                    }
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
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote list files failed. \(error.localizedDescription)")
            throw error
        }
        
        guard let backedUpFilenames else {
            throw BackupError.missingBackup
        }
        
        
        var allFiles: [String: Data] = [:]
        var channelFiles: [String: Data] = [:]

        //Fetch each file's data
        for fileName in backedUpFilenames.list {
            guard fileName != "\(Label.ping.string).bin" else {
                continue
            }
            
            allFiles[fileName] = try retrieve(.misc(fileName: fileName))
        }
        
        for channelFileName in backedUpFilenames.channel_monitors {
            let id = channelFileName.replacingOccurrences(of: ".bin", with: "")
            channelFiles[channelFileName] = try retrieve(.channelMonitor(id: id))
        }
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote list files success.")
        
        return CompleteBackup(files: allFiles, channelFiles: channelFiles)
    }
}
