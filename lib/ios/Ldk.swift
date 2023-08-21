import LightningDevKit
import Darwin

//MARK: ************Replicate in typescript and kotlin************
enum EventTypes: String, CaseIterable {
    case ldk_log = "ldk_log"
    case native_log = "native_log"
    case register_tx = "register_tx"
    case register_output = "register_output"
    case broadcast_transaction = "broadcast_transaction"
    case backup = "backup"
    case channel_manager_funding_generation_ready = "channel_manager_funding_generation_ready"
    case channel_manager_payment_claimable = "channel_manager_payment_claimable"
    case channel_manager_payment_sent = "channel_manager_payment_sent"
    case channel_manager_open_channel_request = "channel_manager_open_channel_request"
    case channel_manager_payment_path_successful = "channel_manager_payment_path_successful"
    case channel_manager_payment_path_failed = "channel_manager_payment_path_failed"
    case channel_manager_payment_failed = "channel_manager_payment_failed"
    case channel_manager_pending_htlcs_forwardable = "channel_manager_pending_htlcs_forwardable"
    case channel_manager_spendable_outputs = "channel_manager_spendable_outputs"
    case channel_manager_channel_closed = "channel_manager_channel_closed"
    case channel_manager_discard_funding = "channel_manager_discard_funding"
    case channel_manager_payment_claimed = "channel_manager_payment_claimed"
    case emergency_force_close_channel = "emergency_force_close_channel"
    case new_channel = "new_channel"
    case network_graph_updated = "network_graph_updated"
    case channel_manager_restarted = "channel_manager_restarted"
}
//*****************************************************************

enum LdkErrors: String {
    case unknown_error = "unknown_error"
    case already_init = "already_init"
    case create_storage_dir_fail = "create_storage_dir_fail"
    case init_storage_path = "init_storage_path"
    case invalid_seed_hex = "invalid_seed_hex"
    case init_chain_monitor = "init_chain_monitor"
    case init_keys_manager = "init_keys_manager"
    case init_user_config = "init_user_config"
    case init_peer_manager = "init_peer_manager"
    case invalid_network = "invalid_network"
    case init_network_graph = "init_network_graph"
    case init_peer_handler = "init_peer_handler"
    case add_peer_fail = "add_peer_fail"
    case init_channel_manager = "init_channel_manager"
    case decode_invoice_fail = "decode_invoice_fail"
    case init_invoice_payer = "init_invoice_payer"
    case invoice_payment_fail_unknown = "invoice_payment_fail_unknown"
    case invoice_payment_fail_must_specify_amount = "invoice_payment_fail_must_specify_amount"
    case invoice_payment_fail_must_not_specify_amount = "invoice_payment_fail_must_not_specify_amount"
    case invoice_payment_fail_invoice = "invoice_payment_fail_invoice"
    case invoice_payment_fail_sending = "invoice_payment_fail_sending"
    case invoice_payment_fail_resend_safe = "invoice_payment_fail_resend_safe"
    case invoice_payment_fail_parameter_error = "invoice_payment_fail_parameter_error"
    case invoice_payment_fail_partial = "invoice_payment_fail_partial"
    case invoice_payment_fail_path_parameter_error = "invoice_payment_fail_path_parameter_error"
    case init_ldk_currency = "init_ldk_currency"
    case invoice_create_failed = "invoice_create_failed"
    case claim_funds_failed = "claim_funds_failed"
    case channel_close_fail = "channel_close_fail"
    case channel_accept_fail = "channel_accept_fail"
    case spend_outputs_fail = "spend_outputs_fail"
    case write_fail = "write_fail"
    case read_fail = "read_fail"
    case file_does_not_exist = "file_does_not_exist"
    case init_network_graph_fail = "init_network_graph_fail"
    case data_too_large_for_rn = "data_too_large_for_rn"
}

enum LdkCallbackResponses: String {
    case storage_path_set = "storage_path_set"
    case fees_updated = "fees_updated"
    case log_level_updated = "log_level_updated"
    case log_path_updated = "log_path_updated"
    case log_write_success = "log_write_success"
    case chain_monitor_init_success = "chain_monitor_init_success"
    case keys_manager_init_success = "keys_manager_init_success"
    case channel_manager_init_success = "channel_manager_init_success"
    case config_init_success = "config_init_success"
    case network_graph_init_success = "network_graph_init_success"
    case add_peer_success = "add_peer_success"
    case chain_sync_success = "chain_sync_success"
    case invoice_payment_success = "invoice_payment_success"
    case tx_set_confirmed = "tx_set_confirmed"
    case tx_set_unconfirmed = "tx_set_unconfirmed"
    case process_pending_htlc_forwards_success = "process_pending_htlc_forwards_success"
    case claim_funds_success = "claim_funds_success"
    case ldk_stop = "ldk_stop"
    case ldk_restart = "ldk_restart"
    case accept_channel_success = "accept_channel_success"
    case close_channel_success = "close_channel_success"
    case file_write_success = "file_write_success"
    case abandon_payment_success = "abandon_payment_success"
}

enum LdkFileNames: String {
    case network_graph = "network_graph.bin"
    case channel_manager = "channel_manager.bin"
    case scorer = "scorer.bin"
    case paymentsClaimed = "payments_claimed.json"
    case paymentsSent = "payments_sent.json"
}

