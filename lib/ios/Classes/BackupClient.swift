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
    case missingResponse
    case invalidServerResponse(String)
    case decryptFailed(String)
    case signingError
    case serverChallengeResponseFailed
    case checkError
}

extension BackupError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .invalidNetwork:
            return NSLocalizedString("Invalid network passed to BackupClient setup", comment: "")
        case .requiresSetup:
            return NSLocalizedString("BackupClient requires setup", comment: "")
        case .missingResponse:
            return NSLocalizedString("Request failed. Missing response from backup server.", comment: "")
        case .invalidServerResponse(let response):
            return NSLocalizedString("Invalid backup server response (\(response))", comment: "")
        case .decryptFailed(let msg):
            return NSLocalizedString("Failed to decrypt backup payload. \(msg)", comment: "")
        case .signingError:
            return NSLocalizedString("Signing backup error", comment: "")
        case .serverChallengeResponseFailed:
            return NSLocalizedString("Client failed to validate server challenge response. Indicates server error or potential man in the middle attack.", comment: "")
        case .checkError:
            return NSLocalizedString("Failed backup self check", comment: "")
        }
    }
}

struct CompleteBackup {
    let files: [String: Data]
    let channelFiles: [String: Data]
}

struct BackupRetrieveBearer: Codable {
    let bearer: String
    let expires: Int
}

struct ListFilesResponse: Codable {
    let list: [String]
    let channel_monitors: [String]
}

struct BackupFileState {
    var lastQueued: Date
    var lastPersisted: Date?
    var lastFailed: Date?
    var lastErrorMessage: String?
    
    var encoded: [String: Encodable] {
        [
            "lastQueued": (self.lastQueued.timeIntervalSince1970 * 1000).rounded(),
            "lastPersisted": self.lastPersisted != nil ? (self.lastPersisted!.timeIntervalSince1970 * 1000).rounded() : nil,
            "lastFailed": self.lastFailed != nil ? (self.lastFailed!.timeIntervalSince1970 * 1000).rounded() : nil,
            "lastErrorMessage": self.lastErrorMessage
        ]
    }
}

enum BackupStateUpdateType {
    case queued
    case success
    case fail(Error)
}

class BackupClient {
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
        
