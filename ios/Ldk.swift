import LDKFramework
import Darwin

//MARK: ************Replicate in typescript and kotlin************
enum EventTypes: String, CaseIterable {
    case ldk_log = "ldk_log"
    case swift_log = "swift_log"
    case register_tx = "register_tx"
    case register_output = "register_output"
    case broadcast_transaction = "broadcast_transaction"
    case persist_manager = "persist_manager"
    case persist_new_channel = "persist_new_channel"
    case persist_graph = "persist_graph"
    case update_persisted_channel = "update_persisted_channel"
    
    //>>LdkChannelManagerPersister.handle_event()
    case channel_manager_funding_generation_ready = "channel_manager_funding_generation_ready"
    case channel_manager_payment_received = "channel_manager_payment_received"
    case channel_manager_payment_sent = "channel_manager_payment_sent"
    case channel_manager_open_channel_request = "channel_manager_open_channel_request"
    case channel_manager_payment_path_successful = "channel_manager_payment_path_successful"
    case channel_manager_payment_path_failed = "channel_manager_payment_path_failed"
    case channel_manager_payment_failed = "channel_manager_payment_failed"
    case channel_manager_spendable_outputs = "channel_manager_spendable_outputs"
    case channel_manager_channel_closed = "channel_manager_channel_closed"
    case channel_manager_discard_funding = "channel_manager_discard_funding"
    //<<
}
//*****************************************************************

enum LdkErrors: String {
    case unknown_error = "unknown_error"
    case already_init = "already_init"
    case invalid_seed_hex = "invalid_seed_hex"
    case init_chain_monitor = "init_chain_monitor"
    case init_keys_manager = "init_keys_manager"
    case init_user_config = "init_user_config"
    case init_peer_manager = "init_peer_manager"
    case invalid_network = "invalid_network"
    case load_channel_monitors = "load_channel_monitors"
    case init_channel_monitor = "init_channel_monitor"
    case init_network_graph = "init_network_graph"
    case init_peer_handler = "init_peer_handler"
    case add_peer_fail = "add_peer_fail"
    case init_channel_manager = "init_channel_manager"
    case decode_invoice_fail = "decode_invoice_fail"
    case init_invoice_payer = "init_invoice_payer"
    case invoice_payment_fail = "invoice_payment_fail"
    case init_ldk_currency = "init_ldk_currency"
    case invoice_create_failed = "invoice_create_failed"
}

enum LdkCallbackResponses: String {
    case fees_updated = "fees_updated"
    case log_level_updated = "log_level_updated"
    case chain_monitor_init_success = "chain_monitor_init_success"
    case keys_manager_init_success = "keys_manager_init_success"
    case channel_manager_init_success = "channel_manager_init_success"
    case load_channel_monitors_success = "load_channel_monitors_success"
    case config_init_success = "config_init_success"
    case net_graph_msg_handler_init_success = "net_graph_msg_handler_init_success"
    case chain_monitor_updated = "chain_monitor_updated"
    case network_graph_init_success = "network_graph_init_success"
    case add_peer_success = "add_peer_success"
    case chain_sync_success = "chain_sync_success"
    case invoice_payment_success = "invoice_payment_success"
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
    lazy var scorer = {MultiThreadedLockableScore(score: Scorer().as_Score())}()
    
    //Config required to setup below objects
    var chainMonitor: ChainMonitor?
    var keysManager: KeysManager?
    var channelManager: ChannelManager?
    var userConfig: UserConfig?
    var channelMonitors: Array<[UInt8]>?
    var networkGraph: NetworkGraph?
    var peerManager: PeerManager?
    var peerHandler: TCPPeerHandler?
    var channelManagerConstructor: ChannelManagerConstructor?
    var invoicePayer: InvoicePayer?
    var ldkNetwork: LDKNetwork?
    var ldkCurrency: LDKCurrency?
    
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
    
