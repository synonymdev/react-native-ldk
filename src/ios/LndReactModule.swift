//
//  LndReactModule.swift
//
//  Created by Jason van den Berg on 2020/11/19.
//

import Foundation
import SwiftProtobuf

enum LightningError: Error {
  case unknown
  case unknownMethod
  case mapping
}

extension LightningError: LocalizedError {
  public var errorDescription: String? {
    switch self {
    case .unknown:
      return "Unknown error"
    case .unknownMethod:
      return "Unknown method"
    case .mapping:
      return "GRPC mapping error"
    }
  }
}

enum LightningCallbackResponses: String {
  case started = "LND started"
  case walletCreated = "Wallet created"
  case walletUnlocked = "Wallet unlocked"
}

struct LndState {
  var lndRunning: Bool = false
  var walletUnlocked: Bool = false
  var grpcReady: Bool = false
  
  func formatted() -> [String: Bool] {
    return ["lndRunning": lndRunning, "walletUnlocked": walletUnlocked, "grpcReady": grpcReady]
  }
}

@objc(LndReactModule)
class LndReactModule: NSObject {
  var state = LndState()
  
  private var storage: URL {
    let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    let directory = documentsDirectory.appendingPathComponent("lnd")
    
    if !FileManager.default.fileExists(atPath: directory.path) {
      try! FileManager.default.createDirectory(atPath: directory.path, withIntermediateDirectories: true)
    }
    
    return directory
  }
  
  private let confName = "lnd.conf"
  
  private var confFile: URL {
      return storage.appendingPathComponent(confName)
  }
  
  lazy var syncMethods: [String: (Data?, BlindLndCallback) -> Void] = {
    return [
      "GetInfo": { (req: Data?, cb: BlindLndCallback) in LndmobileGetInfo(req, cb) },
      "NewAddress": { (req: Data?, cb: BlindLndCallback) in LndmobileNewAddress(req, cb) },
      "WalletBalance": { (req: Data?, cb: BlindLndCallback) in LndmobileWalletBalance(req, cb) },
      "ListChannels": { (req: Data?, cb: BlindLndCallback) in LndmobileListChannels(req, cb) },
      "PendingChannels": { (req: Data?, cb: BlindLndCallback) in LndmobilePendingChannels(req, cb) },
      "ClosedChannels": { (req: Data?, cb: BlindLndCallback) in LndmobileClosedChannels(req, cb) },
      "ListPeers": { (req: Data?, cb: BlindLndCallback) in LndmobileListPeers(req, cb) },
      "ConnectPeer": { (req: Data?, cb: BlindLndCallback) in LndmobileConnectPeer(req, cb) },
      "AddInvoice": { (req: Data?, cb: BlindLndCallback) in LndmobileAddInvoice(req, cb) },
      "DecodePayReq": { (req: Data?, cb: BlindLndCallback) in LndmobileDecodePayReq(req, cb) },
      "QueryRoutes": { (req: Data?, cb: BlindLndCallback) in LndmobileQueryRoutes(req, cb) },
      "SendCoins": { (req: Data?, cb: BlindLndCallback) in LndmobileSendCoins(req, cb) },
      "GetTransactions": { (req: Data?, cb: BlindLndCallback) in LndmobileGetTransactions(req, cb) },
      "ListInvoices": { (req: Data?, cb: BlindLndCallback) in LndmobileListInvoices(req, cb) },
      "ListPayments": { (req: Data?, cb: BlindLndCallback) in LndmobileListPayments(req, cb) },
      "ChangePassword": { (req: Data?, cb: BlindLndCallback) in LndmobileChangePassword(req, cb) },
      "ChannelBalance": { (req: Data?, cb: BlindLndCallback) in LndmobileChannelBalance(req, cb) },
      "EstimateFee": { (req: Data?, cb: BlindLndCallback) in LndmobileEstimateFee(req, cb) },
      "StopDaemon": { (req: Data?, cb: BlindLndCallback) in LndmobileStopDaemon(req, cb) },
      "Status": { (req: Data?, cb: BlindLndCallback) in LndmobileStatus(req, cb) },
      "SetScores": { (req: Data?, cb: BlindLndCallback) in LndmobileSetScores(req, cb) },
      "QueryScores": { (req: Data?, cb: BlindLndCallback) in LndmobileQueryScores(req, cb) },
      "ModifyStatus": { (req: Data?, cb: BlindLndCallback) in LndmobileModifyStatus(req, cb) },
      "GetNetworkInfo": { (req: Data?, cb: BlindLndCallback) in LndmobileGetNetworkInfo(req, cb) },
    ]
  }()
  