@objc(Ldk)
class Ldk: NSObject {
    //Zero config objects lazy loaded into memory when required
    lazy var feeEstimator = {LdkFeeEstimator()}()
    lazy var logger = {LdkLogger()}()
    lazy var broadcaster = {LdkBroadcaster()}()
    lazy var persister = {LdkPersister()}()
    lazy var filter = {LdkFilter()}()
    lazy var channelManagerPersister = {LdkChannelManagerPersister()}()
    
    //Config required to setup below objects
    var chainMonitor: ChainMonitor? //TODO lazy load chainMonitor
    var keysManager: KeysManager?
    var channelManager: ChannelManager?
    var userConfig: UserConfig?
    var networkGraph: NetworkGraph?
    var rapidGossipSync: RapidGossipSync?
    var peerManager: PeerManager?
    var peerHandler: TCPPeerHandler?
    var channelManagerConstructor: ChannelManagerConstructor?
    var ldkNetwork: Network?
    var ldkCurrency: Currency?
    
    //Keep these in memory for restarting the channel manager constructor
    var currentNetwork: NSString?
    var currentBlockchainTipHash: NSString?
    var currentBlockchainHeight: NSInteger?
    
    //Static to be accessed from other classes
    static var accountStoragePath: URL?
    static var channelStoragePath: URL?
    
    //Uncomment for sending LDK team debugging output
    //    override init() {
    //        Bindings.setLogThreshold(severity: .DEBUG)
    //        super.init()
    //    }
    
    //MARK: Startup methods
    
    @objc
    func setAccountStoragePath(_ storagePath: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let accountStoragePath = URL(fileURLWithPath: String(storagePath))
        let channelStoragePath = accountStoragePath.appendingPathComponent("channels")
        
        do {
            if !FileManager().fileExists(atPath: accountStoragePath.path) {
                try FileManager.default.createDirectory(atPath: accountStoragePath.path, withIntermediateDirectories: true, attributes: nil)
            }
            
            if !FileManager().fileExists(atPath: channelStoragePath.path) {
                try FileManager.default.createDirectory(atPath: channelStoragePath.path, withIntermediateDirectories: true, attributes: nil)
            }
        } catch {
            return handleReject(reject, .create_storage_dir_fail, error)
        }
        
        Ldk.accountStoragePath = accountStoragePath
        Ldk.channelStoragePath = channelStoragePath
        
        return handleResolve(resolve, .storage_path_set)
    }
    
    @objc
    func setLogFilePath(_ path: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let logFile = URL(fileURLWithPath: String(path))
        
        do {
            if !FileManager().fileExists(atPath: logFile.deletingLastPathComponent().path) {
                try FileManager.default.createDirectory(atPath: logFile.deletingLastPathComponent().path, withIntermediateDirectories: true, attributes: nil)
            }
        } catch {
            return handleReject(reject, .create_storage_dir_fail)
        }
        
        Logfile.log.setFilePath(logFile)
        return handleResolve(resolve, .log_path_updated)
    }
    
    @objc
    func writeToLogFile(_ line: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Logfile.log.write(String(line))
        return handleResolve(resolve, .log_write_success)
    }
    
    @objc
    func initChainMonitor(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard chainMonitor == nil else {
            return handleReject(reject, .already_init)
        }
        
        chainMonitor = ChainMonitor(
            chainSource: filter,
            broadcaster: broadcaster,
            logger: logger,
            feeest: feeEstimator,
            persister: persister
        )
        
        return handleResolve(resolve, .chain_monitor_init_success)
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
        
        keysManager = KeysManager(seed: String(seed).hexaBytes, startingTimeSecs: seconds, startingTimeNanos: nanoSeconds)
        
        return handleResolve(resolve, .keys_manager_init_success)
    }
    
    @objc
    func initUserConfig(_ userConfig: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard self.userConfig == nil else {
            return handleReject(reject, .already_init)
        }
        
        self.userConfig = UserConfig.initWithDictionary(userConfig)
        
        return handleResolve(resolve, .config_init_success)
    }
    
