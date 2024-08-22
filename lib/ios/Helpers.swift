//
//  Helpers.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

func handleResolve(_ resolve: RCTPromiseResolveBlock, _ res: LdkCallbackResponses) {
    if res != .log_write_success {
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Success: \(res.rawValue)")
    }
    resolve(res.rawValue)
}

func handleReject(_ reject: RCTPromiseRejectBlock, _ ldkError: LdkErrors, _ error: Error? = nil, _ message: String? = nil) {
    if let error = error as? NSError {
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error: \(error.localizedDescription). Message: '\(message ?? "")'")
        reject(ldkError.rawValue, message ?? error.localizedDescription, error)
        return
    }
    
    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error: \(ldkError.rawValue). Message: '\(message ?? "")'")
    reject(ldkError.rawValue, message ?? ldkError.rawValue, NSError(domain: ldkError.rawValue, code: ldkError.hashValue))
}

/// Loads the cached scorer from disk or creates a new one
/// - Parameters:
///   - path
///   - networkGraph
///   - logger
/// - Returns: ProbabilisticScorer
func getProbabilisticScorer(path: URL, networkGraph: NetworkGraph, logger: LdkLogger) -> ProbabilisticScorer {
    let scoringParams = ProbabilisticScoringDecayParameters.initWithDefault()
    
    var probabalisticScorer: ProbabilisticScorer?
    
    let file = path.appendingPathComponent(LdkFileNames.scorer.rawValue).standardizedFileURL

    //File might be stale and might be part of a previous bug causing it to be corrupted. If older than 1 month just discard it and retrun fresh instance.
    do {
        let fileAttributes = try FileManager.default.attributesOfItem(atPath: file.path)
        if let modificationDate = fileAttributes[.modificationDate] as? Date {
            let oneMonthAgo = Calendar.current.date(byAdding: .month, value: -1, to: Date())!
            if modificationDate < oneMonthAgo {
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Cached scorer older than 1 month. Returning fresh scorer.")
                return ProbabilisticScorer(decayParams: scoringParams, networkGraph: networkGraph, logger: logger)
            }
        }
    } catch {}
    
    if let storedScorer = try? Data(contentsOf: file) {
        let scorerRead = ProbabilisticScorer.read(ser: [UInt8](storedScorer), argA: scoringParams, argB: networkGraph, argC: logger)
        
        if scorerRead.isOk() {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Loaded scorer from disk")
            probabalisticScorer = scorerRead.getValue()
        } else {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Failed to load cached scorer")
        }
    }
    
    //Doesn't exist or error reading it
    if probabalisticScorer == nil {
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Starting scorer from scratch")
        probabalisticScorer = ProbabilisticScorer(decayParams: scoringParams, networkGraph: networkGraph, logger: logger)
    }
        
    return probabalisticScorer!
}

extension Bolt11Invoice {
    var asJson: [String: Any?] {
        //Break down to get the decription. Will crash if all on a single line.
        let signedRawInvoice = intoSignedRaw()
        let rawInvoice = signedRawInvoice.rawInvoice()
        let description = rawInvoice.description()?.intoInner().getA() ?? ""
        
        return [
            "amount_satoshis": amountMilliSatoshis() != nil ? amountMilliSatoshis()! / 1000 : nil,
            "description": description,
            "check_signature": checkSignature().isOk(),
            "is_expired": isExpired(),
            "duration_since_epoch": durationSinceEpoch(),
            "expiry_time": expiryTime(),
            "min_final_cltv_expiry": minFinalCltvExpiryDelta(),
            "payee_pub_key": Data(payeePubKey() ?? []).hexEncodedString(),
            "recover_payee_pub_key": Data(recoverPayeePubKey()).hexEncodedString(),
            "payment_hash": Data(paymentHash() ?? []).hexEncodedString(),
            "payment_secret": Data(paymentSecret() ?? []).hexEncodedString(),
            "timestamp": timestamp(),
            "features": Data(features()?.write() ?? []).hexEncodedString(),
            "currency": currencyString(currency()),
            "to_str": toStr(),
            "route_hints": routeHints().map({ $0.getA().map({ $0.asJson }) }),
        ]
    }
}