  @objc
  func walletExists(_ network: NSString, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(FileManager.default.fileExists(atPath: storage.appendingPathComponent("/data/chain/bitcoin/\(network)/wallet.db").path))
  }
  
  @objc
  func currentState(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(state.formatted())
  }
  
  @objc
  func start(_ configContent: NSString, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    LightningEventEmitter.shared.send(withEvent: .logs, body: "LND Start Request")
    
    //Delete previous config if it exists
    try? FileManager.default.removeItem(at: confFile)
    
    //Write new config into LND directory
    do {
      try configContent.write(to: confFile, atomically: false, encoding: String.Encoding.utf8.rawValue)
    } catch {
        return reject("error", error.localizedDescription, error)
    }
    
    let args = "--lnddir=\(storage.path)"

    print(args)
    
    //TODO read the network from the configContent
    watchLndLog("testnet")
    
    LightningEventEmitter.shared.send(withEvent: .logs, body: "Starting LND with args: \(args)")
    
    LndmobileStart(
      args,
      LndEmptyResponseCallback { [weak self] (error) in
        if let e = error {
          return reject("error", e.localizedDescription, e)
        }
        
        self?.state.lndRunning = true
        resolve(LightningCallbackResponses.started)
      },
      LndEmptyResponseCallback { [weak self] (error) in
        //RPC is ready (only called after wallet is unlocked/created)
        self?.state.grpcReady = true
      }
    )
  }
  
  @objc
  func genSeed(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    LightningEventEmitter.shared.send(withEvent: .logs, body: "Generating seed phrase...")
  
    do {
      LndmobileGenSeed(
        try Lnrpc_GenSeedRequest().serializedData(),
        LndCallback<Lnrpc_GenSeedResponse> { (response, error) in
          if let e = error {
            return reject("error", e.localizedDescription, e)
          }
          
          resolve(response.cipherSeedMnemonic)
        }
      )
    } catch {
      return reject("error", error.localizedDescription, error)
    }
  }
  
  @objc
  func createWallet(_ password: NSString, seed: NSArray, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    var request = Lnrpc_InitWalletRequest()
    request.cipherSeedMnemonic = seed as! [String]
    request.walletPassword = String(password).data(using: .utf8)!
    
    do {
      LndmobileInitWallet(
        try request.serializedData(),
        LndEmptyResponseCallback { [weak self] (error) in
          if let e = error {
            return reject("error", e.localizedDescription, e)
          }
          
          self?.state.walletUnlocked = true
          resolve(LightningCallbackResponses.walletCreated)
        }
      )
    } catch {
      return reject("error", error.localizedDescription, error)
    }
  }
  
  @objc
  func unlockWallet(_ password: NSString, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    var request = Lnrpc_UnlockWalletRequest()
    request.walletPassword = String(password).data(using: .utf8)!

    do {
      LndmobileUnlockWallet(
        try request.serializedData(),
        LndEmptyResponseCallback { [weak self] (error) in
          if let e = error {
            return reject("error", e.localizedDescription, e)
          }
          
          self?.state.walletUnlocked = true
          resolve(LightningCallbackResponses.walletUnlocked)
        }
      )
    } catch {
      return reject("error", error.localizedDescription, error)
    }
  }
  
  @objc
  func sendCommand(_ method: NSString, body: NSString, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let request = Data(base64Encoded: String(body))
  
    let onResponse: (Data?, Error?) -> Void = { (res, error) in
      if let e = error {
        return reject("error", e.localizedDescription, e)
      }
      
      let resultData = res ?? Data() //For requests like balance, if the balance is zero the response can be empty
      
      resolve(["data": resultData.base64EncodedString()])
    }
    
    let completion = BlindLndCallback(onResponse)
    
    guard let lndMethod = syncMethods[method as String] else {
      return onResponse(nil, LightningError.unknownMethod)
    }
    
    lndMethod(request, completion)
  }
}

//MARK: Callbacks
extension LndReactModule {
    /// Generic callback for LND function which will map responses back into the protobuf message type.
  class LndCallback<T: SwiftProtobuf.Message>: NSObject, LndmobileCallbackProtocol, LndmobileRecvStreamProtocol {
    let completion: (T, Error?) -> Void

