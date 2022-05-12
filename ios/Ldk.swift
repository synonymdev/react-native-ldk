import LDKFramework

//MARK: ************Replicate in typescript and kotlin************
enum EventTypes: String, CaseIterable {
    case ldk_log = "ldk_log"
    case swift_log = "swift_log"
    case register_tx = "register_tx"
    case register_output = "register_output"
    case broadcast_transaction = "broadcast_transaction"
    case persist_manager = "persist_manager"
    case persist_new_channel = "persist_new_channel"
    case channel_manager_event = "channel_manager_event"
    case update_persisted_channel = "update_persisted_channel"
}
//*****************************************************************

enum LdkErrors: String {
    case unknown_error = "unknown_error"
    case unknown_method = "unknown_method"
    case init_fee_estimator = "init_fee_estimator"
    case already_init = "already_init"
    case init_logger = "init_logger"
    case init_broadcaster = "init_broadcaster"
    case init_persister = "init_persister"
    case init_filter = "init_filter"
    case invalid_seed_hex = "invalid_seed_hex"
    case init_chain_monitor = "init_chain_monitor"
    case init_keys_manager = "init_keys_manager"
    case invalid_network = "invalid_network"
    case load_channel_monitors = "load_channel_monitors"
}

enum LdkCallbackResponses: String {
    case fee_estimator_init_success = "fee_estimator_init_success"
    case fees_updated = "fees_updated"
    case logger_init_success = "logger_init_success"
    case log_level_updated = "log_level_updated"
    case broadcaster_init_success = "broadcaster_init_success"
    case persister_init_success = "persister_init_success"
    case chain_monitor_init_success = "chain_monitor_init_success"
    case keys_manager_init_success = "keys_manager_init_success"
    case channel_manager_init_success = "channel_manager_init_success"
    case load_channel_monitors_success = "load_channel_monitors_success"
    case chain_monitor_updated = "chain_monitor_updated"
}

@objc(Ldk)
class Ldk: NSObject {
    var feeEstimator: LdkFeeEstimator?
    var logger: LdkLogger?
    var broadcaster: LdkBroadcaster?
    var persister: LdkPersister?
    var filter: LdkFilter?
    var chainMonitor: ChainMonitor?
    var keysManager: KeysManager?
    var channelManager: ChannelManager?
    var channelMonitors: Array<[UInt8]>?
    var networkGraph: NetworkGraph?
        