    @objc
    func initConfig(_ acceptInboundChannels: Bool, manuallyAcceptInboundChannels: Bool, announcedChannels: Bool, minChannelHandshakeDepth: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard userConfig == nil else {
            return handleReject(reject, .already_init)
        }
    
        userConfig = UserConfig()
        userConfig!.set_accept_inbound_channels(val: acceptInboundChannels)
        userConfig!.set_manually_accept_inbound_channels(val: manuallyAcceptInboundChannels)
        
        let channelConfig = ChannelConfig()
        channelConfig.set_announced_channel(val: announcedChannels)
        
        let channelHandshakeConfig = ChannelHandshakeConfig()
        channelHandshakeConfig.set_minimum_depth(val: UInt32(minChannelHandshakeDepth))
        userConfig!.set_own_channel_config(val: channelHandshakeConfig)
        
        let channelHandshakeLimits = ChannelHandshakeLimits()
        channelHandshakeLimits.set_force_announced_channel_preference(val: announcedChannels)
        userConfig!.set_peer_channel_config_limits(val: channelHandshakeLimits)
        
        handleResolve(resolve, .config_init_success)
    }
    
    @objc
    func initNetworkGraph(_ genesisHash: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        networkGraph = NetworkGraph(genesis_hash: String(genesisHash).hexaBytes.reversed())
        //TODO load cached version if exists instead. NetworkGraph.read(ser: serialized_backup)
        
        handleResolve(resolve, .network_graph_init_success)
    }
    