    @objc
    func initNetworkGraph(_ network: NSString, rapidGossipSyncUrl: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard networkGraph == nil else {
            return handleReject(reject, .already_init)
        }
        
        guard let accountStoragePath = Ldk.accountStoragePath else {
            return handleReject(reject, .init_storage_path)
        }
        
        let networkGraphStoragePath = accountStoragePath.appendingPathComponent(LdkFileNames.network_graph.rawValue).standardizedFileURL
        
        do {
            let read = NetworkGraph.read(ser: [UInt8](try Data(contentsOf: networkGraphStoragePath)), arg: logger)
            if read.isOk() {
                networkGraph = read.getValue()
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Loaded network graph from file")
            }
        } catch {
            guard let ldkNetwork = getNetwork(String(network)) else {
                return handleReject(reject, .invalid_network)
            }
            
            networkGraph = NetworkGraph(network: ldkNetwork.0, logger: logger)
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Failed to load cached network graph from disk. Will sync from scratch. \(error.localizedDescription)")
        }
        
        //Normal p2p gossip sync
        guard rapidGossipSyncUrl != "" else {
            return handleResolve(resolve, .network_graph_init_success)
        }
        
        print("rapidGossipSyncUrl: \(rapidGossipSyncUrl)")
        
        //Download url passed, enable rapid gossip sync
        do {
            let rapidGossipSyncStoragePath = accountStoragePath.appendingPathComponent("rapid_gossip_sync")
            if !FileManager().fileExists(atPath: rapidGossipSyncStoragePath.path) {
                try FileManager.default.createDirectory(atPath: rapidGossipSyncStoragePath.path, withIntermediateDirectories: true, attributes: nil)
            }
            
            rapidGossipSync = RapidGossipSync(networkGraph: networkGraph!, logger: logger)
            
            //If it's been more than 24 hours then we need to update RGS
            let timestamp = networkGraph?.getLastRapidGossipSyncTimestamp() ?? 0
            let hoursDiffSinceLastRGS = (Calendar.current.dateComponents([.hour], from: Date.init(timeIntervalSince1970: TimeInterval(timestamp)), to: Date()).hour)!
            
            guard hoursDiffSinceLastRGS > 24 else {
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Skipping rapid gossip sync. Last updated \(hoursDiffSinceLastRGS) hours ago.")
                return handleResolve(resolve, .network_graph_init_success)
            }
            
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Rapid gossip sync applying update. Last updated \(hoursDiffSinceLastRGS) hours ago.")
            
            rapidGossipSync!.downloadAndUpdateGraph(downloadUrl: String(rapidGossipSyncUrl), tempStoragePath: rapidGossipSyncStoragePath, timestamp: timestamp) { [weak self] error in
                guard let self = self else { return }
                
                if let error = error {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Rapid gossip sync fail. \(error.localizedDescription).")
                    
                    //Temp fix for when a RGS server is changed or reset
                    if error.localizedDescription.contains("LightningError") {
                        try? FileManager().removeItem(atPath: networkGraphStoragePath.path)
                        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Deleting persisted graph. Will sync from scratch on next startup.")
                    }
                    
                    return handleResolve(resolve, .network_graph_init_success) //Continue like normal, likely fine if we don't have the absolute latest state
                }
                
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Rapid gossip sync completed.")
                
                guard let graph = self.networkGraph?.readOnly() else {
                    return handleReject(reject, .init_network_graph_fail, "Failed to use network graph.")
                }
                
                _ = self.channelManagerPersister.persistGraph(networkGraph: self.networkGraph!)
                
                LdkEventEmitter.shared.send(
                    withEvent: .network_graph_updated,
                    body: [
                        "channel_count": graph.listChannels().count,
                        "node_count": graph.listNodes().count,
                    ]
                )
                
                return handleResolve(resolve, .network_graph_init_success)
            }
        } catch {
            return handleReject(reject, .init_network_graph_fail, error)
        }
    }
    
    @objc
    func initChannelManager(_ network: NSString, blockHash: NSString, blockHeight: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//        try? remoteBackup([0,1,2,3])
        
        guard channelManager == nil else {
            return handleReject(reject, .already_init)
        }
        
        guard let chainMonitor = chainMonitor else {
            return handleReject(reject, .init_chain_monitor)
        }
        
        guard let keysManager = keysManager else {
            return handleReject(reject, .init_keys_manager)
        }
        
        guard let userConfig = userConfig else {
            return handleReject(reject, .init_user_config)
        }
        
        guard let networkGraph = networkGraph else {
            return handleReject(reject, .init_network_graph)
        }
        
        guard let accountStoragePath = Ldk.accountStoragePath else {
            return handleReject(reject, .init_storage_path)
        }
        
        guard let channelStoragePath = Ldk.channelStoragePath else {
            return handleReject(reject, .init_storage_path)
        }
        
        guard let networkDetails = getNetwork(String(network)) else {
            return handleReject(reject, .invalid_network)
        }
        
        ldkNetwork = networkDetails.0
        ldkCurrency = networkDetails.1
        
        let enableP2PGossip = rapidGossipSync == nil
        
//        let storedChannelManager = try? Data(contentsOf: accountStoragePath.appendingPathComponent(LdkFileNames.channel_manager.rawValue).standardizedFileURL)
        
        let storedChannelManager = try? restoreBackup(.channelManager)
        //TODO we need to check for a 404 or something to know if the node is new
        
        var channelMonitorsSerialized: Array<[UInt8]> = []
        let channelFiles = try! FileManager.default.contentsOfDirectory(at: channelStoragePath, includingPropertiesForKeys: nil)
        for channelFile in channelFiles {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Loading channel from file \(channelFile.lastPathComponent)")
            channelMonitorsSerialized.append([UInt8](try! Data(contentsOf: channelFile.standardizedFileURL)))
        }
        
        //Scorer setup
        let probabilisticScorer = getProbabilisticScorer(path: accountStoragePath, networkGraph: networkGraph, logger: logger)
        let score = probabilisticScorer.asScore()
        let scorer = MultiThreadedLockableScore(score: score)
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Enabled P2P gossip: \(enableP2PGossip)")
        
        print(Ldk.accountStoragePath)
        
        print("\(String(cString: strerror(22)))")
        
        let params = ChannelManagerConstructionParameters(
            config: userConfig,
            entropySource: keysManager.asEntropySource(),
            nodeSigner: keysManager.asNodeSigner(),
            signerProvider: keysManager.asSignerProvider(),
            feeEstimator: feeEstimator,
            chainMonitor: chainMonitor,
            txBroadcaster: broadcaster,
            logger: logger,
            enableP2PGossip: enableP2PGossip,
            scorer: scorer
            //TODO set payerRetries
        )
        do {
            //Only restore a node if we have existing channel monitors to restore. Else we lose our UserConfig settings when restoring.
            //TOOD remove this check in 114 which should allow passing in userConfig
            if let channelManagerSerialized = storedChannelManager, channelMonitorsSerialized.count > 0 {
                //Restoring node
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Restoring node from disk")
                
                print("RESTORING REMOTE CHANNEL MANAGER: \(storedChannelManager?.hexEncodedString())")
                
                channelManagerConstructor = try ChannelManagerConstructor(
                    channelManagerSerialized: [UInt8](channelManagerSerialized),
                    channelMonitorsSerialized: channelMonitorsSerialized,
                    networkGraph: NetworkGraphArgument.instance(networkGraph),
                    filter: filter,
                    params: params
                )
            } else {
                //New node
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Creating new channel manager")
                channelManagerConstructor = ChannelManagerConstructor(
                    network: ldkNetwork!,
                    currentBlockchainTipHash: String(blockHash).hexaBytes.reversed(),
                    currentBlockchainTipHeight: UInt32(blockHeight),
                    netGraph: networkGraph,
                    params: params
                )
            }
        } catch {
            return handleReject(reject, .unknown_error, error)
        }
        
        channelManager = channelManagerConstructor!.channelManager
        
        Logfile.log.write("Node ID: \(Data(channelManager!.getOurNodeId()).hexEncodedString())")
        
        channelManagerConstructor!.chainSyncCompleted(persister: channelManagerPersister)
        peerManager = channelManagerConstructor!.peerManager
        
        peerHandler = channelManagerConstructor!.getTCPPeerHandler()
        
        if enableP2PGossip {
            self.networkGraph = channelManagerConstructor!.netGraph
        }
        
        //Listen for when the app comes into the foreground so we can restart CMC to get a new tcp peer handler
        currentNetwork = network
        currentBlockchainTipHash = blockHash
        currentBlockchainHeight = blockHeight
        addForegroundObserver()
        
        return handleResolve(resolve, .channel_manager_init_success)
    }
    
