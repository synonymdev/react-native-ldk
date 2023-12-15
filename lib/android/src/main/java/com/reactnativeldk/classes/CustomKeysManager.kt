package com.reactnativeldk.classes

import org.ldk.structs.KeysManager
import org.ldk.structs.Option_u32Z
import org.ldk.structs.Result_CVec_u8ZNoneZ
import org.ldk.structs.Result_ShutdownScriptInvalidShutdownScriptZ
import org.ldk.structs.Result_ShutdownScriptNoneZ
import org.ldk.structs.Result_TransactionNoneZ
import org.ldk.structs.Result_WriteableEcdsaChannelSignerDecodeErrorZ
import org.ldk.structs.ShutdownScript
import org.ldk.structs.SignerProvider
import org.ldk.structs.SignerProvider.SignerProviderInterface
import org.ldk.structs.SpendableOutputDescriptor
import org.ldk.structs.TxOut
import org.ldk.structs.WriteableEcdsaChannelSigner
import org.ldk.util.UInt128
import org.ldk.util.WitnessVersion

class CustomKeysManager(
    seed: ByteArray,
    startingTimeSecs: Long,
    startingTimeNanos: Int,
    destinationScriptPublicKey: ByteArray,
    witnessProgram: ByteArray,
    witnessProgramVersion: Byte
) {
    val inner: KeysManager = KeysManager.of(seed, startingTimeSecs, startingTimeNanos)
    val signerProvider: CustomSignerProvider = CustomSignerProvider()
    val destinationScriptPublicKey: ByteArray = destinationScriptPublicKey
    val witnessProgram: ByteArray = witnessProgram
    val witnessProgramVersion: Byte = witnessProgramVersion

    init {
        signerProvider.customKeysManager = this
    }

    fun spend_spendable_outputs(
        descriptors: Array<SpendableOutputDescriptor>,
        outputs: Array<TxOut>,
        changeDestinationScript: ByteArray,
        feerateSatPer1000Weight: Int,
        locktime: Option_u32Z
    ): Result_TransactionNoneZ {
        //TODO filter out static outputs
        val onlyNonStatic: Array<SpendableOutputDescriptor> = descriptors.filter {
            true //TODO
        }.toTypedArray()

        val res = inner.spend_spendable_outputs(
            onlyNonStatic,
            outputs,
            changeDestinationScript,
            feerateSatPer1000Weight,
            locktime
        )
        return res
    }
}


class CustomSignerProvider : SignerProviderInterface {
    lateinit var customKeysManager: CustomKeysManager

    override fun get_destination_script(): Result_CVec_u8ZNoneZ {
        return Result_CVec_u8ZNoneZ.ok(customKeysManager.destinationScriptPublicKey)
    }

    override fun get_shutdown_scriptpubkey(): Result_ShutdownScriptNoneZ {
        val res = ShutdownScript.new_witness_program(
            WitnessVersion(customKeysManager.witnessProgramVersion),
            customKeysManager.witnessProgram
        )

        return if (res.is_ok) {
            Result_ShutdownScriptNoneZ.ok((res as Result_ShutdownScriptInvalidShutdownScriptZ.Result_ShutdownScriptInvalidShutdownScriptZ_OK).res)
        } else {
            Result_ShutdownScriptNoneZ.err()
        }
    }

    override fun derive_channel_signer(
        channel_value_satoshis: Long,
        channel_keys_id: ByteArray?
    ): WriteableEcdsaChannelSigner {
        return customKeysManager.signerProvider.derive_channel_signer(
            channel_value_satoshis,
            channel_keys_id
        )
    }

    override fun generate_channel_keys_id(p0: Boolean, p1: Long, p2: UInt128?): ByteArray {
        return customKeysManager.signerProvider.generate_channel_keys_id(p0, p1, p2)
    }

    override fun read_chan_signer(p0: ByteArray?): Result_WriteableEcdsaChannelSignerDecodeErrorZ {
        return customKeysManager.signerProvider.read_chan_signer(p0!!)
    }
}
