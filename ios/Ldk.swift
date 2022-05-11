import LDKFramework


@objc(Ldk)
class Ldk: NSObject {
    var feeEstimator: LdkFeeEstimator?
    
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
            "c_bindings_get_compiled_version": Bindings.swift_ldk_c_bindings_get_compiled_version(),
            "ldk_get_compiled_version": Bindings.swift_ldk_get_compiled_version(),
        ]
               
        resolve(String(data: try! JSONEncoder().encode(res), encoding: .utf8)!)
    }
    
    @objc
    func initFeeEstimator(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        feeEstimator = LdkFeeEstimator()
        handleResolve(resolve, .fee_estimator_initialised)
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
    func startChainMonitor(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let feeEstimator = feeEstimator else {
            return handleReject(reject, .init_fee_estimator)
        }
        
        let filter = LdkFilter()
        let broadcaster = LdkBroadcaster()
        let logger = LdkLogger()
        //TODO set these fees from the JS code. They should be able to be updated live.
        
        let persister = LdkPersister()
        
        let chainMonitor = ChainMonitor(
            chain_source: Option_FilterZ(value: filter),
            broadcaster: broadcaster,
            logger: logger,
            feeest: feeEstimator,
            persister: persister
        )
        
        
        
        let seed: [UInt8] = [0] //TODO
        
        let seconds = UInt64(NSDate().timeIntervalSince1970)
        let nanoSeconds = UInt32.init(truncating: NSNumber(value: seconds * 1000 * 1000))
        
        let keysManager = KeysManager(seed: seed, starting_time_secs: seconds, starting_time_nanos: nanoSeconds)
        
        let network = LDKNetwork_Bitcoin
        
        let _ = ChannelManager(
            fee_est: feeEstimator,
            chain_monitor: Watch(),
            tx_broadcaster: broadcaster,
            logger: logger,
            keys_manager: keysManager.as_KeysInterface(),
            config: UserConfig(),
            params: ChainParameters(network_arg: network, best_block_arg: BestBlock(block_hash: [], height: 0))
        )
        
        resolve("Chain monitor started")
    }
}