    func addForegroundObserver() {
        removeForegroundObserver()
        NotificationCenter.default.addObserver(self, selector: #selector(restartOnForeground), name: UIApplication.didBecomeActiveNotification, object: nil)
    }
    
    func removeForegroundObserver() {
        NotificationCenter.default.removeObserver(self, name: UIApplication.didBecomeActiveNotification, object: nil)
    }
    
    /// Used by event listener so responses are not handled
    @objc
    func restartOnForeground() {
        restart { res in } reject: { code, message, error in }
    }
    
    /// Restarts channel manager constructor to get a new TCP peer handler
    @objc
    func restart(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard channelManagerConstructor != nil else {
            //Wasn't yet started
            return handleReject(reject, .init_channel_manager)
        }
        
        guard let currentNetwork = self.currentNetwork,
              let currentBlockchainTipHash = self.currentBlockchainTipHash,
              let currentBlockchainHeight = self.currentBlockchainHeight else {
            //Node was never started
            return handleReject(reject, .init_channel_manager)
        }
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Stopping LDK background tasks")
        
        //Reset only objects created by initChannelManager
        channelManagerConstructor?.interrupt()
        channelManagerConstructor = nil
        channelManager = nil
        peerManager = nil
        peerHandler = nil
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Starting LDK background tasks again")
        initChannelManager(currentNetwork, blockHash: currentBlockchainTipHash, blockHeight: currentBlockchainHeight) { success in
            //Notify JS that a sync is required
            LdkEventEmitter.shared.send(withEvent: .channel_manager_restarted, body: "")
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "LDK restarted successfully")
            
            return handleResolve(resolve, .ldk_restart)
        } reject: { errorCode, errorMessage, error in
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error restarting LDK. \(String(describing: errorCode)) \(String(describing: errorMessage))")
            handleReject(reject, .unknown_error)
        }
    }
    
    @objc
    func stop(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let cm = channelManagerConstructor else {
            //Wasn't yet started
            return handleResolve(resolve, .ldk_stop)
        }
        
        removeForegroundObserver() //LDK was intentionally stopped and we shouldn't attempt a restart
        cm.interrupt()
        channelManagerConstructor = nil
        chainMonitor = nil
        keysManager = nil
        channelManager = nil
        userConfig = nil
        networkGraph = nil
        peerManager = nil
        peerHandler = nil
        ldkNetwork = nil
        ldkCurrency = nil
        
        return handleResolve(resolve, .ldk_stop)
    }
    
    //MARK: Update methods
    
    @objc
    func updateFees(_ high: NSInteger, normal: NSInteger, low: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        feeEstimator.update(high: UInt32(high), normal: UInt32(normal), low: UInt32(low))
        return handleResolve(resolve, .fees_updated)
    }
    
    @objc
    func setLogLevel(_ level: NSString, active: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        logger.setLevel(level: String(level), active: active)
        return handleResolve(resolve, .log_level_updated)
    }
    
    @objc
    func syncToTip(_ header: NSString, blockHash: NSString, height: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        //Sync ChannelMonitors and ChannelManager to chain tip
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        guard let chainMonitor = chainMonitor else {
            return handleReject(reject, .init_chain_monitor)
        }
        
        channelManager.asConfirm().bestBlockUpdated(header: String(header).hexaBytes, height: UInt32(height))
        chainMonitor.asConfirm().bestBlockUpdated(header: String(header).hexaBytes, height: UInt32(height))
        
        //Used for quick restarts
        currentBlockchainTipHash = blockHash
        currentBlockchainHeight = height
        
        return handleResolve(resolve, .chain_sync_success)
    }
    
