//
//  LdkChannelManagerPersister.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkChannelManagerPersister: Persister, ExtendedChannelManagerPersister {
    override func free() {
        //TODO find out what this is for
    }
    
    //Custom function to manage any unlikely missing info from the event object
    func handleEventError(_ event: Event) {
        LdkEventEmitter.shared.send(
            withEvent: .native_log,
            body: "Error missing details for handle_event of type \(event.getValueType().debugDescription)"
        )
    }
    
    func handle_event(event: Event) {
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
                    "temp_channel_id": Data(fundingGeneration.getTemporary_channel_id()).hexEncodedString(),
                    "output_script": Data(fundingGeneration.getOutput_script()).hexEncodedString(),
                    "user_channel_id": fundingGeneration.getUser_channel_id(),
                    "value_satoshis": fundingGeneration.getChannel_value_satoshis(),
                ]
            )
            return
        case .PaymentReceived:
            guard let paymentReceived = event.getValueAsPaymentReceived() else {
                return handleEventError(event)
            }
            
            let paymentPreimage = paymentReceived.getPurpose().getValueAsInvoicePayment()?.getPayment_preimage()
            let paymentSecret = paymentReceived.getPurpose().getValueAsInvoicePayment()?.getPayment_secret()
            let spontaneousPayment = paymentReceived.getPurpose().getValueAsSpontaneousPayment()
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_received,
                body: [
                    "payment_hash": Data(paymentReceived.getPayment_hash()).hexEncodedString(),
                    "amount_sat": paymentReceived.getAmount_msat() / 1000,
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
                    "payment_id": Data(paymentSent.getPayment_id()).hexEncodedString(),
                    "payment_preimage": Data(paymentSent.getPayment_preimage()).hexEncodedString(),
                    "payment_hash": Data(paymentSent.getPayment_hash()).hexEncodedString(),
                    "fee_paid_sat": paymentSent.getFee_paid_msat().getValue() ?? 0 / 1000,
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
                    "temp_channel_id": Data(openChannelRequest.getTemporary_channel_id()).hexEncodedString(),
                    "counterparty_node_id": Data(openChannelRequest.getCounterparty_node_id()).hexEncodedString(),
                    "push_sat": openChannelRequest.getPush_msat() / 1000,
                    "funding_satoshis": openChannelRequest.getFunding_satoshis(),
                    "channel_type": Data(openChannelRequest.getChannel_type().write()).hexEncodedString()
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
                    "payment_id": Data(paymentPathSuccessful.getPayment_id()).hexEncodedString(),
                    "payment_hash": Data(paymentPathSuccessful.getPayment_hash()).hexEncodedString(),
                    "path": paymentPathSuccessful.getPath().map { $0.asJson },
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
                    "payment_id": Data(paymentPathFailed.getPayment_id()).hexEncodedString(),
                    "payment_hash": Data(paymentPathFailed.getPayment_hash()).hexEncodedString(),
                    "rejected_by_dest": paymentPathFailed.getRejected_by_dest(),
                    "short_channel_id": paymentPathFailed.getShort_channel_id(),
                    "path": paymentPathFailed.getPath().map { $0.asJson },
                    "network_update": paymentPathFailed.getNetwork_update().getValue().debugDescription //TODO could be more detailed
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
                    "payment_id": Data(paymentFailed.getPayment_id()).hexEncodedString(),
                    "payment_hash": Data(paymentFailed.getPayment_hash()).hexEncodedString(),
                ]
            )
            return
        case .PaymentForwarded:
            //Unused on mobile
            return
        case .PendingHTLCsForwardable:
            guard let pendingHTLCsForwardable = event.getValueAsPendingHTLCsForwardable() else {
                return handleEventError(event)
            }
                        
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_pending_htlcs_forwardable,
                body: [
                    "time_forwardable": pendingHTLCsForwardable.getTime_forwardable(),
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
                    "user_channel_id": channelClosed.getUser_channel_id(),
                    "channel_id": Data(channelClosed.getChannel_id()).hexEncodedString(),
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
                    "channel_id": Data(discardFunding.getChannel_id()).hexEncodedString(),
                    "tx": Data(discardFunding.getTransaction()).hexEncodedString()
                ]
            )
            return
        case .PaymentClaimed:
            guard let paymentClaimed = event.getValueAsPaymentClaimed() else {
                return handleEventError(event)
            }
            
            let paymentPreimage = paymentClaimed.getPurpose().getValueAsInvoicePayment()?.getPayment_preimage()
            let paymentSecret = paymentClaimed.getPurpose().getValueAsInvoicePayment()?.getPayment_secret()
            let spontaneousPayment = paymentClaimed.getPurpose().getValueAsSpontaneousPayment()
            
            LdkEventEmitter.shared.send(
                withEvent: .channel_manager_payment_claimed,
                body: [
                    "payment_hash": Data(paymentClaimed.getPayment_hash()).hexEncodedString(),
                    "amount_sat": paymentClaimed.getAmount_msat() / 1000,
                    "payment_preimage": Data(paymentPreimage ?? []).hexEncodedString(),
                    "payment_secret": Data(paymentSecret ?? []).hexEncodedString(),
                    "spontaneous_payment_preimage": Data(spontaneousPayment ?? []).hexEncodedString(),
                ]
            )
            
        default:
            LdkEventEmitter.shared.send(withEvent: .native_log, body: "ERROR: unknown LdkChannelManagerPersister.handle_event type")
        }
    }
    
    override func persist_manager(channel_manager: ChannelManager) -> Result_NoneErrorZ {
        LdkEventEmitter.shared.send(withEvent: .persist_manager, body: ["channel_manager": Data(channel_manager.write()).hexEncodedString()])
        
        return Result_NoneErrorZ.ok()
    }
    
    override func persist_graph(network_graph: NetworkGraph) -> Result_NoneErrorZ {
        LdkEventEmitter.shared.send(withEvent: .persist_graph, body: ["network_graph": Data(network_graph.write()).hexEncodedString()])

        return Result_NoneErrorZ.ok()
    }
    
    override func persist_scorer(scorer: MultiThreadedLockableScore) -> Result_NoneErrorZ {
        //TODO
        print("TODO Swift persist scorer")
        return Result_NoneErrorZ.ok()
    }
}
