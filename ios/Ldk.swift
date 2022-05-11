import LDKFramework


@objc(Ldk)
class Ldk: NSObject {
    var networkGraphPath = ""
    
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
    func startChainMonitor(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let filter = LdkFilter()
        let broadcaster = LdkBroadcaster()
        let logger = LdkLogger()
        //TODO set these fees from the JS code. They should be able to be updated live.
        let feeEstimator = LdkFeeEstimator(high: 1000, normal: 500, low: 100)
        let persister = LdkPersister()
        
        let chainMonitor = ChainMonitor(
            chain_source: Option_FilterZ(value: filter),
            broadcaster: broadcaster,
            logger: logger,
            feeest: feeEstimator,
            persister: persister
        )
        
        let _ = ChannelManager(
            fee_est: feeEstimator,
            chain_monitor: Watch(),
            tx_broadcaster: broadcaster,
            logger: logger,
            keys_manager: KeysInterface(),
            config: UserConfig(),
            params: ChainParameters(network_arg: LDKNetwork_Bitcoin, best_block_arg: BestBlock(block_hash: [], height: 0))
        )
        
        resolve("Chain monitor started")
    }
}