    @objc
    func addPeer(_ address: NSString, port: NSInteger, pubKey: NSString, timeout: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        //timeout param not used. Only for android.
        
        //Sync ChannelMonitors and ChannelManager to chain tip
        guard let peerHandler = peerHandler else {
            return handleReject(reject, .init_peer_handler)
        }
        
        let res = peerHandler.connect(address: String(address), port: UInt16(port), theirNodeId: String(pubKey).hexaBytes)
        if !res {
            return handleReject(reject, .add_peer_fail)
        }
        
        return handleResolve(resolve, .add_peer_success)
    }
    
    @objc
    func setTxConfirmed(_ header: NSString, txData: NSArray, height: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        guard let chainMonitor = chainMonitor else {
            return handleReject(reject, .init_chain_monitor)
        }
        
        var confirmTxData: [(UInt, [UInt8])] = []
        for tx in txData {
            let d = tx as! NSDictionary
            confirmTxData.append((d["pos"] as! UInt, (d["transaction"] as! String).hexaBytes))
        }
        
        channelManager.asConfirm().transactionsConfirmed(
            header: String(header).hexaBytes,
            txdata: confirmTxData,
            height: UInt32(height)
        )
        
        chainMonitor.asConfirm().transactionsConfirmed(
            header: String(header).hexaBytes,
            txdata: confirmTxData,
            height: UInt32(height)
        )
        
        return handleResolve(resolve, .tx_set_confirmed)
    }
    
    @objc
    func setTxUnconfirmed(_ txId: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        guard let chainMonitor = chainMonitor else {
            return handleReject(reject, .init_chain_monitor)
        }
        
        channelManager.asConfirm().transactionUnconfirmed(txid: String(txId).hexaBytes)
        chainMonitor.asConfirm().transactionUnconfirmed(txid: String(txId).hexaBytes)
        
        return handleResolve(resolve, .tx_set_unconfirmed)
    }
    
    @objc
    func acceptChannel(_ temporaryChannelId: NSString, counterPartyNodeId: NSString, trustedPeer0Conf: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        let temporaryChannelId = String(temporaryChannelId).hexaBytes
        let counterpartyNodeId = String(counterPartyNodeId).hexaBytes
        
        var userChannelId = Data(count: 32)
        userChannelId.withUnsafeMutableBytes { mutableBytes in
            arc4random_buf(mutableBytes.baseAddress, 32)
        }

        let res = trustedPeer0Conf ?
        channelManager.acceptInboundChannelFromTrustedPeer0conf(temporaryChannelId: temporaryChannelId, counterpartyNodeId: counterpartyNodeId, userChannelId: [UInt8](userChannelId)) :
        channelManager.acceptInboundChannel(temporaryChannelId: temporaryChannelId, counterpartyNodeId: counterpartyNodeId, userChannelId: [UInt8](userChannelId))
                
        guard res.isOk() else {
            guard let error = res.getError() else {
                return handleReject(reject, .channel_accept_fail)
            }
            
            switch error.getValueType() {
            case .APIMisuseError:
                return handleReject(reject, .channel_accept_fail, nil, error.getValueAsApiMisuseError()?.getErr())
            case .ChannelUnavailable:
                return handleReject(reject, .channel_accept_fail, nil, "Channel unavailable for accepting") //Crashes when returning error.getValueAsChannelUnavailable()?.getErr()
            case .FeeRateTooHigh:
                return handleReject(reject, .channel_accept_fail, nil, error.getValueAsFeeRateTooHigh()?.getErr())
            case .IncompatibleShutdownScript:
                return handleReject(reject, .channel_accept_fail, nil, Data(error.getValueAsIncompatibleShutdownScript()?.getScript().write() ?? []).hexEncodedString())
            case .InvalidRoute:
                return handleReject(reject, .channel_accept_fail, nil, error.getValueAsInvalidRoute()?.getErr())
            default:
                return handleReject(reject, .channel_accept_fail)
            }
        }
        
        return handleResolve(resolve, .accept_channel_success)
    }
    
    @objc
    func closeChannel(_ channelId: NSString, counterPartyNodeId: NSString, force: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        let channelId = String(channelId).hexaBytes
        let counterpartyNodeId = String(counterPartyNodeId).hexaBytes
        
        let res = force ?
        channelManager.forceCloseBroadcastingLatestTxn(channelId: channelId, counterpartyNodeId: counterpartyNodeId) :
        channelManager.closeChannel(channelId: channelId, counterpartyNodeId: counterpartyNodeId)
        guard res.isOk() else {
            guard let error = res.getError() else {
                return handleReject(reject, .channel_close_fail)
            }
            
            switch error.getValueType() {
            case .APIMisuseError:
                return handleReject(reject, .channel_close_fail, nil, error.getValueAsApiMisuseError()?.getErr())
            case .ChannelUnavailable:
                return handleReject(reject, .channel_close_fail, nil, "Channel unavailable for closing") //Crashes when returning error.getValueAsChannelUnavailable()?.getErr()
            case .FeeRateTooHigh:
                return handleReject(reject, .channel_close_fail, nil, error.getValueAsFeeRateTooHigh()?.getErr())
            case .IncompatibleShutdownScript:
                return handleReject(reject, .channel_close_fail, nil, Data(error.getValueAsIncompatibleShutdownScript()?.getScript().write() ?? []).hexEncodedString())
            case .InvalidRoute:
                return handleReject(reject, .channel_close_fail, nil, error.getValueAsInvalidRoute()?.getErr())
            default:
                return handleReject(reject, .channel_close_fail)
            }
        }
        
        return handleResolve(resolve, .close_channel_success)
    }
    
