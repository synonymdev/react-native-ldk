//
//  LdkFilter.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkFilter: Filter {
    override func registerTx(txid: [UInt8]?, scriptPubkey: [UInt8]) {
        LdkEventEmitter.shared.send(
            withEvent: .register_tx,
            body: [
                "txid": Data(Data(txid ?? []).reversed()).hexEncodedString(),
                "script_pubkey": Data(scriptPubkey).hexEncodedString()
            ]
        )
    }
    
    override func registerOutput(output: Bindings.WatchedOutput) {
        LdkEventEmitter.shared.send(
            withEvent: .register_output,
            body: [
                "block_hash": Data(output.getBlockHash() ?? []).hexEncodedString(),
                "index": output.getOutpoint().getIndex(),
                "script_pubkey": Data(output.getScriptPubkey()).hexEncodedString(),
            ]
        )
    }
}