    init(_ completion: @escaping (T, Error?) -> Void) {
      let startedOnMainThread = Thread.current.isMainThread
      self.completion = { (response, error) in
        if startedOnMainThread {
          DispatchQueue.main.async { completion(response, error) }
        } else {
          completion(response, error)
        }
      }
    }
    
    func onResponse(_ p0: Data?) {
      guard let data = p0 else {
        return completion(T(), nil) //For calls like balance checks, an empty response should just be `T` defaults
      }
      
      do {
        completion(try T(serializedData: data), nil)
      } catch {
        completion(T(), LightningError.mapping)
      }
    }

    func onError(_ p0: Error?) {
      completion(T(), p0 ?? LightningError.unknown)
    }
  }
  
  /// Callback for LND function when the request and response goes unchecked on the swift side. Used for sendCommand where the requests are constructed in javascript.
  class BlindLndCallback: NSObject, LndmobileCallbackProtocol, LndmobileRecvStreamProtocol {
    let completion: (Data?, Error?) -> Void

    init(_ completion: @escaping (Data?, Error?) -> Void) {
      let startedOnMainThread = Thread.current.isMainThread
      self.completion = { (response, error) in
        if startedOnMainThread {
          DispatchQueue.main.async { completion(response, error) }
        } else {
          completion(response, error)
        }
      }
    }
    
    func onResponse(_ p0: Data?) {
      completion(p0, nil)
    }

    func onError(_ p0: Error?) {
      completion(nil, p0)
    }
  }
    
  /// For LND callbacks that don't pass back any messages but can return errors
  class LndEmptyResponseCallback: NSObject, LndmobileCallbackProtocol {
    let completion: (Error?) -> Void

    init(_ completion: @escaping (Error?) -> Void) {
      let startedOnMainThread = Thread.current.isMainThread
      self.completion = { error in
        if startedOnMainThread {
          DispatchQueue.main.async { completion(error) }
        } else {
          completion(error)
        }
      }
    }
    
    func onResponse(_ p0: Data?) {
      completion(nil)
    }

    func onError(_ p0: Error?) {
      completion(p0 ?? LightningError.unknown)
    }
  }
  
  func watchLndLog(_ network: String) {
    DispatchQueue.main.async { [weak self] in
      guard let self = self else { return }
      
      let logFile = self.storage.appendingPathComponent("logs/bitcoin/\(network)/lnd.log").path
      guard let fileHandle = FileHandle(forReadingAtPath: logFile) else {
        //If the file for some reason doesn't exist (if LND has never been started) just wait a second and try again
        return DispatchQueue.main.asyncAfter(deadline: .now() + 1) { [weak self] in self?.watchLndLog(network) }
      }
          
      LightningEventEmitter.shared.send(withEvent: .logs, body: "Observing LND log: \(logFile)")

      NotificationCenter.default.addObserver(forName: FileHandle.readCompletionNotification, object: fileHandle, queue: OperationQueue.main) { (notification) in
        fileHandle.readInBackgroundAndNotify()
        
        guard let info = notification.userInfo else { return }
        guard let data = info[NSFileHandleNotificationDataItem] as? Data else { return }
        guard data.count > 0 else { return }
        guard let logLine = NSString(data: data, encoding: String.Encoding.utf8.rawValue) else { return }
                
        LightningEventEmitter.shared.send(withEvent: .logs, body: logLine as String)
      }
      
      fileHandle.seekToEndOfFile()
      fileHandle.readInBackgroundAndNotify()
    }
  }
}

//MARK: Singleton react native event emitter
@objc(LightningEventEmitter)
class LightningEventEmitter: RCTEventEmitter {
  public static var shared: LightningEventEmitter!

  public enum EventTypes: String, CaseIterable {
    case logs = "logs"
    case streamEvent = "streamEvent"
  }

  override init() {
    super.init()
    LightningEventEmitter.shared = self
  }

  public func send(withEvent eventType: EventTypes, body: String) {
    sendEvent(withName: eventType.rawValue, body: body)
  }

  override func supportedEvents() -> [String] {
    return EventTypes.allCases.map { $0.rawValue }
  }
}

//MARK: Module can be initialised on main thread as LndMobile handles all it's own tasks on background threads (https://reactnative.dev/docs/native-modules-ios#implementing--requiresmainqueuesetup)
extension LndReactModule {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

extension LightningEventEmitter {
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

