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
    case backup_sync_persist_error = "backup_sync_persist_error"
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
    case failed_signing_request = "failed_signing_request"
    case write_fail = "write_fail"
    case read_fail = "read_fail"
    case file_does_not_exist = "file_does_not_exist"
    case init_network_graph_fail = "init_network_graph_fail"
    case data_too_large_for_rn = "data_too_large_for_rn"
    case backup_setup_required = "backup_setup_required"
    case backup_setup_check_failed = "backup_setup_check_failed"
    case backup_setup_failed = "backup_setup_failed"
    case backup_check_failed = "backup_check_failed"
    case backup_restore_failed = "backup_restore_failed"
    case backup_restore_failed_existing_files = "backup_restore_failed_existing_files"
    case backup_list_files_failed = "backup_list_files_failed"
    case scorer_download_fail = "scorer_download_fail"
}

enum LdkCallbackResponses: String {
    case storage_path_set = "storage_path_set"
    case fees_updated = "fees_updated"
    case log_level_updated = "log_level_updated"
    case log_path_updated = "log_path_updated"
    case log_write_success = "log_write_success"
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
    case backup_client_setup_success = "backup_client_setup_success"
    case backup_restore_success = "backup_restore_success"
    case backup_client_check_success = "backup_client_check_success"
    case scorer_download_success = "scorer_download_success"
    case scorer_download_skip = "scorer_download_skip"
}