    @objc
    func forceCloseAllChannels(_ broadcastLatestTx: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        if broadcastLatestTx {
            channelManager.forceCloseAllChannelsBroadcastingLatestTxn()
        } else {
            channelManager.forceCloseAllChannelsWithoutBroadcastingTxn()
        }
        
        return handleResolve(resolve, .close_channel_success)
    }
    
    @objc
    func spendOutputs(_ descriptorsSerialized: NSArray, outputs: NSArray, changeDestinationScript: NSString, feeRate: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let keysManager = keysManager else {
            return handleReject(reject, .init_keys_manager)
        }
        
        var ldkDescriptors: Array<SpendableOutputDescriptor> = []
        for descriptor in descriptorsSerialized {
            let read = SpendableOutputDescriptor.read(ser: (descriptor as! String).hexaBytes)
            
            guard read.isOk()  else {
                return handleReject(reject, .spend_outputs_fail, nil, read.getError().debugDescription)
            }
            ldkDescriptors.append(read.getValue()!)
        }
        
        var ldkOutputs: Array<TxOut> = []
        for output in outputs {
            let d = output as! NSDictionary
            ldkOutputs.append(TxOut(scriptPubkey: (d["script_pubkey"] as! String).hexaBytes, value: d["value"] as! UInt64))
        }
        
        let res = keysManager.spendSpendableOutputs(
            descriptors: ldkDescriptors,
            outputs: ldkOutputs,
            changeDestinationScript: String(changeDestinationScript).hexaBytes,
            feerateSatPer1000Weight: UInt32(feeRate),
            locktime: nil //TODO check nil is fine
        )
        
        guard res.isOk() else {
            return handleReject(reject, .spend_outputs_fail)
        }
        
        return resolve(Data(res.getValue()!).hexEncodedString())
    }
    
    //MARK: Payments
    @objc
    func decode(_ paymentRequest: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let parsedInvoice = Bolt11Invoice.fromStr(s: String(paymentRequest))
        guard parsedInvoice.isOk(), let invoice = parsedInvoice.getValue()  else {
            let error = parsedInvoice.getError()?.getValueAsParseError()
            return handleReject(reject, .decode_invoice_fail, nil, error?.toStr())
        }
        
        return resolve(invoice.asJson) //Invoice class extended in Helpers file
    }
    
    @objc
    func pay(_ paymentRequest: NSString, amountSats: NSInteger, timeoutSeconds: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        guard let invoice = Bolt11Invoice.fromStr(s: String(paymentRequest)).getValue() else {
            return handleReject(reject, .decode_invoice_fail)
        }
        
        let isZeroValueInvoice = invoice.amountMilliSatoshis() == nil
        
        //If it's a zero invoice and we don't have an amount then don't proceed
        guard !(isZeroValueInvoice && amountSats == 0) else {
            return handleReject(reject, .invoice_payment_fail_must_specify_amount)
        }
        
        //Amount was set but not allowed to set own amount
        guard !(amountSats > 0 && !isZeroValueInvoice) else {
            return handleReject(reject, .invoice_payment_fail_must_not_specify_amount)
        }
        
        let res = isZeroValueInvoice ?
        Bindings.payZeroValueInvoice(invoice: invoice, amountMsats: UInt64(amountSats * 1000), retryStrategy: .initWithTimeout(a: UInt64(timeoutSeconds)), channelmanager: channelManager) :
        Bindings.payInvoice(invoice: invoice, retryStrategy: .initWithTimeout(a: UInt64(timeoutSeconds)), channelmanager: channelManager)
        
        if res.isOk() {
            channelManagerPersister.persistPaymentSent([
                "payment_id": Data(res.getValue() ?? []).hexEncodedString(),
                "payment_hash": Data(invoice.paymentHash() ?? []).hexEncodedString(),
                "amount_sat": isZeroValueInvoice ? amountSats : (invoice.amountMilliSatoshis() ?? 0) / 1000,
                "unix_timestamp": Int(Date().timeIntervalSince1970),
                "state": "pending"
            ])
            return resolve(Data(res.getValue() ?? []).hexEncodedString())
        }
        
        //MARK: add as failed payment
        
        guard let error = res.getError() else {
            return handleReject(reject, .invoice_payment_fail_unknown)
        }
        
        switch error.getValueType() {
        case .Invoice:
            return handleReject(reject, .invoice_payment_fail_invoice, nil, error.getValueAsInvoice())
        case .Sending:
            //Multiple sending errors
            guard let sendingError = error.getValueAsSending() else {
                return handleReject(reject, .invoice_payment_fail_sending, "AsSending")
            }
            
            return handleReject(reject, .invoice_payment_fail_sending)
        default:
            return handleReject(reject, .invoice_payment_fail_sending, nil, res.getError().debugDescription)
        }
    }
    
    @objc
    func abandonPayment(_ paymentId: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        channelManager.abandonPayment(paymentId: String(paymentId).hexaBytes)
        handleResolve(resolve, .abandon_payment_success)
    }
    
