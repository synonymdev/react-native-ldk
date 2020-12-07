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

enum LightningResponseKeys: String {
  case streamIdKey = "streamId"
  case b64DataKey = "data"
  case errorKey = "error"
  case eventKey = "event"
}

struct LndState {
  var lndRunning: Bool = false { didSet { updateStateStream() }}
  var walletUnlocked: Bool = false { didSet { updateStateStream() }}
  var grpcReady: Bool = false { didSet { updateStateStream() }}
  
  func formatted() -> [String: Bool] {
    return ["lndRunning": lndRunning, "walletUnlocked": walletUnlocked, "grpcReady": grpcReady]
  }
  
  func updateStateStream() {
    LightningEventEmitter.shared.send(withEvent: .lndStateUpdate, body: formatted())
  }
}

@objc(LndReactModule)
class LndReactModule: NSObject {
  static var state = LndState()
  
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
    
  private let activeStreams: [String: LndmobileSendStream] = [:]
  
  lazy var syncMethods: [String: (Data?, BlindLndCallback) -> Void] = {
    return [
      "EstimateFee": { (req: Data?, cb: BlindLndCallback) in LndmobileEstimateFee(req, cb) },
      "PendingChannels": { (req: Data?, cb: BlindLndCallback) in LndmobilePendingChannels(req, cb) },
      "NewAddress": { (req: Data?, cb: BlindLndCallback) in LndmobileNewAddress(req, cb) },
      "AddInvoice": { (req: Data?, cb: BlindLndCallback) in LndmobileAddInvoice(req, cb) },
      "GetNodeInfo": { (req: Data?, cb: BlindLndCallback) in LndmobileGetNodeInfo(req, cb) },
      "DisconnectPeer": { (req: Data?, cb: BlindLndCallback) in LndmobileDisconnectPeer(req, cb) },
      "GetNetworkInfo": { (req: Data?, cb: BlindLndCallback) in LndmobileGetNetworkInfo(req, cb) },
      "ChannelBalance": { (req: Data?, cb: BlindLndCallback) in LndmobileChannelBalance(req, cb) },
      "ListPeers": { (req: Data?, cb: BlindLndCallback) in LndmobileListPeers(req, cb) },
      "LookupInvoice": { (req: Data?, cb: BlindLndCallback) in LndmobileLookupInvoice(req, cb) },
      "ListInvoices": { (req: Data?, cb: BlindLndCallback) in LndmobileListInvoices(req, cb) },
      "SendMany": { (req: Data?, cb: BlindLndCallback) in LndmobileSendMany(req, cb) },
      "SendPaymentSync": { (req: Data?, cb: BlindLndCallback) in LndmobileSendPaymentSync(req, cb) },
      "ForwardingHistory": { (req: Data?, cb: BlindLndCallback) in LndmobileForwardingHistory(req, cb) },
      "DebugLevel": { (req: Data?, cb: BlindLndCallback) in LndmobileDebugLevel(req, cb) },
      "SetScores": { (req: Data?, cb: BlindLndCallback) in LndmobileSetScores(req, cb) },
      "Status": { (req: Data?, cb: BlindLndCallback) in LndmobileStatus(req, cb) },
      "QueryScores": { (req: Data?, cb: BlindLndCallback) in LndmobileQueryScores(req, cb) },
      "FeeReport": { (req: Data?, cb: BlindLndCallback) in LndmobileFeeReport(req, cb) },
      "SendToRouteSync": { (req: Data?, cb: BlindLndCallback) in LndmobileSendToRouteSync(req, cb) },
      "ListUnspent": { (req: Data?, cb: BlindLndCallback) in LndmobileListUnspent(req, cb) },
      "ExportAllChannelBackups": { (req: Data?, cb: BlindLndCallback) in LndmobileExportAllChannelBackups(req, cb) },
      "GetNodeMetrics": { (req: Data?, cb: BlindLndCallback) in LndmobileGetNodeMetrics(req, cb) },
      "GetInfo": { (req: Data?, cb: BlindLndCallback) in LndmobileGetInfo(req, cb) },
      "ChangePassword": { (req: Data?, cb: BlindLndCallback) in LndmobileChangePassword(req, cb) },
      "DeleteAllPayments": { (req: Data?, cb: BlindLndCallback) in LndmobileDeleteAllPayments(req, cb) },
      "ListPayments": { (req: Data?, cb: BlindLndCallback) in LndmobileListPayments(req, cb) },
      "SendCoins": { (req: Data?, cb: BlindLndCallback) in LndmobileSendCoins(req, cb) },
      "VerifyMessage": { (req: Data?, cb: BlindLndCallback) in LndmobileVerifyMessage(req, cb) },
      "FundingStateStep": { (req: Data?, cb: BlindLndCallback) in LndmobileFundingStateStep(req, cb) },
      "WalletBalance": { (req: Data?, cb: BlindLndCallback) in LndmobileWalletBalance(req, cb) },
      "GetTransactions": { (req: Data?, cb: BlindLndCallback) in LndmobileGetTransactions(req, cb) },
      "DescribeGraph": { (req: Data?, cb: BlindLndCallback) in LndmobileDescribeGraph(req, cb) },
      "QueryRoutes": { (req: Data?, cb: BlindLndCallback) in LndmobileQueryRoutes(req, cb) },
      "SignMessage": { (req: Data?, cb: BlindLndCallback) in LndmobileSignMessage(req, cb) },
      "GetRecoveryInfo": { (req: Data?, cb: BlindLndCallback) in LndmobileGetRecoveryInfo(req, cb) },
      "DecodePayReq": { (req: Data?, cb: BlindLndCallback) in LndmobileDecodePayReq(req, cb) },
      "GetChanInfo": { (req: Data?, cb: BlindLndCallback) in LndmobileGetChanInfo(req, cb) },
      "RestoreChannelBackups":  { (req: Data?, cb: BlindLndCallback) in LndmobileRestoreChannelBackups(req, cb) },
      "ConnectPeer": { (req: Data?, cb: BlindLndCallback) in LndmobileConnectPeer(req, cb) },
      "ListChannels": { (req: Data?, cb: BlindLndCallback) in LndmobileListChannels(req, cb) },
      "VerifyChanBackup": { (req: Data?, cb: BlindLndCallback) in LndmobileVerifyChanBackup(req, cb) },
      "OpenChannelSync": { (req: Data?, cb: BlindLndCallback) in LndmobileOpenChannelSync(req, cb) },
      "ClosedChannels": { (req: Data?, cb: BlindLndCallback) in LndmobileClosedChannels(req, cb) },
      "ExportChannelBackup": { (req: Data?, cb: BlindLndCallback) in LndmobileExportChannelBackup(req, cb) },
      "StopDaemon": { (req: Data?, cb: BlindLndCallback) in LndmobileStopDaemon(req, cb) },
      "ModifyStatus": { (req: Data?, cb: BlindLndCallback) in LndmobileModifyStatus(req, cb) },
      "UpdateChannelPolicy": { (req: Data?, cb: BlindLndCallback) in LndmobileUpdateChannelPolicy(req, cb) },
      "BakeMacaroon": { (req: Data?, cb: BlindLndCallback) in LndmobileBakeMacaroon(req, cb) },
    ]
  }()
  
