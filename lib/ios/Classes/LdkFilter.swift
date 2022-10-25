//
//  LdkFilter.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LightningDevKit

class LdkFilter: Filter {
    override func free() {
        //TODO find out what this is for
    }
    
    override func register_tx(txid: [UInt8]?, script_pubkey: [UInt8]) {
        LdkEventEmitter.shared.send(
            withEvent: .register_tx,
            body: [
                "txid": Data(Data(txid ?? []).reversed()).hexEncodedString(),
                "script_pubkey": Data(script_pubkey).hexEncodedString()
            ]
        )
    }
    
    override func register_output(output: Bindings.WatchedOutput) {
        LdkEventEmitter.shared.send(
            withEvent: .register_output,
            body: [
                "block_hash": Data(output.get_block_hash()).hexEncodedString(),
                "index": output.get_outpoint()!.get_index(),
                "script_pubkey": Data(output.get_script_pubkey()).hexEncodedString(),
            ]
        )
    }
}