extension RouteHintHop {
    var asJson: [String: Any] {
        return [
            "src_node_id": Data(getSrcNodeId()).hexEncodedString(),
            "short_channel_id": String(getShortChannelId())
        ]
    }
}

//Our own channels
extension ChannelDetails {
    var asJson: [String: Any] {
        let shortChannelId = getShortChannelId() != nil ? String(getShortChannelId()!) : ""
        
        return [
            "channel_id": Data(getChannelId().getA() ?? []).hexEncodedString(),
            "is_public": getIsPublic(),
            "is_usable": getIsUsable(),
            "is_channel_ready": getIsChannelReady(),
            "is_outbound": getIsOutbound(),
            "balance_sat": getBalanceMsat() / 1000,
            "counterparty_node_id": Data(getCounterparty().getNodeId()).hexEncodedString(),
            "funding_txid": Data(getFundingTxo()?.getTxid()?.reversed() ?? []).hexEncodedString(),
            "funding_output_index": getFundingTxo()?.getIndex() as Any, // Optional number
            "channel_type": Data(getChannelType()?.write() ?? []).hexEncodedString(),
            "user_channel_id": Data(getUserChannelId()).hexEncodedString(), //String
            "confirmations_required": getConfirmationsRequired() as Any, // Optional number
            "short_channel_id": shortChannelId,
            "inbound_scid_alias": getInboundScidAlias() != nil ? String(getInboundScidAlias()!) : shortChannelId, //String
            "inbound_payment_scid": getInboundPaymentScid() != nil ? String(getInboundPaymentScid()!) : "", //String,
            "inbound_capacity_sat": getInboundCapacityMsat() / 1000,
            "outbound_capacity_sat": getOutboundCapacityMsat() / 1000,
            "channel_value_satoshis": getChannelValueSatoshis(),
            "force_close_spend_delay": getForceCloseSpendDelay() as Any, //Optional number
            "unspendable_punishment_reserve": getUnspendablePunishmentReserve() as Any, //Optional number
            "config_forwarding_fee_base_msat": getConfig()?.getForwardingFeeBaseMsat() ?? 0, //Optional number
            "config_forwarding_fee_proportional_millionths": getConfig()?.getForwardingFeeProportionalMillionths() ?? 0 / 1000, //Optional number
            "confirmations": getConfirmations() ?? 0
        ]
    }
}

//Channels in our network graph
extension ChannelInfo {
    var asJson: [String: Any] {
        return [
            "capacity_sats": getCapacitySats() as Any, //Optional number
            "node_one": Data(getNodeOne().asSlice()).hexEncodedString(), //String
            "node_two": Data(getNodeTwo().asSlice()).hexEncodedString(), //String
            
            "one_to_two_fees_base_sats": getOneToTwo()?.getFees().getBaseMsat() ?? 0 / 1000, //Number
            "one_to_two_fees_proportional_millionths": getOneToTwo()?.getFees().getProportionalMillionths() ?? 0, //Number
            "one_to_two_enabled": getOneToTwo()?.getEnabled() ?? false, //Bool
            "one_to_two_last_update": getOneToTwo()?.getLastUpdate() ?? 0, //Number
            "one_to_two_htlc_maximum_sats": getOneToTwo()?.getHtlcMaximumMsat() ?? 0 / 1000, //Number
            "one_to_two_htlc_minimum_sats": getOneToTwo()?.getHtlcMinimumMsat() ?? 0 / 1000, //Number
            
            "two_to_one_fees_base_sats": getTwoToOne()?.getFees().getBaseMsat() ?? 0 / 1000, //Number
            "two_to_one_fees_proportional_millionths": getTwoToOne()?.getFees().getProportionalMillionths() ?? 0, //Number
            "two_to_one_enabled": getTwoToOne()?.getEnabled() ?? false, //Bool
            "two_to_one_last_update": getTwoToOne()?.getLastUpdate() ?? 0, //Number
            "two_to_one_htlc_maximum_sats": getTwoToOne()?.getHtlcMaximumMsat() ?? 0 / 1000, //Number
            "two_to_one_htlc_minimum_sats": getTwoToOne()?.getHtlcMinimumMsat() ?? 0 / 1000, //Number
        ]
    }
}

//Nodes in our network graph
extension NodeInfo {
    
