package com.reactnativeldk.classes
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import org.ldk.enums.ConfirmationTarget
import org.ldk.structs.FeeEstimator

class LdkFeeEstimator {
    var anchorChannelFee: Int = 0
    var nonAnchorChannelFee: Int = 0
    var channelCloseMinimum: Int = 0
    var minAllowedAnchorChannelRemoteFee: Int = 0
    var minAllowedNonAnchorChannelRemoteFee: Int = 0
    var outputSpendingFee: Int = 0
    var maximumFeeEstimate: Int = 0
    var urgentOnChainSweep: Int = 0

    fun update(
        anchorChannelFee: Int,
        nonAnchorChannelFee: Int,
        channelCloseMinimum: Int,
        minAllowedAnchorChannelRemoteFee: Int,
        minAllowedNonAnchorChannelRemoteFee: Int,
        outputSpendingFee: Int,
        maximumFeeEstimate: Int,
        urgentOnChainSweep: Int
    ) {
        this.anchorChannelFee = anchorChannelFee
        this.nonAnchorChannelFee = nonAnchorChannelFee
        this.channelCloseMinimum = channelCloseMinimum
        this.minAllowedAnchorChannelRemoteFee = minAllowedAnchorChannelRemoteFee
        this.minAllowedNonAnchorChannelRemoteFee = minAllowedNonAnchorChannelRemoteFee
        this.outputSpendingFee = outputSpendingFee
        this.maximumFeeEstimate = maximumFeeEstimate
        this.urgentOnChainSweep = urgentOnChainSweep

        LdkEventEmitter.send(EventTypes.native_log, "Fee estimator updated")
    }

    var feeEstimator = FeeEstimator.new_impl { target: ConfirmationTarget ->
        return@new_impl when (target) {
            ConfirmationTarget.LDKConfirmationTarget_AnchorChannelFee -> anchorChannelFee
            ConfirmationTarget.LDKConfirmationTarget_NonAnchorChannelFee -> nonAnchorChannelFee
            ConfirmationTarget.LDKConfirmationTarget_ChannelCloseMinimum -> channelCloseMinimum
            ConfirmationTarget.LDKConfirmationTarget_MinAllowedAnchorChannelRemoteFee -> minAllowedAnchorChannelRemoteFee
            ConfirmationTarget.LDKConfirmationTarget_MinAllowedNonAnchorChannelRemoteFee -> minAllowedNonAnchorChannelRemoteFee
            ConfirmationTarget.LDKConfirmationTarget_OutputSpendingFee -> outputSpendingFee
            ConfirmationTarget.LDKConfirmationTarget_MaximumFeeEstimate -> maximumFeeEstimate
            ConfirmationTarget.LDKConfirmationTarget_UrgentOnChainSweep -> urgentOnChainSweep
        }
    }
}