        var backupStateKey: String? {
            switch self {
            case .channelManager:
                return self.string
            case .channelMonitor(let id):
                return "\(self.string)_\(id)"
            case .misc(let fileName):
                return self.string
            default:
                return nil //Don't worry about the backup state event of these files
            }
        }
    }
    
    private enum Method: String {
        case persist = "persist"
        case retrieve = "retrieve"
        case list = "list"
        case authChallenge = "auth/challenge"
        case authResponse = "auth/response"
    }
    
    private static let version = "v1"
    private static let signedMessagePrefix = "react-native-ldk backup server auth:"
    
    private static let channelManagerBackupQueue = DispatchQueue(label: "ldk.backup.client.channel-manager", qos: .userInitiated)
    private static let channelMonitorBackupQueue = DispatchQueue(label: "ldk.backup.client.channel-monitor", qos: .userInitiated)
    private static let miscBackupQueue = DispatchQueue(label: "ldk.backup.client.misc", qos: .background)
    
    static var skipRemoteBackup = true //Allow dev to opt out (for development), will not throw error when attempting to persist
    
    private static var network: String?
    private static var server: String?
    private static var serverPubKey: String?
    private static var secretKey: [UInt8]?
    private static var encryptionKey: SymmetricKey? {
        if let secretKey {
            return SymmetricKey(data: secretKey)
        } else {
            return nil
        }
    }
    private static var pubKey: [UInt8]?
    private static var cachedBearer: BackupRetrieveBearer?
    
    static var requiresSetup: Bool {
        return server == nil
    }
    
    static var backupState: [String: BackupFileState] = [:]
    
    static func setup(secretKey: [UInt8], pubKey: [UInt8], network: String, server: String, serverPubKey: String) throws {
        guard getNetwork(network) != nil else {
            throw BackupError.invalidNetwork
        }
        Self.secretKey = secretKey
        Self.pubKey = pubKey
        Self.network = network
        Self.server = server
        Self.serverPubKey = serverPubKey
        Self.cachedBearer = nil
        
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
        
        //Only include files related to this library
        if method == .list {
            //TODO add this to android
            urlString = "\(urlString)&fileGroup=ldk"
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
    
    private static func hash(_ blob: Data) -> String {
        return SHA256.hash(data: blob).compactMap { String(format: "%02x", $0) }.joined()
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
    
    fileprivate static func persist(_ label: Label, _ bytes: [UInt8], retry: Int, onTryFail: (Error) -> Void) throws {
        var attempts: UInt32 = 0
        
        var persistError: Error?
        while attempts < retry {
            do {
                try persist(label, bytes)
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote persist success for \(label.string) after \(attempts+1) attempts")
                return
            } catch {
                persistError = error
                onTryFail(error)
                attempts += 1
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote persist failed for \(label.string) (\(attempts) attempts)")
                sleep(attempts) //Ease off with each attempt
            }
        }
        
        if let persistError {
            throw persistError
        }
    }
    
    fileprivate static func persist(_ label: Label, _ bytes: [UInt8]) throws {
        struct PersistResponse: Codable {
            let success: Bool
            let signature: String
        }
        
        guard !skipRemoteBackup else {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Skipping remote backup for \(label.string)")
            return
        }
        
        guard let pubKey, let serverPubKey else {
            throw BackupError.requiresSetup
        }
        
        let pubKeyHex = Data(pubKey).hexEncodedString()
        let encryptedBackup = try encrypt(Data(bytes))
        let signedHash = try sign(hash(encryptedBackup))
        
        //Hash of pubkey+timestamp
        let clientChallenge = hash("\(pubKeyHex)\(Date().timeIntervalSince1970)".data(using: .utf8)!)
        
        var request = URLRequest(url: try backupUrl(.persist, label))
        request.httpMethod = "POST"
        request.setValue("application/octet-stream", forHTTPHeaderField: "Content-Type")
        request.setValue(signedHash, forHTTPHeaderField: "Signed-Hash")
        request.setValue(pubKeyHex, forHTTPHeaderField: "Public-Key")
        request.setValue(clientChallenge, forHTTPHeaderField: "Challenge")
        
        request.httpBody = encryptedBackup
        
        var requestError: Error?
        var persistResponse: PersistResponse?
        //Thread blocking, backups must be synchronous
        let semaphore = DispatchSemaphore(value: 0)
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            defer {
                semaphore.signal()
            }
            
            if let httpURLResponse = response as? HTTPURLResponse {
                let statusCode = httpURLResponse.statusCode
                if statusCode == 200, let data {
                    do {
                        persistResponse = try JSONDecoder().decode(PersistResponse.self, from: data)
                        return
                    } catch {
                        requestError = BackupError.invalidServerResponse(String(data: data, encoding: .utf8)!)
                        return
                    }
                }  else {
                    requestError = BackupError.invalidServerResponse(String(httpURLResponse.statusCode))
                    return
                }
            } else {
                requestError = BackupError.missingResponse
            }
            
            requestError = error
        }
        
        task.resume()
        semaphore.wait()
        
        if let error = requestError {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote persist failed for \(label.string). \(error.localizedDescription)")
            throw error
        }
        
        guard let persistResponse else {
            throw BackupError.missingResponse
        }
        
        guard verifySignature(message: clientChallenge, signature: persistResponse.signature, pubKey: serverPubKey) else {
            throw BackupError.serverChallengeResponseFailed
        }
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote persist success for \(label.string)")
    }
    
    static func retrieve(_ label: Label) throws -> Data {
        let bearer = try authToken()
        
        var encryptedBackup: Data?
        var request = URLRequest(url: try backupUrl(.retrieve, label))
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(bearer, forHTTPHeaderField: "Authorization")
        
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
                    requestError = BackupError.invalidServerResponse(String(httpURLResponse.statusCode))
                    return
                }
            } else {
                requestError = BackupError.missingResponse
            }
        }
        
        task.resume()
        semaphore.wait()
        
        if let error = requestError {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote retrieve failed for \(label.string). \(error.localizedDescription)")
            throw error
        }
        
        guard let encryptedBackup else {
            throw BackupError.missingResponse
        }
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote retrieve success for \(label.string).")
        return try decrypt(encryptedBackup)
    }
    
    static func listFiles() throws -> ListFilesResponse {
        let bearer = try authToken()
        
        var backedUpFilenames: ListFilesResponse?
        
        var request = URLRequest(url: try backupUrl(.list))
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(bearer, forHTTPHeaderField: "Authorization")
        
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
                        requestError = BackupError.invalidServerResponse(String(data: data, encoding: .utf8)!)
                        return
                    }
                } else {
                    requestError = BackupError.invalidServerResponse(String(httpURLResponse.statusCode))
                    return
                }
            } else {
                requestError = BackupError.invalidServerResponse("")
            }
        }
        
        task.resume()
        semaphore.wait()
        
        if let error = requestError {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote list files failed. \(error.localizedDescription)")
            throw error
        }
        
        guard let backedUpFilenames else {
            throw BackupError.missingResponse
        }
        
        return backedUpFilenames
    }
    
    static func retrieveCompleteBackup() throws -> CompleteBackup {
        let backedUpFilenames = try listFiles()
        
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
    
    struct BackupExists {
        let exists: Bool
        let channelFiles: Int
    }
    
    static func selfCheck() throws {
        //Store a random encrypted string and retrieve it again to confirm the server is working
        let ping = "ping\(arc4random_uniform(99999))"
        try persist(.ping, [UInt8](Data(ping.utf8)))
        
        let checkPing = try BackupClient.retrieve(.ping)
        if let checkRes = String(data: checkPing, encoding: .utf8) {
            if checkRes != ping {
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Backup check failed to verify ping content.")
                throw BackupError.checkError
            }
        }
    }
    
    private static func sign(_ message: String) throws -> String {
        guard let secretKey else {
            throw BackupError.requiresSetup
        }
        
        let fullMessage = "\(signedMessagePrefix)\(message)"
        let signed = Bindings.swiftSign(msg: Array(fullMessage.utf8), sk: secretKey)
        if let _ = signed.getError() {
            throw BackupError.signingError
        }
        
        return signed.getValue()!
    }
    
    static func verifySignature(message: String, signature: String, pubKey: String) -> Bool {
        return Bindings.swiftVerify(
            msg: [UInt8]("\(signedMessagePrefix)\(message)".data(using: .utf8)!),
            sig: signature,
            pk: pubKey.hexaBytes
        )
    }
    
    private static func authToken() throws -> String {
        //Return cached token if still fresh
        if let cachedBearer {
            if Double(cachedBearer.expires) > Date().timeIntervalSince1970*1000 {
                return cachedBearer.bearer
            }
        }
        
        guard let pubKey else {
            throw BackupError.requiresSetup
        }
        
        //Fetch challenge with signed timestamp as nonce
        let pubKeyHex = Data(pubKey).hexEncodedString()
        let timestamp = String(Date().timeIntervalSince1970)
        
        let payload = [
            "timestamp": timestamp,
            "signature": try sign(timestamp)
        ]
        
        struct FetchChallengeResponse: Codable {
            let challenge: String
        }
        var fetchChallengeResponse: FetchChallengeResponse?
        
        var request = URLRequest(url: try backupUrl(.authChallenge))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(pubKeyHex, forHTTPHeaderField: "Public-Key")
        
        request.httpBody = try JSONSerialization.data(withJSONObject: payload)
        
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
                        fetchChallengeResponse = try JSONDecoder().decode(FetchChallengeResponse.self, from: data)
                        return
                    } catch {
                        requestError = BackupError.invalidServerResponse(String(data: data, encoding: .utf8)!)
                        return
                    }
                } else {
                    requestError = BackupError.invalidServerResponse(String(httpURLResponse.statusCode))
                    return
                }
            } else {
                requestError = BackupError.missingResponse
            }
        }
        
        task.resume()
        semaphore.wait()
        
        if let error = requestError {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Fetch server challenge failed. \(error.localizedDescription)")
            throw error
        }
        
        guard let fetchChallengeResponse else {
            throw BackupError.missingResponse
        }
        
        //Fetch bearer token
        let fetchPayload = [
            "signature": try sign(fetchChallengeResponse.challenge),
        ]
        var fetchRequest = URLRequest(url: try backupUrl(.authResponse))
        fetchRequest.httpMethod = "POST"
        fetchRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        fetchRequest.setValue(pubKeyHex, forHTTPHeaderField: "Public-Key")
        
        fetchRequest.httpBody = try JSONSerialization.data(withJSONObject: fetchPayload)
        
        var fetchRequestError: Error?
        var fetchBearerResponse: BackupRetrieveBearer?
        let fetchSemaphore = DispatchSemaphore(value: 0)
        let fetchTask = URLSession.shared.dataTask(with: fetchRequest) { (data, response, error) in
            defer {
                fetchSemaphore.signal()
            }
            
            if let httpURLResponse = response as? HTTPURLResponse {
                let statusCode = httpURLResponse.statusCode
                if statusCode == 200, let data {
                    do {
                        fetchBearerResponse = try JSONDecoder().decode(BackupRetrieveBearer.self, from: data)
                        return
                    } catch {
                        fetchRequestError = BackupError.invalidServerResponse(String(data: data, encoding: .utf8)!)
                        return
                    }
                } else {
                    fetchRequestError = BackupError.invalidServerResponse(String(httpURLResponse.statusCode))
                    return
                }
            } else {
                fetchRequestError = BackupError.missingResponse
            }
        }
        
        fetchTask.resume()
        fetchSemaphore.wait()
        
        if let error = fetchRequestError {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Fetch bearer token failed. \(error.localizedDescription)")
            throw error
        }
        
        guard let fetchBearerResponse else {
            throw BackupError.missingResponse
        }
        
        cachedBearer = fetchBearerResponse
        
        return fetchBearerResponse.bearer
    }
}

