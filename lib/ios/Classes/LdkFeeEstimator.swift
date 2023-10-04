//
//  LdkfeeEstimator.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkFeeEstimator: FeeEstimator {
    private var high: UInt32 = 0
    private var normal: UInt32 = 0
    private var low: UInt32 = 0
    private var mempoolMinimum: UInt32 = 0
    
    func update(high: UInt32, normal: UInt32, low: UInt32, mempoolMinimum: UInt32) {
        self.high = high
        self.normal = normal
        self.low = low
        self.mempoolMinimum = mempoolMinimum

        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Fee estimator updated")
    }
    
    override func getEstSatPer1000Weight(confirmationTarget: Bindings.ConfirmationTarget) -> UInt32 {
        let target = confirmationTarget
        
        if case ConfirmationTarget.HighPriority = target {
            return high
        }
        
        if case ConfirmationTarget.Normal = target {
            return normal
        }
        
        if case ConfirmationTarget.Background = target {
            return low
        }
        
        if case ConfirmationTarget.MempoolMinimum = target {
            return mempoolMinimum
        }
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "WARNING: New ConfirmationTarget added. Update LdkFeeEstimator.")

        return normal
    }
}
