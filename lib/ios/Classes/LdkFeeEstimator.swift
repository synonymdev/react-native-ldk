//
//  LdkfeeEstimator.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkFeeEstimator: FeeEstimator {
    private var anchorChannelFee: UInt32 = 0
    private var nonAnchorChannelFee: UInt32 = 0
    private var channelCloseMinimum: UInt32 = 0
    private var minAllowedAnchorChannelRemoteFee: UInt32 = 0
    private var minAllowedNonAnchorChannelRemoteFee: UInt32 = 0
    private var outputSpendingFee: UInt32 = 0
    private var maximumFeeEstimate: UInt32 = 0
    private var urgentOnChainSweep: UInt32 = 0

    func update(
        anchorChannelFee: UInt32,
        nonAnchorChannelFee: UInt32,
        channelCloseMinimum: UInt32,
        minAllowedAnchorChannelRemoteFee: UInt32,
        minAllowedNonAnchorChannelRemoteFee: UInt32,
        outputSpendingFee: UInt32,
        maximumFeeEstimate: UInt32,
        urgentOnChainSweep: UInt32
    ) {
        self.anchorChannelFee = anchorChannelFee
        self.nonAnchorChannelFee = nonAnchorChannelFee
        self.channelCloseMinimum = channelCloseMinimum
        self.minAllowedAnchorChannelRemoteFee = minAllowedAnchorChannelRemoteFee
        self.minAllowedNonAnchorChannelRemoteFee = minAllowedNonAnchorChannelRemoteFee
        self.outputSpendingFee = outputSpendingFee
        self.maximumFeeEstimate = maximumFeeEstimate
        self.urgentOnChainSweep = urgentOnChainSweep

        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Fee estimator updated")
    }

    override func getEstSatPer1000Weight(confirmationTarget: Bindings.ConfirmationTarget) -> UInt32 {
        let target = confirmationTarget

        switch target {
        case .AnchorChannelFee:
            return anchorChannelFee
        case .NonAnchorChannelFee:
            return nonAnchorChannelFee
        case .ChannelCloseMinimum:
            return channelCloseMinimum
        case .MinAllowedAnchorChannelRemoteFee:
            return minAllowedAnchorChannelRemoteFee
        case .MinAllowedNonAnchorChannelRemoteFee:
            return minAllowedNonAnchorChannelRemoteFee
        case .OutputSpendingFee:
            return outputSpendingFee
        case .MaximumFeeEstimate:
            return maximumFeeEstimate
        case .UrgentOnChainSweep:
            return urgentOnChainSweep
        }
    }
}
