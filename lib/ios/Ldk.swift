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
    case channel_manager_payment_received = "channel_manager_payment_received"
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
    case invoice_payment_fail_routing = "invoice_payment_fail_routing"
    case invoice_payment_fail_sending = "invoice_payment_fail_sending"
    case invoice_payment_fail_retry_safe = "invoice_payment_fail_retry_safe"
    case invoice_payment_fail_parameter_error = "invoice_payment_fail_parameter_error"
    case invoice_payment_fail_partial = "invoice_payment_fail_partial"
    case invoice_payment_fail_path_parameter_error = "invoice_payment_fail_path_parameter_error"
    case init_ldk_currency = "init_ldk_currency"
    case invoice_create_failed = "invoice_create_failed"
    case claim_funds_failed = "claim_funds_failed"
    case channel_close_fail = "channel_close_fail"
    case spend_outputs_fail = "spend_outputs_fail"
    case write_fail = "write_fail"
    case read_fail = "read_fail"
    case file_does_not_exist = "file_does_not_exist"
}

enum LdkCallbackResponses: String {
    case storage_path_set = "storage_path_set"
    case fees_updated = "fees_updated"
    case log_level_updated = "log_level_updated"
    case log_path_updated = "log_path_updated"
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
    case ldk_reset = "ldk_reset"
    case close_channel_success = "close_channel_success"
    case file_write_success = "file_write_success"
}

enum LdkFileNames: String {
    case network_graph = "network_graph.bin"
    case channel_manager = "channel_manager.bin"
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
    var peerManager: PeerManager?
    var peerHandler: TCPPeerHandler?
    var channelManagerConstructor: ChannelManagerConstructor?
    var invoicePayer: InvoicePayer?
    var ldkNetwork: LDKNetwork?
    var ldkCurrency: LDKCurrency?
    
    //Static to be accessed from other classes
    static var accountStoragePath: URL?
    static var channelStoragePath: URL?

    //MARK: Startup methods
    