    @objc
    func initChannelManager(_ network: NSString, serializedChannelManager: NSString, blockHash: NSString, blockHeight: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
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
        
        guard let channelMonitors = channelMonitors else {
            return handleReject(reject, .load_channel_monitors)
        }
        
        guard let networkGraph = networkGraph else {
            return handleReject(reject, .init_network_graph)
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
        
        do {
            if channelMonitors.count == 0 {
                //New node
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
                    logger: logger
                )
            } else {
                //Restoring node
                // MARK: Untested code
                print("Untested node restore:")
                channelManagerConstructor = try ChannelManagerConstructor(
                    channel_manager_serialized: String(serializedChannelManager).hexaBytes,
                    channel_monitors_serialized: channelMonitors,
                    keys_interface: keysManager.as_KeysInterface(),
                    fee_estimator: feeEstimator,
                    chain_monitor: chainMonitor,
                    filter: filter,
                    net_graph_serialized: nil, //TODO
                    tx_broadcaster: broadcaster,
                    logger: logger
                )
            }
        } catch {
            return handleReject(reject, .init_channel_monitor, error)
        }
        
        channelManager = channelManagerConstructor!.channelManager
        self.networkGraph = channelManagerConstructor!.net_graph

        channelManagerConstructor!.chain_sync_completed(persister: channelManagerPersister, scorer: scorer)
        peerManager = channelManagerConstructor!.peerManager

        peerHandler = channelManagerConstructor!.getTCPPeerHandler()
        invoicePayer = channelManagerConstructor!.payer
        
        handleResolve(resolve, .channel_manager_init_success)
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
    
    //MARK: Update methods
    
    @objc
    func updateFees(_ high: NSInteger, normal: NSInteger, low: NSInteger, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        feeEstimator.update(high: UInt32(high), normal: UInt32(normal), low: UInt32(low))
        handleResolve(resolve, .fees_updated)
    }
    
    @objc
    func setLogLevel(_ level: NSInteger, active: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        logger.setLevel(level: UInt32(level), active: active)
        handleResolve(resolve, .log_level_updated)
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
        
        handleResolve(resolve, .chain_sync_success)
    }
    
    
    @objc
    func addPeer(_ address: NSString, port: NSInteger, pubKey: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        //Sync ChannelMonitors and ChannelManager to chain tip
        guard let peerHandler = peerHandler else {
            return handleReject(reject, .init_peer_handler)
        }
               
        let res = peerHandler.connect(address: String(address), port: UInt16(port), theirNodeId: String(pubKey).hexaBytes)
        if !res {
            return handleReject(reject, .add_peer_fail)
        }
        
        handleResolve(resolve, .add_peer_success)
    }
    
    //MARK: Payments
    @objc
    func decode(_ paymentRequest: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let parsedInvoice = Invoice.from_str(s: String(paymentRequest))
        guard parsedInvoice.isOk(), let invoice = parsedInvoice.getValue()  else {
            let error = parsedInvoice.getError()?.getValueAsParseError()
            return handleReject(reject, .decode_invoice_fail, nil, error?.to_str())
        }
                        
        resolve(invoice.asJson) //Invoice class extended in Helpers file
    }
    
    @objc
    func pay(_ paymentRequest: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let invoicePayer = invoicePayer else {
            return handleReject(reject, .init_invoice_payer)
        }
        
        guard let invoice = Invoice.from_str(s: String(paymentRequest)).getValue() else {
            return handleReject(reject, .decode_invoice_fail)
        }
        
        let res = invoicePayer.pay_invoice(invoice: invoice)
        if res.isOk() {
            handleResolve(resolve, .invoice_payment_success)
        }
        
        guard let error = res.getError() else {
            return handleReject(reject, .invoice_payment_fail)
        }
        
        switch error.getValueType() {
        case .Invoice:
            return handleReject(reject, .invoice_payment_fail, nil, error.getValueAsInvoice())
        case .Routing:
            return handleReject(reject, .invoice_payment_fail, nil, error.getValueAsRouting()?.get_err())
        case .Sending:
            //Multiple sending errors
            guard let sendingError = error.getValueAsSending() else {
                return handleReject(reject, .invoice_payment_fail)
            }
            
            switch sendingError.getValueType() {
            case .AllFailedRetrySafe:
                return handleReject(reject, .invoice_payment_fail, nil, sendingError.getValueAsAllFailedRetrySafe().map { $0.description } )
            case .ParameterError:
                return handleReject(reject, .invoice_payment_fail, nil, sendingError.getValueAsParameterError().debugDescription)
            case .PartialFailure:
                return handleReject(reject, .invoice_payment_fail, nil, sendingError.getValueAsPartialFailure().debugDescription)
            default:
                return handleReject(reject, .invoice_payment_fail)
            }
        default:
            return handleReject(reject, .invoice_payment_fail, nil, res.getError().debugDescription)
        }
    }
    
    @objc
    func createPaymentRequest(_ amountSats: NSInteger, description: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
        
        guard let keysManager = keysManager else {
            return handleReject(reject, .init_keys_manager)
        }
        
        guard let ldkCurrency = ldkCurrency else {
            return handleReject(reject, .init_ldk_currency)
        }
        
        let res = Bindings.createInvoiceFromChannelManager(
            channelManager: channelManager,
            keysManager: keysManager.as_KeysInterface(),
            network: ldkCurrency,
            amountMsat: UInt64(amountSats),
            description: String(description)
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
            return handleReject(reject, .init_channel_manager)
        }
        
        resolve(Data(channelManager.get_our_node_id()).hexEncodedString())
    }
    
    @objc
    func listPeers(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        //Sync ChannelMonitors and ChannelManager to chain tip
        guard let peerManager = peerManager else {
            return handleReject(reject, .init_peer_manager)
        }
        
        resolve(peerManager.get_peer_node_ids().map { Data($0).hexEncodedString() })
    }
    
    @objc
    func listChannels(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        //Sync ChannelMonitors and ChannelManager to chain tip
        guard let channelManager = channelManager else {
            return handleReject(reject, .init_channel_manager)
        }
                
        resolve(channelManager.list_channels().map { [
            "channel_id": Data($0.get_channel_id()).hexEncodedString(),
            "is_public": $0.get_is_public(),
            "is_usable": $0.get_is_usable(),
            "is_outbound": $0.get_is_outbound(),
            "balance_msat": $0.get_balance_msat(),
            "counterparty": Data($0.get_counterparty().write()).hexEncodedString(),
            "funding_txo": Data($0.get_funding_txo()?.write() ?? []).hexEncodedString(),
            "channel_type": Data($0.get_channel_type().write()).hexEncodedString(),
            "user_channel_id": $0.get_user_channel_id(), //Number
            "confirmations_required": $0.get_confirmations_required().getValue() as Any, // Optional number
            "short_channel_id": $0.get_short_channel_id().getValue() as Any, //Optional number
            "is_funding_locked": $0.get_is_funding_locked(), //Bool
            "inbound_scid_alias": $0.get_inbound_scid_alias().getValue() as Any, //Optional number
            "get_inbound_payment_scid": $0.get_inbound_payment_scid().getValue() as Any, //Optional number,
            "inbound_capacity_msat": $0.get_inbound_capacity_msat(),
            "channel_value_satoshis": $0.get_channel_value_satoshis(),
            "outbound_capacity_msat": $0.get_outbound_capacity_msat(),
            "force_close_spend_delay": $0.get_force_close_spend_delay().getValue() as Any, //Optional number
            "unspendable_punishment_reserve": $0.get_unspendable_punishment_reserve().getValue() as Any //Optional number
        ] })
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
