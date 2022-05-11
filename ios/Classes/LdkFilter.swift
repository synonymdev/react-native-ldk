//
//  LdkFilter.swift
//  react-native-ldk
//
//  Created by Jason van den Berg on 2022/05/10.
//

import Foundation
import LDKFramework

class LdkFilter: Filter {
    override func register_tx(txid: [UInt8]?, script_pubkey: [UInt8]) {
        let txIdHex = Data(txid ?? []).hexEncodedString()
        let scriptPubkeyHex = Data(script_pubkey).hexEncodedString()
    
        sendEvent(eventName: .register_tx, eventBody: ["txid": txIdHex, "script_pubkey": scriptPubkeyHex])
    }
    
    override func register_output(output: WatchedOutput) -> Option_C2Tuple_usizeTransactionZZ {
        let scriptPubkeyHex = Data(output.get_script_pubkey()).hexEncodedString()
        let outpoint = output.get_outpoint()!
        let blockHashBytes = Data(output.get_block_hash()).hexEncodedString()
        sendEvent(eventName: .register_output, eventBody: ["block_hash": blockHashBytes, "index": String(outpoint.get_index()), "script_pubkey": scriptPubkeyHex])
        
        return Option_C2Tuple_usizeTransactionZZ.none()
    }
}