    @objc
    func setAccountStoragePath(_ storagePath: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard Ldk.accountStoragePath == nil else {
            return handleReject(reject, .already_init)
        }
        
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
    func initChainMonitor(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard chainMonitor == nil else {
            return handleReject(reject, .already_init)
        }

        chainMonitor = ChainMonitor(
            chain_source: Option_FilterZ(value: filter),
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

        keysManager = KeysManager(seed: String(seed).hexaBytes, starting_time_secs: seconds, starting_time_nanos: nanoSeconds)

        return handleResolve(resolve, .keys_manager_init_success)
    }
    
    @objc
    func initConfig(_ acceptInboundChannels: Bool, manuallyAcceptInboundChannels: Bool, announcedChannels: Bool, minChannelHandshakeDepth: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard userConfig == nil else {
            return handleReject(reject, .already_init)
        }

        userConfig = UserConfig()
        userConfig!.set_accept_inbound_channels(val: acceptInboundChannels)
        userConfig!.set_manually_accept_inbound_channels(val: manuallyAcceptInboundChannels)

        let channelConfig = ChannelConfig()
        userConfig!.set_channel_config(val: channelConfig)
        
        let channelHandshakeConfig = ChannelHandshakeConfig()
        channelHandshakeConfig.set_minimum_depth(val: UInt32(minChannelHandshakeDepth))
        channelHandshakeConfig.set_announced_channel(val: announcedChannels)
        userConfig!.set_channel_handshake_config(val: channelHandshakeConfig)

        let channelHandshakeLimits = ChannelHandshakeLimits()
        channelHandshakeLimits.set_force_announced_channel_preference(val: true)
        userConfig!.set_channel_handshake_limits(val: channelHandshakeLimits)

        return handleResolve(resolve, .config_init_success)
    }

    @objc
    func initNetworkGraph(_ genesisHash: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard networkGraph == nil else {
            return handleReject(reject, .already_init)
        }
        
        guard let accountStoragePath = Ldk.accountStoragePath else {
            return handleReject(reject, .init_storage_path)
        }
        
        do {
            let read = NetworkGraph.read(ser: [UInt8](try Data(contentsOf: accountStoragePath.appendingPathComponent(LdkFileNames.network_graph.rawValue).standardizedFileURL)), arg: logger)
            if read.isOk() {
                networkGraph = read.getValue()
            }
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Failed to load cached network graph from disk. Will sync from scratch. \(error.localizedDescription)")
        }
        
        if networkGraph == nil {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Failed to load cached network graph from disk. Will sync from scratch.")
            networkGraph = NetworkGraph(genesis_hash: String(genesisHash).hexaBytes, logger: logger)
        }
        
        return handleResolve(resolve, .network_graph_init_success)
    }

    @objc
    func initChannelManager(_ network: NSString, blockHash: NSString, blockHeight: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
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
        
        switch network {
        case "regtest":
            ldkNetwork = LDKNetwork_Regtest
            ldkCurrency = LDKCurrency_Regtest
        case "testnet":
            ldkNetwork = LDKNetwork_Testnet
            ldkCurrency = LDKCurrency_BitcoinTestnet
        case "mainnet":
            ldkNetwork = LDKNetwork_Bitcoin
            ldkCurrency = LDKCurrency_Bitcoin
        default:
            return handleReject(reject, .invalid_network)
        }
        
        let storedChannelManager = try? Data(contentsOf: accountStoragePath.appendingPathComponent(LdkFileNames.channel_manager.rawValue).standardizedFileURL)
        
        do {
            if let channelManagerSerialized = storedChannelManager {
                //Restoring node
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Restoring node from disk")
                var channelMonitorsSerialized: Array<[UInt8]> = []
                let channelFiles = try! FileManager.default.contentsOfDirectory(at: channelStoragePath, includingPropertiesForKeys: nil)
                for channelFile in channelFiles {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Loading channel from file \(channelFile.lastPathComponent)")
                    channelMonitorsSerialized.append([UInt8](try! Data(contentsOf: channelFile.standardizedFileURL)))
                }
                
                channelManagerConstructor = try ChannelManagerConstructor(
                    channel_manager_serialized: [UInt8](channelManagerSerialized),
                    channel_monitors_serialized: channelMonitorsSerialized,
                    keys_interface: keysManager.as_KeysInterface(),
                    fee_estimator: feeEstimator,
                    chain_monitor: chainMonitor,
                    filter: filter,
                    net_graph_serialized: networkGraph.write(),
                    tx_broadcaster: broadcaster,
                    logger: logger,
                    enableP2PGossip: true
                )
            } else {
                //New node
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Creating new channel manager")
                channelManagerConstructor = ChannelManagerConstructor(
                    network: ldkNetwork!,
                    config: userConfig,
                    current_blockchain_tip_hash: String(blockHash).hexaBytes,
                    current_blockchain_tip_height: UInt32(blockHeight),
                    keys_interface: keysManager.as_KeysInterface(),
                    fee_estimator: feeEstimator,
                    chain_monitor: chainMonitor,
                    net_graph: networkGraph,
                    tx_broadcaster: broadcaster,
                    logger: logger,
                    enableP2PGossip: true
                )
            }
        } catch {
            return handleReject(reject, .unknown_error, error)
        }

        channelManager = channelManagerConstructor!.channelManager
        self.networkGraph = channelManagerConstructor!.net_graph
                
        //Scorer setup
        let scoringParams = ProbabilisticScoringParameters()
        let probabalisticScorer = ProbabilisticScorer(params: scoringParams, network_graph: self.networkGraph!, logger: logger)
        let score = probabalisticScorer.as_Score()
        let scorer = MultiThreadedLockableScore(score: score)
        
        channelManagerConstructor!.chain_sync_completed(persister: channelManagerPersister, scorer: scorer)
        peerManager = channelManagerConstructor!.peerManager

        peerHandler = channelManagerConstructor!.getTCPPeerHandler()
        invoicePayer = channelManagerConstructor!.payer
        
        return handleResolve(resolve, .channel_manager_init_success)
    }
    
    @objc
    func reset(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        channelManagerConstructor?.interrupt()
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
        Ldk.accountStoragePath = nil
        Ldk.channelStoragePath = nil

        return handleResolve(resolve, .ldk_reset)
    }

    //MARK: Update methods

    @objc
    func updateFees(_ high: NSInteger, normal: NSInteger, low: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        feeEstimator.update(high: UInt32(high), normal: UInt32(normal), low: UInt32(low))
        return handleResolve(resolve, .fees_updated)
    }

    @objc
    func setLogLevel(_ level: NSInteger, active: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        logger.setLevel(level: UInt32(level), active: active)
        return handleResolve(resolve, .log_level_updated)
    }

    @objc
    func syncToTip(_ header: NSString, height: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        //Sync ChannelMonitors and ChannelManager to chain tip
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }

        guard let chainMonitor = chainMonitor else {
            return handleReject(reject, .init_chain_monitor)
        }

        channelManager.as_Confirm().best_block_updated(header: String(header).hexaBytes, height: UInt32(height))
        chainMonitor.as_Confirm().best_block_updated(header: String(header).hexaBytes, height: UInt32(height))

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

        var confirmTxData: [C2Tuple_usizeTransactionZ] = []
        for tx in txData {
            let d = tx as! NSDictionary
            confirmTxData.append(C2Tuple_usizeTransactionZ.new(a: d["pos"] as! UInt, b: (d["transaction"] as! String).hexaBytes))
        }
        
        channelManager.as_Confirm().transactions_confirmed(
            header: String(header).hexaBytes,
            txdata: confirmTxData,
            height: UInt32(height)
        )
        chainMonitor.as_Confirm().transactions_confirmed(
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

        channelManager.as_Confirm().transaction_unconfirmed(txid: String(txId).hexaBytes)
        chainMonitor.as_Confirm().transaction_unconfirmed(txid: String(txId).hexaBytes)

        return handleResolve(resolve, .tx_set_unconfirmed)
    }
    
    @objc
    func closeChannel(_ channelId: NSString, counterPartyNodeId: NSString, force: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        let channel_id = String(channelId).hexaBytes
        let counterparty_node_id = String(counterPartyNodeId).hexaBytes
                
        let res = force ?
                    channelManager.force_close_broadcasting_latest_txn(channel_id: channel_id, counterparty_node_id: counterparty_node_id) :
                    channelManager.close_channel(channel_id: channel_id, counterparty_node_id: counterparty_node_id)
        guard res.isOk() else {
            guard let error = res.getError() else {
                return handleReject(reject, .channel_close_fail)
            }
            
            switch error.getValueType() {
            case .APIMisuseError:
                return handleReject(reject, .channel_close_fail, nil, error.getValueAsAPIMisuseError()?.getErr())
            case .ChannelUnavailable:
                return handleReject(reject, .channel_close_fail, nil, error.getValueAsChannelUnavailable()?.getErr())
            case .FeeRateTooHigh:
                return handleReject(reject, .channel_close_fail, nil, error.getValueAsFeeRateTooHigh()?.getErr())
            case .IncompatibleShutdownScript:
                return handleReject(reject, .channel_close_fail, nil, Data(error.getValueAsIncompatibleShutdownScript()?.getScript().write() ?? []).hexEncodedString())
            case .RouteError:
                return handleReject(reject, .channel_close_fail, nil, error.getValueAsRouteError()?.getErr())
            default:
                return handleReject(reject, .channel_close_fail)
            }
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
            ldkOutputs.append(TxOut(script_pubkey: (d["script_pubkey"] as! String).hexaBytes, value: d["value"] as! UInt64))
        }
        
        let res = keysManager.spend_spendable_outputs(
            descriptors: ldkDescriptors,
            outputs: ldkOutputs,
            change_destination_script: String(changeDestinationScript).hexaBytes,
            feerate_sat_per_1000_weight: UInt32(feeRate)
        )
        
        guard res.isOk() else {
            return handleReject(reject, .spend_outputs_fail)
        }
        
        return resolve(Data(res.getValue()!).hexEncodedString())
    }

    //MARK: Payments
    @objc
    func decode(_ paymentRequest: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let parsedInvoice = Invoice.from_str(s: String(paymentRequest))
        guard parsedInvoice.isOk(), let invoice = parsedInvoice.getValue()  else {
            let error = parsedInvoice.getError()?.getValueAsParseError()
            return handleReject(reject, .decode_invoice_fail, nil, error?.to_str())
        }

        return resolve(invoice.asJson) //Invoice class extended in Helpers file
    }

    @objc
    func pay(_ paymentRequest: NSString, amountSats: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let invoicePayer = invoicePayer else {
            return handleReject(reject, .init_invoice_payer)
        }

        guard let invoice = Invoice.from_str(s: String(paymentRequest)).getValue() else {
            return handleReject(reject, .decode_invoice_fail)
        }
        
        let isZeroValueInvoice = invoice.amount_milli_satoshis().getValue() == nil
        
        //If it's a zero invoice and we don't have an amount then don't proceed
        guard !(isZeroValueInvoice && amountSats == 0) else {
            return handleReject(reject, .invoice_payment_fail_must_specify_amount)
        }
        
        //Amount was set but not allowed to set own amount
        guard !(amountSats > 0 && !isZeroValueInvoice) else {
            return handleReject(reject, .invoice_payment_fail_must_not_specify_amount)
        }
        
        let res = isZeroValueInvoice ?
                    invoicePayer.pay_zero_value_invoice(invoice: invoice, amount_msats: UInt64(amountSats * 1000)) :
                    invoicePayer.pay_invoice(invoice: invoice)
        if res.isOk() {
            return handleResolve(resolve, .invoice_payment_success)
        }

        guard let error = res.getError() else {
            return handleReject(reject, .invoice_payment_fail_unknown)
        }

        switch error.getValueType() {
        case .Invoice:
            return handleReject(reject, .invoice_payment_fail_invoice, nil, error.getValueAsInvoice())
        case .Routing:
            return handleReject(reject, .invoice_payment_fail_routing, nil, error.getValueAsRouting()?.get_err())
        case .Sending:
            //Multiple sending errors
            guard let sendingError = error.getValueAsSending() else {
                return handleReject(reject, .invoice_payment_fail_sending)
            }

            switch sendingError.getValueType() {
            case .AllFailedRetrySafe:
                return handleReject(reject, .invoice_payment_fail_retry_safe, nil, sendingError.getValueAsAllFailedRetrySafe().map { $0.description } )
            case .ParameterError:
                return handleReject(reject, .invoice_payment_fail_parameter_error, nil, sendingError.getValueAsParameterError().debugDescription)
            case .PartialFailure:
                return handleReject(reject, .invoice_payment_fail_partial, nil, sendingError.getValueAsPartialFailure().debugDescription)
            case .PathParameterError:
                return handleReject(reject, .invoice_payment_fail_path_parameter_error, nil, sendingError.getValueAsPartialFailure().debugDescription)
            default:
                return handleReject(reject, .invoice_payment_fail_sending)
            }
        default:
            return handleReject(reject, .invoice_payment_fail_sending, nil, res.getError().debugDescription)
        }
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
        
        let res = Bindings.swift_create_invoice_from_channelmanager(
            channelmanager: channelManager,
            keys_manager: keysManager.as_KeysInterface(),
            network: ldkCurrency,
            amt_msat: amountSats == 0 ? Option_u64Z.none() : Option_u64Z(value: UInt64(amountSats)),
            description: String(description),
            invoice_expiry_delta_secs: UInt32(expiryDelta)
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

        return handleReject(reject, .invoice_create_failed, nil, "Invoice creation error: \(creationError.rawValue)")
    }

    @objc
    func processPendingHtlcForwards(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }

        channelManager.process_pending_htlc_forwards()

        return handleResolve(resolve, .process_pending_htlc_forwards_success)
    }

    @objc
    func claimFunds(_ paymentPreimage: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        channelManager.claim_funds(payment_preimage: String(paymentPreimage).hexaBytes)
        
        return handleResolve(resolve, .claim_funds_success)
    }

    //MARK: Fetch methods
    @objc
    func version(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let res: [String: String] = [
            "c_bindings": Bindings.swift_ldk_c_bindings_get_compiled_version(),
            "ldk": Bindings.swift_ldk_get_compiled_version(),
        ]

        return resolve(String(data: try! JSONEncoder().encode(res), encoding: .utf8)!)
    }

    @objc
    func nodeId(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }

        return resolve(Data(channelManager.get_our_node_id()).hexEncodedString())
    }

    @objc
    func listPeers(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let peerManager = peerManager else {
            return handleReject(reject, .init_peer_manager)
        }

        return resolve(peerManager.get_peer_node_ids().map { Data($0).hexEncodedString() })
    }

    @objc
    func listChannels(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }

        return resolve(channelManager.list_channels().map { $0.asJson })
    }