  lazy var streamMethods: [String: (Data?, BlindLndCallback) -> Void] = {
    return [
      "CloseChannel": { (req: Data?, cb: BlindLndCallback) in LndmobileCloseChannel(req, cb) },
//      "ChannelAcceptor": { (req: Data?, cb: BlindLndCallback) in LndmobileChannelAcceptor(req, cb) },
      "SubscribeChannelBackups": { (req: Data?, cb: BlindLndCallback) in LndmobileSubscribeChannelBackups(req, cb) },
      "SubscribePeerEvents": { (req: Data?, cb: BlindLndCallback) in LndmobileSubscribePeerEvents(req, cb) },
      "SubscribeChannelGraph": { (req: Data?, cb: BlindLndCallback) in LndmobileSubscribeChannelGraph(req, cb) },
      "SubscribeInvoices": { (req: Data?, cb: BlindLndCallback) in LndmobileSubscribeInvoices(req, cb) },
      "SubscribeTransactions": { (req: Data?, cb: BlindLndCallback) in LndmobileSubscribeTransactions(req, cb) },
      "SubscribeChannelEvents": { (req: Data?, cb: BlindLndCallback) in LndmobileSubscribeChannelEvents(req, cb) },
//      "SendPayment": { (req: Data?, cb: BlindLndCallback) in LndmobileSendPayment(req, cb) },
//      "SendToRoute": { (req: Data?, cb: BlindLndCallback) in LndmobileSendToRoute(req, cb) }, TODO these probably need to be passed pointers to a LndmobileSendStream
    ]
  }()
  
