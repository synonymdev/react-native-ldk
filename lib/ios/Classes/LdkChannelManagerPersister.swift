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
                    "temp_channel_id": Data(fundingGeneration.getTemporaryChannelId()).hexEncodedString(),
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
            
            let paymentPreimage = paymentClaimable.getPurpose().getValueAsInvoicePayment()?.getPaymentPreimage()
            let paymentSecret = paymentClaimable.getPurpose().getValueAsInvoicePayment()?.getPaymentSecret()
            let spontaneousPayment = paymentClaimable.getPurpose().getValueAsSpontaneousPayment()
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_claimable,
                body: [
                    "payment_hash": Data(paymentClaimable.getPaymentHash()).hexEncodedString(),
                    "amount_sat": paymentClaimable.getAmountMsat() / 1000,
                    "payment_preimage": Data(paymentPreimage ?? []).hexEncodedString(),
                    "payment_secret": Data(paymentSecret ?? []).hexEncodedString(),
                    "spontaneous_payment_preimage": Data(spontaneousPayment ?? []).hexEncodedString(),
                ]
            )
            return
        case .PaymentSent:
            guard let paymentSent = event.getValueAsPaymentSent() else {
                return handleEventError(event)
            }
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_sent,
                body: [
                    "payment_id": Data(paymentSent.getPaymentId()).hexEncodedString(),
                    "payment_preimage": Data(paymentSent.getPaymentPreimage()).hexEncodedString(),
                    "payment_hash": Data(paymentSent.getPaymentHash()).hexEncodedString(),
                    "fee_paid_sat": (paymentSent.getFeePaidMsat() ?? 0) / 1000,
                ]
            )
            return
        case .OpenChannelRequest:
            //Use if we ever manually accept inbound channels. Setting in initConfig.
            guard let openChannelRequest = event.getValueAsOpenChannelRequest() else {
                return handleEventError(event)
            }
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_open_channel_request,
                body: [
                    "temp_channel_id": Data(openChannelRequest.getTemporaryChannelId()).hexEncodedString(),
                    "counterparty_node_id": Data(openChannelRequest.getCounterpartyNodeId()).hexEncodedString(),
                    "push_sat": openChannelRequest.getPushMsat() / 1000,
                    "funding_satoshis": openChannelRequest.getFundingSatoshis(),
                    "channel_type": Data(openChannelRequest.getChannelType().write()).hexEncodedString()
                ]
            )
            return
        case .PaymentPathSuccessful:
            guard let paymentPathSuccessful = event.getValueAsPaymentPathSuccessful() else {
                return handleEventError(event)
            }
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_path_successful,
                body: [
                    "payment_id": Data(paymentPathSuccessful.getPaymentId()).hexEncodedString(),
                    "payment_hash": Data(paymentPathSuccessful.getPaymentHash()).hexEncodedString(),
                    "path_hops": paymentPathSuccessful.getPath().getHops().map { $0.asJson },
                ]
            )
            return
        case .PaymentPathFailed:
            guard let paymentPathFailed = event.getValueAsPaymentPathFailed() else {
                return handleEventError(event)
            }
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_path_failed,
                body: [
                    "payment_id": Data(paymentPathFailed.getPaymentId()).hexEncodedString(),
                    "payment_hash": Data(paymentPathFailed.getPaymentHash()).hexEncodedString(),
                    "payment_failed_permanently": paymentPathFailed.getPaymentFailedPermanently(),
                    "short_channel_id": String(paymentPathFailed.getShortChannelId() ?? 0),
                    "path_hops": paymentPathFailed.getPath().getHops().map { $0.asJson }
                ]
            )
            return
        case .PaymentFailed:
            guard let paymentFailed = event.getValueAsPaymentFailed() else {
                return handleEventError(event)
            }
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_failed,
                body: [
                    "payment_id": Data(paymentFailed.getPaymentId()).hexEncodedString(),
                    "payment_hash": Data(paymentFailed.getPaymentHash()).hexEncodedString(),
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
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_channel_closed,
                body: [
                    "user_channel_id": Data(channelClosed.getUserChannelId()).hexEncodedString(),
                    "channel_id": Data(channelClosed.getChannelId()).hexEncodedString(),
                    "reason": Data(channelClosed.getReason().write()).hexEncodedString()
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
                    "channel_id": Data(discardFunding.getChannelId()).hexEncodedString(),
                    "tx": Data(discardFunding.getTransaction()).hexEncodedString()
                ]
            )
            return
        case .PaymentClaimed:
            guard let paymentClaimed = event.getValueAsPaymentClaimed() else {
                return handleEventError(event)
            }
            
            let paymentPreimage = paymentClaimed.getPurpose().getValueAsInvoicePayment()?.getPaymentPreimage()
            let paymentSecret = paymentClaimed.getPurpose().getValueAsInvoicePayment()?.getPaymentSecret()
            let spontaneousPayment = paymentClaimed.getPurpose().getValueAsSpontaneousPayment()
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_claimed,
                body: [
                    "payment_hash": Data(paymentClaimed.getPaymentHash()).hexEncodedString(),
                    "amount_sat": paymentClaimed.getAmountMsat() / 1000,
                    "payment_preimage": Data(paymentPreimage ?? []).hexEncodedString(),
                    "payment_secret": Data(paymentSecret ?? []).hexEncodedString(),
                    "spontaneous_payment_preimage": Data(spontaneousPayment ?? []).hexEncodedString(),
                ]
            )
        default:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "ERROR: unknown LdkChannelManagerPersister.handle_event type")
        }
    }
    
    override func persistManager(channelManager: ChannelManager) -> Result_NoneErrorZ {
        guard let managerStorage = Ldk.accountStoragePath?.appendingPathComponent(LdkFileNames.channel_manager.rawValue) else {
            return Result_NoneErrorZ.initWithErr(e: .Other)
        }
        
        do {
            try Data(channelManager.write()).write(to: managerStorage)
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted channel manager to disk")
        
            LdkEventEmitter.shared.send(withEvent: .backup, body: "")
            
            return Result_NoneErrorZ.initWithOk()
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist channel manager to disk Error \(error.localizedDescription).")
            return Result_NoneErrorZ.initWithErr(e: .Other)
        }
    }
    
    override func persistGraph(networkGraph: NetworkGraph) -> Result_NoneErrorZ {
        guard let graphStorage = Ldk.accountStoragePath?.appendingPathComponent(LdkFileNames.network_graph.rawValue) else {
            return Result_NoneErrorZ.initWithErr(e: .Other)
        }
                
        do {
            try Data(networkGraph.write()).write(to: graphStorage)
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Persisted network graph to disk")
        
            return Result_NoneErrorZ.initWithOk()
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist network graph to disk Error \(error.localizedDescription).")
            return Result_NoneErrorZ.initWithErr(e: .Other)
        }
    }
    
    override func persistScorer(scorer: WriteableScore) -> Bindings.Result_NoneErrorZ {
        guard let scorerStorage = Ldk.accountStoragePath?.appendingPathComponent(LdkFileNames.scorer.rawValue) else {
            return Result_NoneErrorZ.initWithErr(e: .Other)
        }

        do {
            try Data(scorer.write()).write(to: scorerStorage)

            return Result_NoneErrorZ.initWithOk()
        } catch {
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "Error. Failed to persist scorer to disk Error \(error.localizedDescription).")
            return Result_NoneErrorZ.initWithErr(e: .Other)
        }
    }
}
