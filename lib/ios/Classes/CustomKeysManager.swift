//
//  CustomKeysManager.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2023/12/01.
//

import Foundation
import LightningDevKit

class CustomKeysManager {
    let inner: KeysManager
    let signerProvider: CustomSignerProvider
    let address: String
    let destinationScriptPublicKey: [UInt8]
    let witnessProgram: [UInt8]
    let witnessProgramVersion: UInt8
    
    init(seed: [UInt8], startingTimeSecs: UInt64, startingTimeNanos: UInt32, address: String, destinationScriptPublicKey: [UInt8], witnessProgram: [UInt8], witnessProgramVersion: UInt8) {
        self.inner = KeysManager(seed: seed, startingTimeSecs: startingTimeSecs, startingTimeNanos: startingTimeNanos)
        self.address = address
        self.destinationScriptPublicKey = destinationScriptPublicKey
        self.witnessProgram = witnessProgram
        self.witnessProgramVersion = witnessProgramVersion
        self.signerProvider = CustomSignerProvider()
        self.signerProvider.customKeysManager = self
    }
    
    // We drop all occurences of `SpendableOutputDescriptor::StaticOutput` (since they will be
    // spendable by the on chain wallet if opened with custom shutdown script pubkey) and forward any other descriptors to
    // `KeysManager::spend_spendable_outputs`.
    func spendSpendableOutputs(descriptors: [SpendableOutputDescriptor], outputs: [Bindings.TxOut], changeDestinationScript: [UInt8], feerateSatPer1000Weight: UInt32, locktime: UInt32?) -> Result_TransactionNoneZ {
        let onlyNonStatic: [SpendableOutputDescriptor] = descriptors.filter { desc in
            if desc.getValueType() == .StaticOutput {
                LdkEventEmitter.shared.send(withEvent: .native_log, body: "Skipping static output: \(Data(desc.getValueAsStaticOutput()?.getOutput().getScriptPubkey() ?? []).hexEncodedString())")
                return false
            }
            
            return true
        }
        
        LdkEventEmitter.shared.send(withEvent: .native_log, body: "Spending \(onlyNonStatic.count) non static outputs")
        
        let res = self.inner.asOutputSpender().spendSpendableOutputs(
            descriptors: onlyNonStatic,
            outputs: outputs,
            changeDestinationScript: changeDestinationScript,
            feerateSatPer1000Weight: feerateSatPer1000Weight,
            locktime: locktime
        )
        return res
    }
}

class CustomSignerProvider: SignerProvider {
    weak var customKeysManager: CustomKeysManager?
 
    override func getDestinationScript(channelKeysId: [UInt8]) -> Bindings.Result_CVec_u8ZNoneZ {
        let destinationScriptPublicKey = customKeysManager!.destinationScriptPublicKey
        return Bindings.Result_CVec_u8ZNoneZ.initWithOk(o: destinationScriptPublicKey)
    }
    
    override func getShutdownScriptpubkey() -> Bindings.Result_ShutdownScriptNoneZ {
        let res = ShutdownScript.newWitnessProgram(witnessProgram: .init(version: customKeysManager!.witnessProgramVersion, program: customKeysManager!.witnessProgram))
        if res.isOk() {
            //To record which addresses should be watched for close channel funds
            LdkEventEmitter.shared.send(withEvent: .used_close_address, body: customKeysManager!.address)
            return Bindings.Result_ShutdownScriptNoneZ.initWithOk(o: res.getValue()!)
        }
        
        LdkEventEmitter.shared.send(
            withEvent: .native_log,
            body: "Invalid shutdown script from CustomSignerProvider: \(Data(res.getError()?.getScript() ?? []).hexEncodedString())"
        )
        
        return .initWithErr()
    }
    
    override func deriveChannelSigner(channelValueSatoshis: UInt64, channelKeysId: [UInt8]) -> Bindings.WriteableEcdsaChannelSigner {
        return customKeysManager!.inner.asSignerProvider().deriveChannelSigner(
            channelValueSatoshis: channelValueSatoshis,
            channelKeysId: channelKeysId
        )
    }
    
    override func generateChannelKeysId(inbound: Bool, channelValueSatoshis: UInt64, userChannelId: [UInt8]) -> [UInt8] {
        return customKeysManager!.inner.asSignerProvider().generateChannelKeysId(
            inbound: inbound,
            channelValueSatoshis: channelValueSatoshis,
            userChannelId: userChannelId
        )
    }
    
    override func readChanSigner(reader: [UInt8]) -> Bindings.Result_WriteableEcdsaChannelSignerDecodeErrorZ {
        return customKeysManager!.inner.asSignerProvider().readChanSigner(reader: reader)
    }
}