  @objc
  func walletExists(_ network: NSString, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(FileManager.default.fileExists(atPath: storage.appendingPathComponent("/data/chain/bitcoin/\(network)/wallet.db").path))
  }
  
  @objc
  func currentState(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(LndReactModule.state.formatted())
  }
  
  @objc
  func start(_ configContent: NSString, network: NSString, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
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
    
    watchLndLog(network)
    
    LightningEventEmitter.shared.send(withEvent: .logs, body: "Starting LND with args: \(args)")
    
    LndmobileStart(
      args,
      LndEmptyResponseCallback { (error) in
        if let e = error {
          return reject("error", e.localizedDescription, e)
        }
        
        LndReactModule.state.lndRunning = true
        resolve(LightningCallbackResponses.started.rawValue)
      },
      LndEmptyResponseCallback { (error) in
        //RPC is ready (only called after wallet is unlocked/created)
        LndReactModule.state.grpcReady = true
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
        LndEmptyResponseCallback { (error) in
          if let e = error {
            return reject("error", e.localizedDescription, e)
          }
          
          LndReactModule.state.walletUnlocked = true
          resolve(LightningCallbackResponses.walletCreated.rawValue)
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
        LndEmptyResponseCallback { (error) in
          if let e = error {
            return reject("error", e.localizedDescription, e)
          }
          
          LndReactModule.state.walletUnlocked = true
          resolve(LightningCallbackResponses.walletUnlocked.rawValue)
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
        return reject(LightningResponseKeys.errorKey.rawValue, e.localizedDescription, e)
      }
      
      let resultData = res ?? Data() //For requests like balance, if the balance is zero the response can be empty
      resolve([LightningResponseKeys.b64DataKey.rawValue: resultData.base64EncodedString()])
    }
    
    let completion = BlindLndCallback(onResponse)
    
    guard let lndMethod = syncMethods[method as String] else {
      return onResponse(nil, LightningError.unknownMethod)
    }
    
    lndMethod(request, completion)
  }
  
  @objc
  func sendStreamCommand(_ method: NSString, streamId: NSString, body: NSString) {
    let request = Data(base64Encoded: String(body))
    
    let onResponse: (Data?, Error?) -> Void = { (res, error) in
      if let e = error {
        LightningEventEmitter.shared.send(
          withEvent: .streamEvent,
          body: [
            LightningResponseKeys.errorKey.rawValue: e.localizedDescription,
            LightningResponseKeys.eventKey.rawValue: LightningResponseKeys.errorKey.rawValue,
            LightningResponseKeys.streamIdKey.rawValue: streamId
          ]
        )
        return
      }
      
      let resultData = res ?? Data() //For some requests the response can be empty
      
      LightningEventEmitter.shared.send(
        withEvent: .streamEvent,
        body: [
          LightningResponseKeys.b64DataKey.rawValue: resultData.base64EncodedString(),
          LightningResponseKeys.eventKey.rawValue: LightningResponseKeys.b64DataKey.rawValue,
          LightningResponseKeys.streamIdKey.rawValue: streamId
        ]
      )
    }
    
    guard let lndMethod = streamMethods[method as String] else {
      LightningEventEmitter.shared.send(
        withEvent: .streamEvent,
        body: [
          LightningResponseKeys.errorKey.rawValue: LightningError.unknownMethod.localizedDescription,
          LightningResponseKeys.eventKey.rawValue: LightningResponseKeys.errorKey.rawValue,
          LightningResponseKeys.streamIdKey.rawValue: streamId
        ]
      )
      return
    }
    
    lndMethod(request, BlindLndCallback(onResponse))
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
  
  func watchLndLog(_ network: NSString) {
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
  
  func wipeWallet() {
    //TODO ensure regtest only
    print("WARNING: removing existing LND directory")
    try! FileManager.default.removeItem(at: storage)
  }
}

//MARK: Singleton react native event emitter
@objc(LightningEventEmitter)
class LightningEventEmitter: RCTEventEmitter {
  public static var shared: LightningEventEmitter!

  public enum EventTypes: String, CaseIterable {
    case logs = "logs"
    case streamEvent = "streamEvent"
    case lndStateUpdate = "lndStateUpdate"
  }

  override init() {
    super.init()
    LightningEventEmitter.shared = self
  }

  public func send(withEvent eventType: EventTypes, body: Any) {
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