    var asJson: [String: Any] {
        return [
            "shortChannelIds": getChannels().map({ String($0) }),
            "announcement_info_last_update": Int(getAnnouncementInfo()?.getLastUpdate() ?? 0) * 1000
        ]
    }
}

extension LightningDevKit.RouteHop {
    var asJson: [String: Any] {
        return [
            "pubkey": Data(getPubkey()).hexEncodedString(),
            "fee_sat": getFeeMsat() / 1000,
            "short_channel_id": String(getShortChannelId()),
            "cltv_expiry_delta": getCltvExpiryDelta()
        ]
    }
}

extension ChannelMonitor {
    func asJson(channelId: String) -> [String: Any?] {
        return [
            "channel_id": channelId,
            "funding_txo_index": getFundingTxo().0.getIndex(),
            "funding_txo_txid": Data(getFundingTxo().0.getTxid()?.reversed() ?? []).hexEncodedString(),
            "counterparty_node_id": Data(getCounterpartyNodeId() ?? []).hexEncodedString(),
            "claimable_balances": getClaimableBalances().map({ $0.asJson })
        ]
    }
}

extension Data {
    struct HexEncodingOptions: OptionSet {
        let rawValue: Int
        static let upperCase = HexEncodingOptions(rawValue: 1 << 0)
    }
    
    func hexEncodedString(options: HexEncodingOptions = []) -> String {
        let format = options.contains(.upperCase) ? "%02hhX" : "%02hhx"
        return map { String(format: format, $0) }.joined()
    }
}

extension StringProtocol {
    var hexaData: Data { .init(hexa) }
    var hexaBytes: [UInt8] { .init(hexa) }
    private var hexa: UnfoldSequence<UInt8, Index> {
        sequence(state: startIndex) { startIndex in
            guard startIndex < endIndex else { return nil }
            let endIndex = index(startIndex, offsetBy: 2, limitedBy: endIndex) ?? endIndex
            defer { startIndex = endIndex }
            return UInt8(self[startIndex..<endIndex], radix: 16)
        }
    }
}