    @objc
    func createPaymentRequest(_ amountSats: NSInteger, description: NSString, expiryDelta: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        guard let keysManager = keysManager else {
            return handleReject(reject, .init_keys_manager)
        }
        
        guard let ldkCurrency = ldkCurrency else {
            return handleReject(reject, .init_ldk_currency)
        }
        
        let res = Bindings.createInvoiceFromChannelmanager(
            channelmanager: channelManager,
            nodeSigner: keysManager.asNodeSigner(),
            logger: logger,
            network: ldkCurrency,
            amtMsat: amountSats == 0 ? nil : UInt64(amountSats) * 1000,
            description: String(description).withoutEmojis, //TODO remove to allow emojis when fixed in ldk
            invoiceExpiryDeltaSecs: UInt32(expiryDelta),
            minFinalCltvExpiryDelta: nil //TOOD
        )
        
        if res.isOk() {
            guard let invoice = res.getValue() else {
                return handleReject(reject, .invoice_create_failed)
            }
            
            invoice.features()?.setBasicMppRequired()
            
            return resolve(invoice.asJson) //Invoice class extended in Helpers file
        }
        
        guard let error = res.getError(), let creationError = error.getValueAsCreationError()  else {
            return handleReject(reject, .invoice_create_failed)
        }
        
        return handleReject(reject, .invoice_create_failed, nil, "Invoice creation error: \(creationError)")
    }
    
    @objc
    func processPendingHtlcForwards(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        channelManager.processPendingHtlcForwards()
        
        return handleResolve(resolve, .process_pending_htlc_forwards_success)
    }
    
    @objc
    func claimFunds(_ paymentPreimage: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        channelManager.claimFunds(paymentPreimage: String(paymentPreimage).hexaBytes)
        
        return handleResolve(resolve, .claim_funds_success)
    }
    
    //MARK: Fetch methods
    @objc
    func version(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let res: [String: String] = [
            "c_bindings": Bindings.ldkCBindingsGetCompiledVersion(),
            "ldk": Bindings.ldkGetCompiledVersion(),
        ]
        
        return resolve(String(data: try! JSONEncoder().encode(res), encoding: .utf8)!)
    }
    
    @objc
    func nodeId(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        return resolve(Data(channelManager.getOurNodeId()).hexEncodedString())
    }
    
    @objc
    func listPeers(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let peerManager = peerManager else {
            return handleReject(reject, .init_peer_manager)
        }
        
        return resolve(peerManager.getPeerNodeIds().map { Data($0.0).hexEncodedString() })
    }
    
    @objc
    func listChannels(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        return resolve(channelManager.listChannels().map { $0.asJson })
    }
    
    @objc
    func listUsableChannels(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        return resolve(channelManager.listUsableChannels().map { $0.asJson })
    }
    
    @objc
    func listChannelFiles(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelStoragePath = Ldk.channelStoragePath else {
            return handleReject(reject, .init_storage_path)
        }
        
        return resolve(try! FileManager.default.contentsOfDirectory(at: channelStoragePath, includingPropertiesForKeys: nil).map { $0.lastPathComponent })
    }
    
    @objc
    func networkGraphListNodeIds(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let networkGraph = networkGraph?.readOnly() else {
            return handleReject(reject, .init_network_graph)
        }
        
        let total = networkGraph.listNodes().count
        if total > 100 {
            return handleReject(reject, .data_too_large_for_rn, nil, "Too many nodes to return (\(total))")
        }
        
        return resolve(networkGraph.listNodes().map { Data($0.asSlice()).hexEncodedString() })
    }
    
    @objc
    func networkGraphNodes(_ nodeIds: NSArray, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let networkGraph = networkGraph?.readOnly() else {
            return handleReject(reject, .init_network_graph)
        }
        
        var nodes: [NodeInfo] = []
        nodeIds.forEach { id in
            let nodeId = NodeId.initWithPubkey(pubkey: (id as! String).hexaBytes)
            if let node = networkGraph.node(nodeId: nodeId) {
                nodes.append(node)
            }
        }
        return resolve(nodes.map { $0.asJson })
    }
    
    @objc
    func networkGraphListChannels(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let networkGraph = networkGraph?.readOnly() else {
            return handleReject(reject, .init_network_graph)
        }
        
        let total = networkGraph.listChannels().count
        if total > 100 {
            return handleReject(reject, .data_too_large_for_rn, nil, "Too many channels to return (\(total))")
        }
        
        return resolve(networkGraph.listChannels().map { String($0) })
    }
    
    @objc
    func networkGraphChannel(_ shortChannelId: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let networkGraph = networkGraph?.readOnly() else {
            return handleReject(reject, .init_network_graph)
        }
        
        guard let shortIdUint64 = UInt64(String(shortChannelId)) else {
            return handleReject(reject, .init_network_graph) //TODO add new error code
        }
        
        guard let channelInfo = networkGraph.channel(shortChannelId: shortIdUint64) else {
            return handleReject(reject, .init_network_graph) //TODO add new error code
        }
        
        return resolve(channelInfo.asJson)
    }
    
