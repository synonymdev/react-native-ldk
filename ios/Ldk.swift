import LDKFramework

@objc(Ldk)
class Ldk: NSObject {
    var feeEstimator: LdkFeeEstimator?
    var logger: LdkLogger?
    var broadcaster: LdkBroadcaster?
    var persister: LdkPersister?
    var filter: LdkFilter?
    var chainMonitor: ChainMonitor?
    
    lazy var ldkStorage: URL = {
        let docsurl = try! FileManager.default.url(for:.documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
        let ldkPath = docsurl.appendingPathComponent("ldk")
        
        if !ldkPath.hasDirectoryPath {
            try! FileManager.default.createDirectory(atPath: ldkPath.path, withIntermediateDirectories: true, attributes: nil)
        }
        
        return ldkPath
    }()
    
    @objc
    func version(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let res: [String: String] = [
            "c_bindings": Bindings.swift_ldk_c_bindings_get_compiled_version(),
            "ldk": Bindings.swift_ldk_get_compiled_version(),
        ]
               
        resolve(String(data: try! JSONEncoder().encode(res), encoding: .utf8)!)
    }
    
    @objc
    func inititlize(_ method: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        switch method {
        case "fee_estimator":
            guard feeEstimator == nil else {
                return handleReject(reject, .already_initialised)
            }
            
            feeEstimator = LdkFeeEstimator()
            handleResolve(resolve, .fee_estimator_initialised)
            return
        case "logger":
            guard logger == nil else {
                return handleReject(reject, .already_initialised)
            }
            
            logger = LdkLogger()
            handleResolve(resolve, .logger_initialised)
            return
        case "broadcaster":
            guard broadcaster == nil else {
                return handleReject(reject, .already_initialised)
            }
            
            broadcaster = LdkBroadcaster()
            handleResolve(resolve, .broadcaster_initialised)
            return
        case "persister":
            guard persister == nil else {
                return handleReject(reject, .already_initialised)
            }
            
            persister = LdkPersister()

            handleResolve(resolve, .persister_initialised)
            return
        default:
            return handleReject(reject, .unknown_method)
        }
    }
    
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
    func initChainMonitor(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
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
        
        handleResolve(resolve, .chain_monitor_started)
    }
    
    @objc
    func initKeysManager(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//        let seed: [UInt8] = [0] //TODO
//
//        let seconds = UInt64(NSDate().timeIntervalSince1970)
//        let nanoSeconds = UInt32.init(truncating: NSNumber(value: seconds * 1000 * 1000))
//
//        let keysManager = KeysManager(seed: seed, starting_time_secs: seconds, starting_time_nanos: nanoSeconds)
//
//        let network = LDKNetwork_Bitcoin
//
//        let _ = ChannelManager(
//            fee_est: feeEstimator,
//            chain_monitor: Watch(),
//            tx_broadcaster: broadcaster,
//            logger: logger,
//            keys_manager: keysManager.as_KeysInterface(),
//            config: UserConfig(),
//            params: ChainParameters(network_arg: network, best_block_arg: BestBlock(block_hash: [], height: 0))
//        )
        
        handleResolve(resolve, .keys_manager_started)
    }
}