//MARK: Module can be initialised on main thread as LDK handles all it's own tasks on background threads  (https://reactnative.dev/docs/native-modules-ios#implementing--requiresmainqueuesetup)
extension Ldk {
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

extension LdkEventEmitter {
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

extension String: Error {}

extension URL {
    func downloadTask(destination: URL, completion: @escaping (Error?) -> Void) -> URLSessionDataTask? {
        if FileManager().fileExists(atPath: destination.path) {
            completion(NSError(domain: "", code: 500, userInfo: [ NSLocalizedDescriptionKey: "File already exists"]))
            return nil
        }
        
        let session = URLSession(configuration: URLSessionConfiguration.default, delegate: nil, delegateQueue: nil)
        var request = URLRequest(url: self)
        request.httpMethod = "GET"
        return session.dataTask(with: request, completionHandler: { data, response, error in
            guard error == nil else {
                return completion(error)
            }
            
            guard let response = response as? HTTPURLResponse, let data = data else {
                return completion(NSError(domain: "", code: 500, userInfo: [ NSLocalizedDescriptionKey: "Failed to get HTTP response"]))
            }
            
            guard response.statusCode == 200 else {
                return completion(NSError(domain: "", code: response.statusCode, userInfo: [ NSLocalizedDescriptionKey: "Download failed from \(self) with status (\(response.statusCode))"]))
            }
            
            do {
                try data.write(to: destination, options: Data.WritingOptions.atomic)
                return completion(nil)
            } catch {
                return completion(error)
            }
        })
    }
}

extension RapidGossipSync {
    func downloadAndUpdateGraph(downloadUrl: String, tempStoragePath: URL, timestamp: UInt32, completion: @escaping (Error?) -> Void) {
        let destinationFile = tempStoragePath.appendingPathComponent("\(timestamp).bin")
        
        //Cleanup old one
        if FileManager().fileExists(atPath: destinationFile.path) {
            try? FileManager().removeItem(atPath: destinationFile.path)
        }
        
        let url = URL(string: "\(downloadUrl)\(timestamp)")!
        
        let task = url.downloadTask(destination: destinationFile) { [weak self] error in
            if let error = error {
                return completion(error)
            }
            
            guard let self = self else { return }
            
            let res = self.updateNetworkGraph(updateData: [UInt8](try! Data(contentsOf: destinationFile)))
            guard res.isOk() else {
                var errorMessage = "Failed to update network graph."
                switch res.getError()?.getValueType() {
                case .LightningError:
                    errorMessage = "Rapid sync LightningError. \(res.getError()!.getValueAsLightningError()!.getErr())" //Couldn't find channel for update.
                    break;
                case .DecodeError:
                    errorMessage = "Rapid sync DecodeError. IO error: \(res.getError()!.getValueAsDecodeError()?.getValueType())"
                    break;
                default:
                    errorMessage = "Unknown rapid sync error."
                    break;
                }
                
                completion(NSError(domain: "", code: 500, userInfo: [ NSLocalizedDescriptionKey: errorMessage]))
                try? FileManager().removeItem(atPath: destinationFile.path)
                return
            }
            
            completion(nil)
            try? FileManager().removeItem(atPath: destinationFile.path)
        }
        
        task?.resume()
    }
}

extension ChannelHandshakeConfig {
    static func initWithDictionary(_ obj: NSDictionary?) -> ChannelHandshakeConfig {
        let defaults = ChannelHandshakeConfig.initWithDefault()
        
        guard let obj = obj else {
            return defaults
        }
        
        return ChannelHandshakeConfig(
            minimumDepthArg: obj["minimum_depth"] as? UInt32 ?? defaults.getMinimumDepth(),
            ourToSelfDelayArg: obj["our_to_self_delay"] as? UInt16 ?? defaults.getOurToSelfDelay(),
            ourHtlcMinimumMsatArg: obj["our_htlc_minimum_msat"] as? UInt64 ?? defaults.getOurHtlcMinimumMsat(),
            maxInboundHtlcValueInFlightPercentOfChannelArg: obj["max_htlc_value_in_flight_percent_of_channel"] as? UInt8 ?? defaults.getMaxInboundHtlcValueInFlightPercentOfChannel(),
            negotiateScidPrivacyArg: obj["negotiate_scid_privacy"] as? Bool ?? defaults.getNegotiateScidPrivacy(),
            announcedChannelArg: obj["announced_channel"] as? Bool ?? defaults.getAnnouncedChannel(),
            commitUpfrontShutdownPubkeyArg: obj["commit_upfront_shutdown_pubkey"] as? Bool ?? defaults.getCommitUpfrontShutdownPubkey(),
            theirChannelReserveProportionalMillionthsArg: obj["their_channel_reserve_proportional_millionths"] as? UInt32 ?? defaults.getTheirChannelReserveProportionalMillionths(),
            negotiateAnchorsZeroFeeHtlcTxArg: obj["negotiate_anchors_zero_fee_htlc_tx"] as? Bool ?? defaults.getNegotiateAnchorsZeroFeeHtlcTx(),
            ourMaxAcceptedHtlcsArg: obj["our_max_accepted_htlcs_arg"] as? UInt16 ?? defaults.getOurMaxAcceptedHtlcs()
        )
    }
}

extension ChannelHandshakeLimits {
    static func initWithDictionary(_ obj: NSDictionary?) -> ChannelHandshakeLimits {
        let defaults = ChannelHandshakeLimits.initWithDefault()
        
        guard let obj = obj else {
            return defaults
        }
        
        return ChannelHandshakeLimits(
            minFundingSatoshisArg: obj["min_funding_satoshis"] as? UInt64 ?? defaults.getMinFundingSatoshis(),
            maxFundingSatoshisArg: obj["max_funding_satoshis"] as? UInt64 ?? defaults.getMaxFundingSatoshis(),
            maxHtlcMinimumMsatArg: obj["max_htlc_minimum_msat"] as? UInt64 ?? defaults.getMaxHtlcMinimumMsat(),
            minMaxHtlcValueInFlightMsatArg: obj["min_max_htlc_value_in_flight_msat"] as? UInt64 ?? defaults.getMinMaxHtlcValueInFlightMsat(),
            maxChannelReserveSatoshisArg: obj["max_channel_reserve_satoshis"] as? UInt64 ?? defaults.getMaxChannelReserveSatoshis(),
            minMaxAcceptedHtlcsArg: obj["min_max_accepted_htlcs"] as? UInt16 ?? defaults.getMinMaxAcceptedHtlcs(),
            maxMinimumDepthArg: obj["max_minimum_depth"] as? UInt32 ?? defaults.getMaxMinimumDepth(),
            trustOwnFunding0confArg: obj["trust_own_funding_0conf"] as? Bool ?? defaults.getTrustOwnFunding0conf(),
            forceAnnouncedChannelPreferenceArg: obj["force_announced_channel_preference"] as? Bool ?? defaults.getForceAnnouncedChannelPreference(),
            theirToSelfDelayArg: obj["their_to_self_delay"] as? UInt16 ?? defaults.getTheirToSelfDelay()
        )
    }
}

extension ChannelConfig {
    static func initWithDictionary(_ obj: NSDictionary?) -> ChannelConfig {
        let defaults = ChannelConfig.initWithDefault()
        
        guard let obj = obj else {
            return defaults
        }
        
        var maxDustHtlcExposureArg = defaults.getMaxDustHtlcExposure()
        if let dustLimitExposure = obj["max_dust_htlc_exposure"] as? UInt64 {
            if obj["max_dust_htlc_exposure_type"] as? String == "fixed_limit" {
                maxDustHtlcExposureArg = .initWithFixedLimitMsat(a: dustLimitExposure)
            } else if obj["max_dust_htlc_exposure_type"] as? String == "fee_rate_multiplier" {
                maxDustHtlcExposureArg = .initWithFeeRateMultiplier(a: dustLimitExposure)
            }
        }
        
        return ChannelConfig(
            forwardingFeeProportionalMillionthsArg: obj["forwarding_fee_proportional_millionths"] as? UInt32 ?? defaults.getForwardingFeeProportionalMillionths(),
            forwardingFeeBaseMsatArg: obj["forwarding_fee_proportional_millionths"] as? UInt32 ?? defaults.getForwardingFeeProportionalMillionths(),
            cltvExpiryDeltaArg: obj["cltv_expiry_delta"] as? UInt16 ?? defaults.getCltvExpiryDelta(),
            maxDustHtlcExposureArg: maxDustHtlcExposureArg,
            forceCloseAvoidanceMaxFeeSatoshisArg: obj["force_close_avoidance_max_fee_satoshis"] as? UInt64 ?? defaults.getForceCloseAvoidanceMaxFeeSatoshis(),
            acceptUnderpayingHtlcsArg: obj["accept_underpaying_htlcs"] as? Bool ?? defaults.getAcceptUnderpayingHtlcs()
        )
    }
}

extension UserConfig {
    static func initWithDictionary(_ obj: NSDictionary) -> UserConfig {
        let defaults = UserConfig.initWithDefault()
        
        let userConfig = UserConfig(
            channelHandshakeConfigArg: .initWithDictionary(obj["channel_handshake_config"] as? NSDictionary),
            channelHandshakeLimitsArg: .initWithDictionary(obj["channel_handshake_limits"] as? NSDictionary),
            channelConfigArg: .initWithDictionary(obj["channel_config"] as? NSDictionary),
            acceptForwardsToPrivChannelsArg: obj["accept_forwards_to_priv_channels"] as? Bool ?? defaults.getAcceptForwardsToPrivChannels(),
            acceptInboundChannelsArg: obj["accept_inbound_channels"] as? Bool ?? defaults.getAcceptInboundChannels(),
            manuallyAcceptInboundChannelsArg: obj["manually_accept_inbound_channels"] as? Bool ?? defaults.getAcceptInboundChannels(),
            acceptInterceptHtlcsArg: obj["accept_intercept_htlcs"] as? Bool ?? defaults.getAcceptInterceptHtlcs(),
            acceptMppKeysendArg: obj["accept_mpp_keysend"] as? Bool ?? defaults.getAcceptMppKeysend()
        )
        
        return userConfig
    }
}

extension Balance {
    var asJson: [String: Any] {
        switch getValueType() {
        case .ClaimableAwaitingConfirmations:
            let b = getValueAsClaimableAwaitingConfirmations()!
            return [
                "amount_satoshis": b.getAmountSatoshis(),
                "confirmation_height": b.getConfirmationHeight(),
                "type": "ClaimableAwaitingConfirmations"
            ] as [String : Any]
        case .ClaimableOnChannelClose:
            let b = getValueAsClaimableOnChannelClose()!
            return [
                "amount_satoshis": b.getAmountSatoshis(),
                "type": "ClaimableOnChannelClose",
            ] as [String : Any]
        case .ContentiousClaimable:
            let b = getValueAsContentiousClaimable()!
            return [
                "amount_satoshis": b.getAmountSatoshis(),
                "timeout_height": b.getTimeoutHeight(),
                "type": "ContentiousClaimable"
            ] as [String : Any]
        case .CounterpartyRevokedOutputClaimable:
            let b = getValueAsCounterpartyRevokedOutputClaimable()!
            return [
                "amount_satoshis": b.getAmountSatoshis(),
                "type": "CounterpartyRevokedOutputClaimable"
            ] as [String : Any]
        case .MaybePreimageClaimableHTLC:
            let b = getValueAsMaybePreimageClaimableHtlc()!
            return [
                "amount_satoshis": b.getAmountSatoshis(),
                "expiry_height": b.getExpiryHeight(),
                "type": "MaybePreimageClaimableHTLC"
            ] as [String : Any]
        case .MaybeTimeoutClaimableHTLC:
            let b = getValueAsMaybeTimeoutClaimableHtlc()!
            return [
                "amount_satoshis": b.getAmountSatoshis(),
                "claimable_height": b.getClaimableHeight(),
                "type": "MaybeTimeoutClaimableHTLC"
            ] as [String : Any]
        default:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unknown balance type type in claimableBalances() \(getValueType())")
            return ["amount_satoshis": 0, "type": "Unknown"] as [String : Any]
        }
    }
}

extension ChainMonitor {
    func getClaimableBalancesAsJson(ignoredChannels: [Bindings.ChannelDetails]) -> [[String: Any]] {
        var result: [[String: Any]] = []

        let claimableBalances = self.getClaimableBalances(ignoredChannels: ignoredChannels)
        for balance in claimableBalances {
            result.append(balance.asJson)
        }
        
        return result
    }
}

/// Helper for returning real network and currency as a tuple from a string
/// - Parameter network: network name from JS
/// - Returns: network and currency tuple
func getNetwork(_ network: String) -> (Network, Currency)? {
    switch network {
    case "bitcoin":
        return (Network.Bitcoin, Currency.Bitcoin)
    case "testnet":
        return (Network.Testnet, Currency.BitcoinTestnet)
    case "regtest":
        return (Network.Regtest, Currency.Regtest)
    case "signet":
        return (Network.Signet, Currency.Signet)
    default:
        return nil
    }
}

func currencyString(_ currency: Currency) -> String {
    switch currency {
    case .Bitcoin:
        return "Bitcoin"
    case .BitcoinTestnet:
        return "BitcoinTestnet"
    case .Regtest:
        return "Regtest"
    case .Simnet:
        return "Simnet"
    case .Signet:
        return "Signet"
    @unknown default:
        return "Unknown"
    }
}

func mergeObj(_ obj1: [String: Any], _ obj2: [String: Any]) -> [String: Any] {
    var newObj = obj1
    obj2.keys.forEach { key in
        newObj[key] = obj2[key]
    }
    return newObj
}

extension String {
    var withoutEmojis: String {
        unicodeScalars
            .filter { !$0.properties.isEmojiPresentation }
            .reduce("") { $0 + String($1) }
    }
}

var lastPendingWorkItems: [String: DispatchWorkItem] = [:]

func debounce(interval: TimeInterval, key: String, queue: DispatchQueue = .main, action: @escaping (() -> Void)) -> () -> Void {
    var lastFireTime = DispatchTime.now()
    
    return {
        lastPendingWorkItems.first { $0.key == key }?.value.cancel()

        lastPendingWorkItems[key] = DispatchWorkItem {
            let elapsed = DispatchTime.now().uptimeNanoseconds - lastFireTime.uptimeNanoseconds
            if elapsed >= UInt64(interval * 1_000_000) {
                action()
                lastFireTime = DispatchTime.now()
            }
        }

        queue.asyncAfter(deadline: .now() + interval, execute: lastPendingWorkItems[key]!)
    }
}