    @objc
    func listUsableChannels(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }

        return resolve(channelManager.list_usable_channels().map { $0.asJson })
    }
    
    @objc
    func networkGraphListNodes(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let networkGraph = networkGraph?.read_only() else {
            return handleReject(reject, .init_network_graph)
        }
                
        return resolve(networkGraph.list_nodes().map { Data($0.as_slice()).hexEncodedString() })
    }
    
    @objc
    func networkGraphNode(_ nodeId: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let networkGraph = networkGraph?.read_only() else {
            return handleReject(reject, .init_network_graph)
        }
                
        return resolve(networkGraph.node(node_id: NodeId(pubkey: String(nodeId).hexaBytes)).asJson)
    }
    
    @objc
    func networkGraphListChannels(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let networkGraph = networkGraph?.read_only() else {
            return handleReject(reject, .init_network_graph)
        }
        
        return resolve(networkGraph.list_channels().map { String($0) })
    }
    
    @objc
    func networkGraphChannel(_ shortChannelId: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let networkGraph = networkGraph?.read_only() else {
            return handleReject(reject, .init_network_graph)
        }
        
        return resolve(networkGraph.channel(short_channel_id: UInt64(shortChannelId as String)!).asJson)
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
                resolve(["content": try Data(contentsOf: fileUrl).hexEncodedString(), "timestamp": timestamp])
            } else {
                resolve(["content": try String(contentsOf: fileUrl, encoding: .utf8), "timestamp": timestamp])
            }
        } catch {
            return handleReject(reject, .read_fail, error, "Failed to read \(format) content from file \(fileUrl.path)")
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