    @objc
    func claimableBalances(_ ignoreOpenChannels: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        guard let chainMonitor = chainMonitor else {
            return handleReject(reject, .init_chain_monitor)
        }
        
        let ignoredChannels = ignoreOpenChannels ? channelManager.listChannels() : []
        
        var result: [Any] = []
        
        let claimableBalances = chainMonitor.getClaimableBalances(ignoredChannels: ignoredChannels)
        for balance in claimableBalances {
            switch balance.getValueType() {
            case .ClaimableAwaitingConfirmations:
                let b = balance.getValueAsClaimableAwaitingConfirmations()!
                result.append([
                    "amount_satoshis": b.getAmountSatoshis(),
                    "confirmation_height": b.getConfirmationHeight(),
                    "type": "ClaimableAwaitingConfirmations"
                ] as [String : Any])
                break
            case .ClaimableOnChannelClose:
                let b = balance.getValueAsClaimableOnChannelClose()!
                result.append([
                    "amount_satoshis": b.getAmountSatoshis(),
                    "type": "ClaimableOnChannelClose",
                ] as [String : Any])
                break
            case .ContentiousClaimable:
                let b = balance.getValueAsContentiousClaimable()!
                result.append([
                    "amount_satoshis": b.getAmountSatoshis(),
                    "timeout_height": b.getTimeoutHeight(),
                    "type": "ContentiousClaimable"
                ] as [String : Any])
                break
            case .CounterpartyRevokedOutputClaimable:
                let b = balance.getValueAsCounterpartyRevokedOutputClaimable()!
                result.append([
                    "amount_satoshis": b.getAmountSatoshis(),
                    "type": "CounterpartyRevokedOutputClaimable"
                ] as [String : Any])
                break
            case .MaybePreimageClaimableHTLC:
                let b = balance.getValueAsMaybePreimageClaimableHtlc()!
                result.append([
                    "amount_satoshis": b.getAmountSatoshis(),
                    "expiry_height": b.getExpiryHeight(),
                    "type": "MaybePreimageClaimableHTLC"
                ] as [String : Any])
                break
            case .MaybeTimeoutClaimableHTLC:
                let b = balance.getValueAsMaybeTimeoutClaimableHtlc()!
                result.append([
                    "amount_satoshis": b.getAmountSatoshis(),
                    "claimable_height": b.getClaimableHeight(),
                    "type": "MaybeTimeoutClaimableHTLC"
                ] as [String : Any])
                break
            default:
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unknown balance type type in claimableBalances() \(balance.getValueType())")
                result.append(["amount_satoshis": 0, "type": "Unknown"] as [String : Any])
            }
        }
        
        return resolve(result)
    }
    
    //MARK: Misc functions
    @objc
    func writeToFile(_ fileName: NSString, path: NSString, content: NSString, format: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let fileUrl: URL
        
        do {
            if path != "" {
                //Make sure custom path exists by creating if missing
                let pathUrl = URL(fileURLWithPath: String(path), isDirectory: true)
                
                if !FileManager().fileExists(atPath: pathUrl.path) {
                    try FileManager.default.createDirectory(atPath: pathUrl.path, withIntermediateDirectories: true, attributes: nil)
                }
                
                fileUrl = URL(fileURLWithPath: String(path)).appendingPathComponent(String(fileName))
            } else {
                //Assume default directory if no path was set
                guard let accountStoragePath = Ldk.accountStoragePath else {
                    return handleReject(reject, .init_storage_path)
                }
                
                fileUrl = accountStoragePath.appendingPathComponent(String(fileName))
            }
            
            let fileContent = String(content)
            if format == "hex" {
                try Data(fileContent.hexaBytes).write(to: fileUrl)
            } else {
                try fileContent.data(using: .utf8)?.write(to: fileUrl)
            }
            
            return handleResolve(resolve, .file_write_success)
        } catch {
            return handleReject(reject, .write_fail, error, "Failed to write content to file \(fileName)")
        }
    }
    
    @objc
    func readFromFile(_ fileName: NSString, path: NSString, format: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let fileUrl: URL
        
        if path != "" {
            fileUrl = URL(fileURLWithPath: String(path)).appendingPathComponent(String(fileName))
        } else {
            //Assume default directory if no path was set
            guard let accountStoragePath = Ldk.accountStoragePath else {
                return handleReject(reject, .init_storage_path)
            }
            
            fileUrl = accountStoragePath.appendingPathComponent(String(fileName))
        }
        
        if !FileManager().fileExists(atPath: fileUrl.path) {
            return handleReject(reject, .file_does_not_exist, nil, "Could not locate file at \(fileUrl.path)")
        }
        
        do {
            let attr = try FileManager.default.attributesOfItem(atPath: fileUrl.path)
            let timestamp = ((attr[FileAttributeKey.modificationDate] as? Date)?.timeIntervalSince1970 ?? 0).rounded()
            
            if format == "hex" {
                resolve(["content": try Data(contentsOf: fileUrl).hexEncodedString(), "timestamp": timestamp] as [String : Any])
            } else {
                resolve(["content": try String(contentsOf: fileUrl, encoding: .utf8), "timestamp": timestamp] as [String : Any])
            }
        } catch {
            return handleReject(reject, .read_fail, error, "Failed to read \(format) content from file \(fileUrl.path)")
        }
    }
    
    @objc
    func reconstructAndSpendOutputs(_ outputScriptPubKey: NSString, outputValue: NSInteger, outpointTxId: NSString, outpointIndex: NSInteger, feeRate: NSInteger, changeDestinationScript: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let keysManager = keysManager else {
            return handleReject(reject, .init_keys_manager)
        }
        
        let output = TxOut(scriptPubkey: String(outputScriptPubKey).hexaBytes, value: UInt64(outputValue))
        let outpoint = OutPoint(txidArg: String(outpointTxId).hexaBytes.reversed(), indexArg: UInt16(outpointIndex))
        let descriptor = SpendableOutputDescriptor.initWithStaticOutput(outpoint: outpoint, output: output)
        
        let res = keysManager.spendSpendableOutputs(
            descriptors: [descriptor],
            outputs: [],
            changeDestinationScript: String(changeDestinationScript).hexaBytes,
            feerateSatPer1000Weight: UInt32(feeRate),
            locktime: nil
        )
        
        guard res.isOk() else {
            return handleReject(reject, .spend_outputs_fail)
        }
        
        return resolve(Data(res.getValue()!).hexEncodedString())
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