    lazy var ldkStorage: URL = {
        let docsurl = try! FileManager.default.url(for:.documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
        let ldkPath = docsurl.appendingPathComponent("ldk")
        
        if !ldkPath.hasDirectoryPath {
            try! FileManager.default.createDirectory(atPath: ldkPath.path, withIntermediateDirectories: true, attributes: nil)
        }
        
        return ldkPath
    }()
    
    //MARK: Startup methods
    
    @objc
    func inititlize(_ method: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        switch method {
        case "fee_estimator":
            guard feeEstimator == nil else {
                return handleReject(reject, .already_init)
            }
            
            feeEstimator = LdkFeeEstimator()
            handleResolve(resolve, .fee_estimator_init_success)
            return
        case "logger":
            guard logger == nil else {
                return handleReject(reject, .already_init)
            }
            
            logger = LdkLogger()
            handleResolve(resolve, .logger_init_success)
            return
        case "broadcaster":
            guard broadcaster == nil else {
                return handleReject(reject, .already_init)
            }
            
            broadcaster = LdkBroadcaster()
            handleResolve(resolve, .broadcaster_init_success)
            return
        case "persister":
            guard persister == nil else {
                return handleReject(reject, .already_init)
            }
            
            persister = LdkPersister()

            handleResolve(resolve, .persister_init_success)
            return
        default:
            return handleReject(reject, .unknown_method)
        }
    }
    
    @objc
    func initChainMonitor(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard chainMonitor == nil else {
            return handleReject(reject, .already_init)
        }
        
        guard let feeEstimator = feeEstimator else {
            return handleReject(reject, .init_fee_estimator)
        }
        
        guard let logger = logger else {
            return handleReject(reject, .init_logger)
        }
        
        guard let broadcaster = broadcaster else {
            return handleReject(reject, .init_broadcaster)
        }
        
        guard let persister = persister else {
            return handleReject(reject, .init_persister)
        }
                
        chainMonitor = ChainMonitor(
            chain_source: Option_FilterZ(value: LdkFilter()),
            broadcaster: broadcaster,
            logger: logger,
            feeest: feeEstimator,
            persister: persister
        )
        
        handleResolve(resolve, .chain_monitor_init_success)
    }
    
    @objc
    func initKeysManager(_ seed: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard keysManager == nil else {
            return handleReject(reject, .already_init)
        }
        
        let seconds = UInt64(NSDate().timeIntervalSince1970)
        let nanoSeconds = UInt32.init(truncating: NSNumber(value: seconds * 1000 * 1000))
        let seedBytes = String(seed).hexaBytes
        
        guard seedBytes.count == 32 else {
            return handleReject(reject, .invalid_seed_hex)
        }
        
        keysManager = KeysManager(seed: String(seed).hexaBytes, starting_time_secs: seconds, starting_time_nanos: nanoSeconds)

        handleResolve(resolve, .keys_manager_init_success)
    }
    
    @objc
    func loadChannelMonitors(_ channelMonitorStrings: NSArray, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        channelMonitors = Array<[UInt8]>()
        for monitor in channelMonitorStrings {
            channelMonitors?.append((monitor as! String).hexaBytes)
        }
        
        LdkEventEmitter.shared.send(withEvent: .swift_log, body: "Loaded channel monitors: \(channelMonitors!.count)")
        handleResolve(resolve, .load_channel_monitors_success)
    }
    
    //    @objc
    //    func initNetworkGraph(_ graph: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    //        let router = NetworkGraph(genesis_hash: [])
    //    }
    
    @objc
    func initChannelManager(_ network: NSString, serializedChannelManager: NSString, blockHash: NSString, blockHeight: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard channelManager == nil else {
            return handleReject(reject, .already_init)
        }
        
        guard let feeEstimator = feeEstimator else {
            return handleReject(reject, .init_fee_estimator)
        }
        
        guard let chainMonitor = chainMonitor else {
            return handleReject(reject, .init_chain_monitor)
        }
        
        guard let broadcaster = broadcaster else {
            return handleReject(reject, .init_broadcaster)
        }
        
        guard let logger = logger else {
            return handleReject(reject, .init_logger)
        }
        
        guard let keysManager = keysManager else {
            return handleReject(reject, .init_keys_manager)
        }
        
        guard let channelMonitors = channelMonitors else {
            return handleReject(reject, .load_channel_monitors)
        }
        
        let bestBlock = BestBlock(block_hash: String(blockHash).hexaBytes, height: UInt32(blockHeight))
        
        let ldkNetwork: LDKNetwork!
        switch network {
        case "regtest":
            ldkNetwork = LDKNetwork_Regtest
        case "testnet":
            ldkNetwork = LDKNetwork_Testnet
        case "mainnet":
            ldkNetwork = LDKNetwork_Bitcoin
        default:
            return handleReject(reject, .invalid_network)
        }
        
        let chainParams = ChainParameters(
            network_arg: ldkNetwork,
            best_block_arg: bestBlock
        )
        
        if channelMonitors.count == 0 {
            //New node
            channelManager = ChannelManager(
                fee_est: feeEstimator,
                chain_monitor: chainMonitor.as_Watch(),
                tx_broadcaster: broadcaster,
                logger: logger,
                keys_manager: keysManager.as_KeysInterface(),
                config: UserConfig(), //TODO customise from JS
                params: chainParams
            )
        } else {
            //Restoring node
            // MARK: Untested code
            do {
                channelManager = try ChannelManagerConstructor(
                    channel_manager_serialized: String(serializedChannelManager).hexaBytes,
                    channel_monitors_serialized: channelMonitors,
                    keys_interface: keysManager.as_KeysInterface(),
                    fee_estimator: feeEstimator,
                    chain_monitor: chainMonitor,
                    filter: filter,
                    net_graph_serialized: nil, //TODO
                    tx_broadcaster: broadcaster,
                    logger: logger
                ).channelManager
            } catch {
                return reject(error.localizedDescription, error.localizedDescription, error)
            }
        }
                
        handleResolve(resolve, .channel_manager_init_success)
    }
    
    //MARK: Update methods
    
    @objc
    func updateFees(_ high: NSInteger, normal: NSInteger, low: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let feeEstimator = feeEstimator else {
            return handleReject(reject, .init_fee_estimator)
        }
        
        feeEstimator.update(high: UInt32(high), normal: UInt32(normal), low: UInt32(low))
        handleResolve(resolve, .fees_updated)
    }
    
    @objc
    func setLogLevel(_ level: NSInteger, active: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let logger = logger else {
            return handleReject(reject, .init_logger)
        }
        
        logger.setLevel(level: UInt32(level), active: active)
        handleResolve(resolve, .log_level_updated)
    }
    
    @objc
    func syncToTip(_ blockHash: NSString, blockHeight: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        //Sync ChannelMonitors and ChannelManager to chain tip
        guard let channelManager = channelManager else {
            return handleReject(reject, .load_channel_monitors)
        }
        
        //TODO
    }
    
    @objc
    func syncChainMonitorWithChannelMonitor(_ blockHash: NSString, blockHeight: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let chainMonitor = chainMonitor else {
            return handleReject(reject, .init_chain_monitor)
        }
        
        //TODO figure out how to read channel monitors and pass to chain monitor
        //chainMonitor.as_Watch().watch_channel(funding_txo: T##OutPoint, monitor: channelMonitors)
        
        handleResolve(resolve, .chain_monitor_updated)
    }
    
    //MARK: Fetch methods
    @objc
    func version(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let res: [String: String] = [
            "c_bindings": Bindings.swift_ldk_c_bindings_get_compiled_version(),
            "ldk": Bindings.swift_ldk_get_compiled_version(),
        ]
               
        resolve(String(data: try! JSONEncoder().encode(res), encoding: .utf8)!)
    }
    
    @objc
    func nodeId(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .load_channel_monitors)
        }
        
        resolve(Data(channelManager.get_our_node_id()).hexEncodedString())
    }
}

//MARK: Singleton react native event emitter
@objc(LdkEventEmitter)
class LdkEventEmitter: RCTEventEmitter {
    public static var shared: LdkEventEmitter!

    override init() {
        super.init()
        LdkEventEmitter.shared = self
    }

    public func send(withEvent eventType: EventTypes, body: Any) {
        //TODO convert all bytes to hex here
        sendEvent(withName: eventType.rawValue, body: body)
    }

    override func supportedEvents() -> [String] {
        return EventTypes.allCases.map { $0.rawValue }
    }
}