//Backup queue management
extension BackupClient {
    static func updateBackupState(_ label: Label, type: BackupStateUpdateType) {
        guard let key = label.backupStateKey else {
            return
        }
        
        DispatchQueue.main.async {
            backupState[key] = backupState[key] ?? .init(lastQueued: Date())
            
            switch type {
            case .queued:
                backupState[key]!.lastQueued = Date()
                backupState[key]!.lastFailed = nil
                backupState[key]!.lastErrorMessage = nil
            case .success:
                backupState[key]!.lastPersisted = Date()
                backupState[key]!.lastFailed = nil
                backupState[key]!.lastErrorMessage = nil
            case .fail(let error):
                backupState[key]!.lastFailed = Date()
                backupState[key]!.lastErrorMessage = error.localizedDescription
            }
            
            var body: [String: [String: Encodable]] = [:]
            backupState.keys.forEach { key in
                body[key] = backupState[key]!.encoded
            }
            
            debounce(interval: 0.25, key: "backup-state-event") {
                LdkEventEmitter.shared.send(withEvent: .backup_state_update, body: body)
            }()
        }
    }
    
    static func addToPersistQueue(_ label: Label, _ bytes: [UInt8], callback: ((Error?) -> Void)? = nil) {
        guard !skipRemoteBackup else {
            callback?(nil)
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Skipping remote backup queue append for \(label.string)")
            return
        }
        
        var backupQueue: DispatchQueue?
        
        updateBackupState(label, type: .queued)
        
        switch label {
        case .channelManager:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Adding channel manager backup to queue")
            backupQueue = channelManagerBackupQueue
            break
        case .channelMonitor(_):
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Adding channel monitor backup to queue")
            backupQueue = channelMonitorBackupQueue
            break
        default:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Adding \(label.string) to misc backup queue")
            backupQueue = miscBackupQueue
            break
        }
        
        guard let backupQueue else {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Failed to add \(label.string) to backup queue")
            return
        }
        
        backupQueue.async {
            do {
                try persist(label, bytes, retry: 10) { attemptError in
                    //Soft fail, will keep retyring but UI can be updated in the meantime
                    updateBackupState(label, type: .fail(attemptError))
                }
                updateBackupState(label, type: .success)
                callback?(nil)
            } catch {
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Failed to persist remote backup \(label.string). \(error.localizedDescription)")
                updateBackupState(label, type: .fail(error))
                callback?(error)
            }
        }
    }
}
