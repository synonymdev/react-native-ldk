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
    var onChainSweep: Int = 0
    var minAllowedNonAnchorChannelRemoteFee: Int = 0

    fun update(anchorChannelFee: Int, nonAnchorChannelFee: Int, channelCloseMinimum: Int, minAllowedAnchorChannelRemoteFee: Int, onChainSweep: Int, minAllowedNonAnchorChannelRemoteFee: Int) {
        this.anchorChannelFee = anchorChannelFee
        this.nonAnchorChannelFee = nonAnchorChannelFee
        this.channelCloseMinimum = channelCloseMinimum
        this.minAllowedAnchorChannelRemoteFee = minAllowedAnchorChannelRemoteFee
        this.onChainSweep = onChainSweep
        this.minAllowedNonAnchorChannelRemoteFee = minAllowedNonAnchorChannelRemoteFee

        LdkEventEmitter.send(EventTypes.native_log, "Fee estimator updated")
    }

    var feeEstimator = FeeEstimator.new_impl { target: ConfirmationTarget ->
        return@new_impl when (target) {
            ConfirmationTarget.LDKConfirmationTarget_AnchorChannelFee -> anchorChannelFee
            ConfirmationTarget.LDKConfirmationTarget_NonAnchorChannelFee -> nonAnchorChannelFee
            ConfirmationTarget.LDKConfirmationTarget_ChannelCloseMinimum -> channelCloseMinimum
            ConfirmationTarget.LDKConfirmationTarget_MinAllowedAnchorChannelRemoteFee -> minAllowedAnchorChannelRemoteFee
            ConfirmationTarget.LDKConfirmationTarget_OnChainSweep -> onChainSweep
            ConfirmationTarget.LDKConfirmationTarget_MinAllowedNonAnchorChannelRemoteFee -> minAllowedNonAnchorChannelRemoteFee
            else -> {
                LdkEventEmitter.send(EventTypes.native_log, "ERROR: New ConfirmationTarget added. Update LdkFeeEstimator.")
                return@new_impl 0
            }
        }
    }
}

