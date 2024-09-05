//
//  LdkChannelManagerPersister.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkChannelManagerPersister: Persister, ExtendedChannelManagerPersister {
    //Custom function to manage any unlikely missing info from the event object
    func handleEventError(_ event: Event) {
        LdkEventEmitter.shared.send(
            withEvent: .native_log,
            body: "Error missing details for handle_event of type \(event.getValueType())"
        )
    }

    func handleEvent(event: Event) {
        // Follows ldk-sample event handling structure
        // https://github.com/lightningdevkit/ldk-sample/blob/c0a722430b8fbcb30310d64487a32aae839da3e8/src/main.rs#L600
        switch event.getValueType() {
        case .FundingGenerationReady:
            guard let fundingGeneration = event.getValueAsFundingGenerationReady() else {
                return handleEventError(event)
            }
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_funding_generation_ready,
                body: [
                    "temp_channel_id": Data(fundingGeneration.getTemporaryChannelId().getA() ?? []).hexEncodedString(),
                    "output_script": Data(fundingGeneration.getOutputScript()).hexEncodedString(),
                    "user_channel_id": Data(fundingGeneration.getUserChannelId()).hexEncodedString(),
                    "value_satoshis": fundingGeneration.getChannelValueSatoshis(),
                ]
            )
            return
        case .PaymentClaimable:
            guard let paymentClaimable = event.getValueAsPaymentClaimable() else {
                return handleEventError(event)
            }

            let paymentPreimage = paymentClaimable.getPurpose().getValueAsBolt11InvoicePayment()?.getPaymentPreimage()
            let paymentSecret = paymentClaimable.getPurpose().getValueAsBolt11InvoicePayment()?.getPaymentSecret()
            let spontaneousPayment = paymentClaimable.getPurpose().getValueAsSpontaneousPayment()

            let body: [String: Encodable] = [
                "payment_hash": Data(paymentClaimable.getPaymentHash()).hexEncodedString(),
                "amount_sat": paymentClaimable.getAmountMsat() / 1000,
                "payment_preimage": Data(paymentPreimage ?? []).hexEncodedString(),
                "payment_secret": Data(paymentSecret ?? []).hexEncodedString(),
                "spontaneous_payment_preimage": Data(spontaneousPayment ?? []).hexEncodedString(),
                "unix_timestamp": Int(Date().timeIntervalSince1970),
                "state": "pending"
            ]

            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_claimable,
                body: body
            )

            //Save to disk for TX history
            persistPaymentClaimed(body)
            return
        case .PaymentSent:
            guard let paymentSent = event.getValueAsPaymentSent() else {
                return handleEventError(event)
            }

            let body: [String: Encodable] = [
                "payment_id": Data(paymentSent.getPaymentId() ?? []).hexEncodedString(),
                "payment_preimage": Data(paymentSent.getPaymentPreimage()).hexEncodedString(),
                "payment_hash": Data(paymentSent.getPaymentHash()).hexEncodedString(),
                "fee_paid_sat": (paymentSent.getFeePaidMsat() ?? 0) / 1000,
                "unix_timestamp": Int(Date().timeIntervalSince1970),
                "state": "successful"
            ]

            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_sent,
                body: body
            )

            //Save to disk for tx history
            persistPaymentSent(body)
            return
        case .OpenChannelRequest:
            //Use if we ever manually accept inbound channels. Setting in initConfig.
            guard let openChannelRequest = event.getValueAsOpenChannelRequest() else {
                return handleEventError(event)
            }
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_open_channel_request,
                body: [
                    "temp_channel_id": Data(openChannelRequest.getTemporaryChannelId().getA() ?? []).hexEncodedString(),
                    "counterparty_node_id": Data(openChannelRequest.getCounterpartyNodeId()).hexEncodedString(),
                    "push_sat": openChannelRequest.getPushMsat() / 1000,
                    "funding_satoshis": openChannelRequest.getFundingSatoshis(),
                    "requires_zero_conf": openChannelRequest.getChannelType().requiresZeroConf(),
                    "supports_zero_conf": openChannelRequest.getChannelType().supportsZeroConf(),
                    "requires_anchors_zero_fee_htlc_tx": openChannelRequest.getChannelType().requiresAnchorsZeroFeeHtlcTx()
                ] as [String : Any]
            )
            return
        case .PaymentPathSuccessful:
            guard let paymentPathSuccessful = event.getValueAsPaymentPathSuccessful() else {
                return handleEventError(event)
            }

            let paymentId = Data(paymentPathSuccessful.getPaymentId()).hexEncodedString()
            let paymentHash = Data(paymentPathSuccessful.getPaymentHash() ?? []).hexEncodedString()

            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_path_successful,
                body: [
                    "payment_id": paymentId,
                    "payment_hash": paymentHash,
                    "path_hops": paymentPathSuccessful.getPath().getHops().map { $0.asJson },
                ] as [String : Any]
            )
            return
        case .PaymentPathFailed:
            guard let paymentPathFailed = event.getValueAsPaymentPathFailed() else {
                return handleEventError(event)
            }

            let paymentId = Data(paymentPathFailed.getPaymentId() ?? []).hexEncodedString()
            let paymentHash = Data(paymentPathFailed.getPaymentHash()).hexEncodedString()

            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_path_failed,
                body: [
                    "payment_id": paymentId,
                    "payment_hash": paymentHash,
                    "payment_failed_permanently": paymentPathFailed.getPaymentFailedPermanently(),
                    "short_channel_id": String(paymentPathFailed.getShortChannelId() ?? 0),
                    "path_hops": paymentPathFailed.getPath().getHops().map { $0.asJson }
                ] as [String : Any]
            )

            persistPaymentSent(
                [
                    "payment_id": paymentId,
                    "payment_hash": paymentHash,
                    "unix_timestamp": Int(Date().timeIntervalSince1970),
                    "state":  paymentPathFailed.getPaymentFailedPermanently() ? "failed" : "pending"
                ]
            )
            return
        case .PaymentFailed:
            guard let paymentFailed = event.getValueAsPaymentFailed() else {
                return handleEventError(event)
            }

            let paymentId = Data(paymentFailed.getPaymentId()).hexEncodedString()
            let paymentHash = Data(paymentFailed.getPaymentHash()).hexEncodedString()

            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_failed,
                body: [
                    "payment_id": paymentId,
                    "payment_hash": paymentHash,
                ]
            )

            //MARK: Mark as failed

            persistPaymentSent(
                [
                    "payment_id": paymentId,
                    "payment_hash": paymentHash,
                    "unix_timestamp": Int(Date().timeIntervalSince1970),
                    "state":  "failed"
                ]
            )
            return
        case .PaymentForwarded:
            //Unused on mobile
            return
        case .PendingHTLCsForwardable:
            guard let pendingHtlcsForwardable = event.getValueAsPendingHtlcsForwardable() else {
                return handleEventError(event)
            }

            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_pending_htlcs_forwardable,
                body: [
                    "time_forwardable": pendingHtlcsForwardable.getTimeForwardable(),
                ]
            )
            return
        case .SpendableOutputs:
            guard let spendableOutputs = event.getValueAsSpendableOutputs() else {
                return handleEventError(event)
            }

            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_spendable_outputs,
                body: [
                    "outputsSerialized": spendableOutputs.getOutputs().map { Data($0.write()).hexEncodedString() },
                ]
            )
            return
        case .ChannelClosed:
            guard let channelClosed = event.getValueAsChannelClosed() else {
                return handleEventError(event)
            }

            let reasonString: String
            switch channelClosed.getReason().getValueType() {
            case .CommitmentTxConfirmed:
                reasonString = "CommitmentTxConfirmed"
            case .CounterpartyCoopClosedUnfundedChannel:
                reasonString = "CounterpartyCoopClosedUnfundedChannel"
            case .CounterpartyForceClosed:
                reasonString = "CounterpartyForceClosed"
            case .DisconnectedPeer:
                reasonString = "DisconnectedPeer"
            case .FundingBatchClosure:
                reasonString = "FundingBatchClosure"
            case .FundingTimedOut:
                reasonString = "FundingTimedOut"
            case .HolderForceClosed:
                reasonString = "HolderForceClosed"
            case .OutdatedChannelManager:
                reasonString = "OutdatedChannelManager"
            case .ProcessingError:
                reasonString = "ProcessingError"
            case .CounterpartyInitiatedCooperativeClosure:
                reasonString = "CounterpartyInitiatedCooperativeClosure"
            case .LegacyCooperativeClosure:
                reasonString = "LegacyCooperativeClosure"
            case .LocallyInitiatedCooperativeClosure:
                reasonString = "LocallyInitiatedCooperativeClosure"
            case .HTLCsTimedOut:
                reasonString = "HTLCsTimedOut"
            @unknown default:
                reasonString = "Unknown"
            }

            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_channel_closed,
                body: [
                    "user_channel_id": Data(channelClosed.getUserChannelId()).hexEncodedString(),
                    "channel_id": Data(channelClosed.getChannelId().getA() ?? []).hexEncodedString(),
                    "reason": reasonString
                ]
            )
            
            return
        case .DiscardFunding:
            guard let discardFunding = event.getValueAsDiscardFunding() else {
                return handleEventError(event)
            }

            //Wallet should probably "lock" the UTXOs spent in funding transactions until the funding transaction either confirms, or this event is generated.
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_discard_funding,
                body: [
                    "channel_id": Data(discardFunding.getChannelId().getA() ?? []).hexEncodedString(),
                    "tx": Data(discardFunding.getTransaction()).hexEncodedString()
                ]
            )
            return
        case .PaymentClaimed:
            guard let paymentClaimed = event.getValueAsPaymentClaimed() else {
                return handleEventError(event)
            }

            let paymentPreimage = paymentClaimed.getPurpose().getValueAsBolt11InvoicePayment()?.getPaymentPreimage()
            let paymentSecret = paymentClaimed.getPurpose().getValueAsBolt11InvoicePayment()?.getPaymentSecret()
            let spontaneousPayment = paymentClaimed.getPurpose().getValueAsSpontaneousPayment()

            let body: [String: Encodable] = [
                "payment_hash": Data(paymentClaimed.getPaymentHash()).hexEncodedString(),
                "amount_sat": paymentClaimed.getAmountMsat() / 1000,
                "payment_preimage": Data(paymentPreimage ?? []).hexEncodedString(),
                "payment_secret": Data(paymentSecret ?? []).hexEncodedString(),
                "spontaneous_payment_preimage": Data(spontaneousPayment ?? []).hexEncodedString(),
                "unix_timestamp": Int(Date().timeIntervalSince1970),
                "state": "successful"
            ]

            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_claimed,
                body: body
            )

            //Save to disk for TX history
            persistPaymentClaimed(body)
            return
        case .ChannelReady:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unused Persister event: ChannelReady")
            return
        case .ChannelPending:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unused Persister event: ChannelPending")
            return
        case .BumpTransaction:
            guard let bumpTransaction = event.getValueAsBumpTransaction() else {
                return handleEventError(event)
            }
            
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "BumpTransaction request")

            if let channelClose = bumpTransaction.getValueAsChannelClose() {
                let body: [String: Encodable] = [
                    "commitment_tx": Data(channelClose.getCommitmentTx()).hexEncodedString(),
                    "commitment_tx_fee": channelClose.getCommitmentTxFeeSatoshis(),
                    "pending_htlcs_count": channelClose.getPendingHtlcs().count
                ]
                
                LdkEventEmitter.shared.send(withEvent: .lsp_log, body: body)
                return
            }
            
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "BumpTransaction event not handled")
            return
        case .ProbeFailed:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unused Persister event: ProbeFailed")
            return
        case .ProbeSuccessful:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unused Persister event: ProbeSuccessful")
            return
        case .InvoiceRequestFailed:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unused Persister event: InvoiceRequestFailed")
            return
        case .HTLCIntercepted:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unused Persister event: HTLCIntercepted")
            return
        case .HTLCHandlingFailed:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unused Persister event: HTLCHandlingFailed")
            return
        case .ConnectionNeeded:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Unused Persister event: ConnectionNeeded")
            return
        }
    }

    override func persistManager(channelManager: Bindings.ChannelManager) -> Bindings.Result_NoneIOErrorZ {
        guard let managerStorage = Ldk.accountStoragePath?.appendingPathComponent(LdkFileNames.channel_manager.rawValue) else {
            return Result_NoneIOErrorZ.initWithErr(e: .Other)
        }

        do {
            BackupClient.addToPersistQueue(.channelManager, channelManager.write()) { error in
                if let error {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Failed to remote persist channel manager Error: \(error.localizedDescription)")
                } else {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Remote persisted channel manager")
                }
            }

            try Data(channelManager.write()).write(to: managerStorage)
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted channel manager to disk")

            return Result_NoneIOErrorZ.initWithOk()
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist channel manager to disk Error \(error.localizedDescription).")
            return Result_NoneIOErrorZ.initWithErr(e: .Other)
        }
    }

    override func persistGraph(networkGraph: Bindings.NetworkGraph) -> Bindings.Result_NoneIOErrorZ {
        guard let graphStorage = Ldk.accountStoragePath?.appendingPathComponent(LdkFileNames.network_graph.rawValue) else {
            return Result_NoneIOErrorZ.initWithErr(e: .Other)
        }

        do {
            try Data(networkGraph.write()).write(to: graphStorage)
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted network graph to disk")

            return Result_NoneIOErrorZ.initWithOk()
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist network graph to disk Error \(error.localizedDescription).")
            return Result_NoneIOErrorZ.initWithErr(e: .Other)
        }
    }

    override func persistScorer(scorer: Bindings.WriteableScore) -> Bindings.Result_NoneIOErrorZ {
        guard let scorerStorage = Ldk.accountStoragePath?.appendingPathComponent(LdkFileNames.scorer.rawValue) else {
            return Result_NoneIOErrorZ.initWithErr(e: .Other)
        }

        do {
            try Data(scorer.write()).write(to: scorerStorage)

            return Result_NoneIOErrorZ.initWithOk()
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist scorer to disk Error \(error.localizedDescription).")
            return Result_NoneIOErrorZ.initWithErr(e: .Other)
        }
    }

    /// Saves claiming/claimed payment to disk. If payment hash exists already then the payment values are merged into the existing entry as an update
    /// - Parameter payment: payment obj
    private func persistPaymentClaimed(_ payment: [String: Any]) {
        guard let claimedPaymentsStorage = Ldk.accountStoragePath?.appendingPathComponent(LdkFileNames.payments_claimed.rawValue) else {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist claimed payment to disk (No set storage)")
            return
        }

        var payments: [[String: Any]] = []

        do {
            if FileManager.default.fileExists(atPath: claimedPaymentsStorage.path) {
                let data = try Data(contentsOf: URL(fileURLWithPath: claimedPaymentsStorage.path), options: .mappedIfSafe)

                if let existingContent = try JSONSerialization.jsonObject(with: data, options: []) as? [[String: Any]] {
                    payments = existingContent
                } else {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error could not read existing claimed payments")
                }
            }

            //Replace entry if payment hash exists (Confirmed payment replacing pending)
            var paymentReplaced = false
            for (index, existingPayment) in payments.enumerated() {
                if let existingPaymentHash = existingPayment["payment_hash"] as? String, let newPaymentHash = payment["payment_hash"] as? String {
                    if existingPaymentHash == newPaymentHash {
                        //Don't replace a successful payment. If a 2nd wallet tries to pay an invoice the first successful one should not be overwritten.
                        if existingPayment["state"] as? String == "successful" {
                            return
                        }
                        
                        payments[index] = mergeObj(payments[index], payment) //Merges update into orginal entry
                        paymentReplaced = true
                    }
                }
            }

            //No existing payment found, append as new payment
            if !paymentReplaced {
                payments.append(payment)
            }

            guard let jsonData = try? JSONSerialization.data(withJSONObject: payments, options: []) else {
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error could not serialize claimed payments")
                return
            }

            guard let jsonString = String(data: jsonData, encoding: .utf8) else {
                return
            }

            try jsonString.write(to: claimedPaymentsStorage, atomically: true, encoding: .utf8)

            BackupClient.addToPersistQueue(.misc(fileName: LdkFileNames.payments_claimed.rawValue), [UInt8](jsonData))
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error writing payment claimed to file: \(error)")
        }
    }

    /// Saves sending/sent payment to disk. If payment ID exists already then the payment values are merged into the existing entry as an update
    /// - Parameter payment: payment obj
    func persistPaymentSent(_ payment: [String: Any]) {
        guard let sentPaymentsStorage = Ldk.accountStoragePath?.appendingPathComponent(LdkFileNames.payments_sent.rawValue) else {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist sent payment to disk (No set storage)")
            return
        }

        var payments: [[String: Any]] = []

        do {
            if FileManager.default.fileExists(atPath: sentPaymentsStorage.path) {
                let data = try Data(contentsOf: URL(fileURLWithPath: sentPaymentsStorage.path), options: .mappedIfSafe)

                if let existingContent = try JSONSerialization.jsonObject(with: data, options: []) as? [[String: Any]] {
                    payments = existingContent
                } else {
                    LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error could not read existing sent payments")
                }
            }

            //Replace entry if payment hash exists (Confirmed payment replacing pending)
            var paymentReplaced = false
            for (index, existingPayment) in payments.enumerated() {
                if let existingPaymentId = existingPayment["payment_id"] as? String, let newPaymentId = payment["payment_id"] as? String {
                    if existingPaymentId == newPaymentId {
                        payments[index] = mergeObj(payments[index], payment) //Merges update into orginal entry
                        paymentReplaced = true
                    }
                }
            }

            //No existing payment found, append as new payment
            if !paymentReplaced {
                payments.append(payment)
            }

            guard let jsonData = try? JSONSerialization.data(withJSONObject: payments, options: []) else {
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error could not serialize sent payments")
                return
            }

            guard let jsonString = String(data: jsonData, encoding: .utf8) else {
                return
            }

            try jsonString.write(to: sentPaymentsStorage, atomically: true, encoding: .utf8)

            BackupClient.addToPersistQueue(.misc(fileName: LdkFileNames.payments_sent.rawValue), [UInt8](jsonData))
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error writing payment sent to file: \(error)")
        }
    }
}
