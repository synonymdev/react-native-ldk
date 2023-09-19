package com.reactnativeldk.classes
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import org.ldk.enums.ConfirmationTarget
import org.ldk.structs.FeeEstimator

class LdkFeeEstimator {
    var high: Int = 0
    var normal: Int = 0
    var low: Int = 0
    var mempoolMinimum: Int = 0
    var feeEstimator = FeeEstimator.new_impl { target: ConfirmationTarget ->
        if (target.equals(ConfirmationTarget.LDKConfirmationTarget_HighPriority)) {
            return@new_impl high
        }

        if (target.equals(ConfirmationTarget.LDKConfirmationTarget_Normal)) {
            return@new_impl normal
        }

        if (target.equals(ConfirmationTarget.LDKConfirmationTarget_Background)) {
            return@new_impl low
        }

        if (target.equals(ConfirmationTarget.LDKConfirmationTarget_MempoolMinimum)) {
            return@new_impl mempoolMinimum
        }

        LdkEventEmitter.send(EventTypes.native_log, "WARNING: New ConfirmationTarget added. Update LdkFeeEstimator.")

        return@new_impl normal
    }

    fun update(high: Int, normal: Int, low: Int, mempoolMinimum: Int) {
        this.high = high
        this.normal = normal
        this.low = low
        this.mempoolMinimum = mempoolMinimum

        LdkEventEmitter.send(EventTypes.native_log, "Fee estimator updated")
    }
}