enum LdkFileNames: String {
    case network_graph = "network_graph.bin"
    case channel_manager = "channel_manager.bin"
    case scorer = "scorer.bin"
    case paymentsClaimed = "payments_claimed.json"
    case paymentsSent = "payments_sent.json"
    case channelsOpenedWithCustomKeysManager = "channel_opened_with_custom_keys_manager.json"
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
    static var chainMonitor: ChainMonitor?
    var keysManager: CustomKeysManager?
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
    func initKeysManager(_ seed: NSString, destinationScriptPublicKey: NSString, witnessProgram: NSString, witnessProgramVersion: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if keysManager != nil {
            //If previously started with the same key (by backup client) return success.
            return handleResolve(resolve, .keys_manager_init_success)
        }
        
        let seconds = UInt64(NSDate().timeIntervalSince1970)
        let nanoSeconds = UInt32.init(truncating: NSNumber(value: seconds * 1000 * 1000))
        let seedBytes = String(seed).hexaBytes
        
        guard seedBytes.count == 32 else {
            return handleReject(reject, .invalid_seed_hex)
        }
        
        keysManager = CustomKeysManager(
            seed: String(seed).hexaBytes,
            startingTimeSecs: seconds,
            startingTimeNanos: nanoSeconds,
            destinationScriptPublicKey: String(destinationScriptPublicKey).hexaBytes,
            witnessProgram: String(witnessProgram).hexaBytes,
            witnessProgramVersion: UInt8(witnessProgramVersion)
        )
        
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
    func downloadScorer(_ scorerSyncUrl: NSString, skipHoursThreshold: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let accountStoragePath = Ldk.accountStoragePath else {
            return handleReject(reject, .init_storage_path)
        }
        
        let destinationFile = accountStoragePath.appendingPathComponent(LdkFileNames.scorer.rawValue)
        
        //If old one is still recent, skip download. Else delete it.
        if FileManager().fileExists(atPath: destinationFile.path) {
            let fileAttributes = try? FileManager().attributesOfItem(atPath: destinationFile.path)
            if let creationDate = fileAttributes?[.creationDate] as? Date {
                let currentTime = Date()
                let timeInterval = currentTime.timeIntervalSince(creationDate)
                let hoursPassed = timeInterval / 3600
                
                if hoursPassed <= Double(skipHoursThreshold) {
                    return handleResolve(resolve, .scorer_download_skip)
                }
            }
            
            try? FileManager().removeItem(atPath: destinationFile.path)
        }
        
        let url = URL(string: String(scorerSyncUrl))!
        let task = url.downloadTask(destination: destinationFile) { error in
            if let error = error {
                return handleReject(reject, .scorer_download_fail, error)
            }
            
            handleResolve(resolve, .scorer_download_success)
        }
        
        task?.resume()
    }
    
    @objc
    func initNetworkGraph(_ network: NSString, rapidGossipSyncUrl: NSString, skipHoursThreshold: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
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
        print("accountStoragePath: \(accountStoragePath)")
        
        //Download url passed, enable rapid gossip sync
        do {
            let rapidGossipSyncStoragePath = accountStoragePath.appendingPathComponent("rapid_gossip_sync")
            if !FileManager().fileExists(atPath: rapidGossipSyncStoragePath.path) {
                try FileManager.default.createDirectory(atPath: rapidGossipSyncStoragePath.path, withIntermediateDirectories: true, attributes: nil)
            }
            
            rapidGossipSync = RapidGossipSync(networkGraph: networkGraph!, logger: logger)
            
            //If it's been more than 24 hours then we need to update RGS
            let timestamp = networkGraph?.getLastRapidGossipSyncTimestamp() ?? 0
            let minutesDiffSinceLastRGS = (Calendar.current.dateComponents([.minute], from: Date.init(timeIntervalSince1970: TimeInterval(timestamp)), to: Date()).minute)!
            
            guard minutesDiffSinceLastRGS > 60 * skipHoursThreshold else {
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Skipping rapid gossip sync. Last updated \(minutesDiffSinceLastRGS/60) hours ago.")
                return handleResolve(resolve, .network_graph_init_success)
            }
            
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Rapid gossip sync applying update. Last updated \(minutesDiffSinceLastRGS/60) hours ago.")
            
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
        guard channelManager == nil else {
            return handleReject(reject, .already_init)
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
        
        let storedChannelManager = try? Data(contentsOf: accountStoragePath.appendingPathComponent(LdkFileNames.channel_manager.rawValue).standardizedFileURL)
        
        var channelMonitorsSerialized: Array<[UInt8]> = []
        let channelFiles = try! FileManager.default.contentsOfDirectory(at: channelStoragePath, includingPropertiesForKeys: nil)
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Channel files \(channelFiles.count)")
        for channelFile in channelFiles {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Loading channel from file \(channelFile.lastPathComponent)")
            channelMonitorsSerialized.append([UInt8](try! Data(contentsOf: channelFile.standardizedFileURL)))
        }
        
        //Scorer setup
        let probabilisticScorer = getProbabilisticScorer(path: accountStoragePath, networkGraph: networkGraph, logger: logger)
        let score = probabilisticScorer.asScore()
        let scorer = MultiThreadedLockableScore(score: score)
        
        Self.chainMonitor = ChainMonitor(
            chainSource: filter,
            broadcaster: broadcaster,
            logger: logger,
            feeest: feeEstimator,
            persister: persister
        )
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Enabled P2P gossip: \(enableP2PGossip)")

        //        print("\(String(cString: strerror(22)))")
        
        let scoreParams = ProbabilisticScoringFeeParameters.initWithDefault()
        scoreParams.setBasePenaltyMsat(val: 500*1000)
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Overriding basePenaltyMsat: \(scoreParams.getBasePenaltyMsat())")
        
        let params = ChannelManagerConstructionParameters(
            config: userConfig,
            entropySource: keysManager.inner.asEntropySource(),
            nodeSigner: keysManager.inner.asNodeSigner(),
            signerProvider: keysManager.signerProvider,
            feeEstimator: feeEstimator,
            chainMonitor: Self.chainMonitor!,
            txBroadcaster: broadcaster,
            logger: logger,
            enableP2PGossip: enableP2PGossip,
            scorer: scorer,
            scoreParams: scoreParams
            //TODO set payerRetries
        )
        
        do {
            if let channelManagerSerialized = storedChannelManager {
                //Restoring node
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Restoring node from disk")
                
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
        Self.chainMonitor = nil
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
        Self.chainMonitor = nil
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
    func updateFees(_ anchorChannelFee: NSInteger, nonAnchorChannelFee: NSInteger, channelCloseMinimum: NSInteger, minAllowedAnchorChannelRemoteFee: NSInteger, maxAllowedNonAnchorChannelRemoteFee: NSInteger, onChainSweep: NSInteger, minAllowedNonAnchorChannelRemoteFee: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        feeEstimator.update(
            anchorChannelFee: UInt32(anchorChannelFee),
            nonAnchorChannelFee: UInt32(nonAnchorChannelFee),
            channelCloseMinimum: UInt32(channelCloseMinimum),
            minAllowedAnchorChannelRemoteFee: UInt32(minAllowedAnchorChannelRemoteFee),
            maxAllowedNonAnchorChannelRemoteFee: UInt32(maxAllowedNonAnchorChannelRemoteFee),
            onChainSweep: UInt32(onChainSweep),
            minAllowedNonAnchorChannelRemoteFee: UInt32(minAllowedNonAnchorChannelRemoteFee)
        )
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
        
        guard let chainMonitor = Self.chainMonitor else {
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
        
        guard let chainMonitor = Self.chainMonitor else {
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
        
        guard let chainMonitor = Self.chainMonitor else {
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
                return handleReject(reject, .channel_accept_fail, nil, error.getValueAsChannelUnavailable()?.getErr())
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
            locktime: nil
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
            nodeSigner: keysManager.inner.asNodeSigner(),
            logger: logger,
            network: ldkCurrency,
            amtMsat: amountSats == 0 ? nil : UInt64(amountSats) * 1000,
            description: String(description).withoutEmojis, //TODO remove to allow emojis when fixed in ldk
            invoiceExpiryDeltaSecs: UInt32(expiryDelta),
            minFinalCltvExpiryDelta: nil
        )
        
        if res.isOk() {
            guard let invoice = res.getValue() else {
                return handleReject(reject, .invoice_create_failed)
            }
            
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
        
        guard let chainMonitor = Self.chainMonitor else {
            return handleReject(reject, .init_chain_monitor)
        }
        
        let ignoredChannels = ignoreOpenChannels ? channelManager.listChannels() : []
        
        return resolve(chainMonitor.getClaimableBalancesAsJson(ignoredChannels: ignoredChannels))
    }
    
    //MARK: Misc functions
    @objc
    func writeToFile(_ fileName: NSString, path: NSString, content: NSString, format: NSString, remotePersist: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
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
            var fileData: Data?
            if format == "hex" {
                fileData = Data(fileContent.hexaBytes)
                try Data(fileContent.hexaBytes).write(to: fileUrl)
            } else {
                fileData = fileContent.data(using: .utf8)
                try fileContent.data(using: .utf8)?.write(to: fileUrl)
            }
            
            guard let fileData else {
                return handleReject(reject, .write_fail, "Failed to parse contents of file to write to \(fileName)")
            }
            
            try fileData.write(to: fileUrl)
            
            //Save to remote server if required
            if remotePersist {
                //Continue to retry remote persist in background
                BackupClient.addToPersistQueue(.misc(fileName: String(fileName)), [UInt8](fileData))
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
    
    @objc
    func nodeSign(_ message: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let keysManager = keysManager else {
            return handleReject(reject, .init_keys_manager)
        }
        
        let signed = Bindings.swiftSign(msg: Array(String(message).utf8), sk: keysManager.inner.getNodeSecretKey())
        if let _ = signed.getError() {
            handleReject(reject, .failed_signing_request)
        }
        
        return resolve(signed.getValue()!)
    }
    
    @objc
    func nodeStateDump(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        var logDump: [String] = []
        
        if let pubKey = keysManager?.inner.asNodeSigner().getNodeId(recipient: .Node).getValue() {
            logDump.append("NodeID: \(Data(pubKey).hexEncodedString())")
        }
        
        if let channelManager {
            channelManager.listChannels().forEach { channel in
                logDump.append("Open channel:")
                
                if let txId = channel.getFundingTxo()?.getTxid() {
                    logDump.append("Funding txid: \(Data(txId.reversed()).hexEncodedString())")
                }
                
                logDump.append("Ready: \(channel.getIsChannelReady() ? "YES" : "NO")")
                logDump.append("Usable: \(channel.getIsUsable() ? "YES" : "NO")")
                logDump.append("Balance: \(channel.getBalanceMsat()/1000) sats")
            }
        }
        
        if let chainMonitor = Self.chainMonitor {
            logDump.append("All claimable balances:\n \(chainMonitor.getClaimableBalancesAsJson(ignoredChannels: []))")
        } else {
            logDump.append("Claimable balances unavailable. Chain monitor not set yet")
        }
        
        if let syncTimestamp = channelManagerConstructor?.netGraph?.getLastRapidGossipSyncTimestamp() {
            let date = Date(timeIntervalSince1970: TimeInterval(syncTimestamp))

            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
            
            logDump.append("Last rapid gossip sync time: \(dateFormatter.string(from: date))")
        } else {
            logDump.append("RGS last sync time unavailable.")
        }
        
        if let peers = peerManager?.getPeerNodeIds()  {
            if peers.count > 0 {
                peers.forEach { (pubKey, address) in
                    logDump.append("Connected peer: \(Data(pubKey).hexEncodedString())")
                }
            } else {
                logDump.append("No connected peers")
            }
        } else {
            logDump.append("Connected peers unavailable. Peer manager not set.")
        }
        
        if let storage = Ldk.accountStoragePath {
            logDump.append("Storage: \(storage.path)")
        }
        
        logDump.append("BackupClient setup: \(BackupClient.requiresSetup ? "NO" : "YES")")
        logDump.append("Skip remote backups: \(BackupClient.skipRemoteBackup ? "YES" : "NO")")
        
        let logString = "********NODE STATE********\n" + logDump.joined(separator: "\n") + "\n****************"
        Logfile.log.write(logString)
        
        resolve(logString)
    }
    
    //MARK: Backup methods
    @objc
    func backupSetup(_ seed: NSString, network: NSString, server: NSString, serverPubKey: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let seedBytes = String(seed).hexaBytes
        
        guard seedBytes.count == 32 else {
            return handleReject(reject, .invalid_seed_hex)
        }

        let seconds = UInt64(NSDate().timeIntervalSince1970)
        let nanoSeconds = UInt32.init(truncating: NSNumber(value: seconds * 1000 * 1000))
        let keysManager = KeysManager(
            seed: String(seed).hexaBytes,
            startingTimeSecs: seconds,
            startingTimeNanos: nanoSeconds
        )
        
        guard let pubKey = keysManager.asNodeSigner().getNodeId(recipient: .Node).getValue() else {
            return handleReject(reject, .backup_setup_failed, "Failed to get nodeID from keysManager")
        }
        
        do {
            BackupClient.skipRemoteBackup = false
            try BackupClient.setup(
                secretKey: keysManager.getNodeSecretKey(),
                pubKey: pubKey,
                network: String(network),
                server: String(server),
                serverPubKey: String(serverPubKey)
            )
            
            handleResolve(resolve, .backup_client_setup_success)
        } catch {
            handleReject(reject, .backup_setup_failed, error, error.localizedDescription)
        }
    }
    
    @objc
    func restoreFromRemoteBackup(_ overwrite: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard !BackupClient.requiresSetup else {
            return handleReject(reject, .backup_setup_required)
        }
        
        guard let accountStoragePath = Ldk.accountStoragePath else {
            return handleReject(reject, .init_storage_path)
        }
        
        guard let channelStoragePath = Ldk.channelStoragePath else {
            return handleReject(reject, .init_storage_path)
        }
        
        do {
            if !overwrite {
                let fileManager = FileManager.default
                
                //Make sure channel manager and channel monitors don't exist
                if fileManager.fileExists(atPath: accountStoragePath.appendingPathComponent(LdkFileNames.channel_manager.rawValue).path) {
                    handleReject(reject, .backup_restore_failed_existing_files)
                    return
                }
                
                if !(try fileManager.contentsOfDirectory(atPath: channelStoragePath.path).isEmpty) {
                    handleReject(reject, .backup_restore_failed_existing_files)
                    return
                }
            }
            
            let completeBackup = try BackupClient.retrieveCompleteBackup()
            
            for file in completeBackup.files {
                try file.value.write(to: accountStoragePath.appendingPathComponent(file.key))
            }
            
            for channel in completeBackup.channelFiles {
                try channel.value.write(to: channelStoragePath.appendingPathComponent(channel.key))
            }
            
            handleResolve(resolve, .backup_restore_success)
        } catch {
            handleReject(reject, .backup_restore_failed, error, error.localizedDescription)
        }
    }
    
    @objc
    func backupSelfCheck(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard !BackupClient.requiresSetup else {
            return handleReject(reject, .backup_setup_required)
        }
        
        do {
            try BackupClient.selfCheck()
            handleResolve(resolve, .backup_client_check_success)
        } catch {
            handleReject(reject, .backup_check_failed, error, error.localizedDescription)
        }
    }
    
    @objc
    func backupListFiles(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard !BackupClient.requiresSetup else {
            return handleReject(reject, .backup_setup_required)
        }
        
        do {
            let result = try BackupClient.listFiles()
            resolve([
                "list": result.list,
                "channel_monitors": result.channel_monitors
            ])
        } catch {
            handleReject(reject, .backup_list_files_failed, error, error.localizedDescription)
        }
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
