import GrpcAction from '../grpc';
import { err, ok, Result } from '../utils/result';
import { EGrpcSyncMethods } from '../utils/types';
import { lnrpc, wu_lnrpc } from '../';
import { hexStringToBytes, stringToBytes } from '../utils/helpers';

class WalletUnlocker {
	private readonly grpc: GrpcAction;

	constructor(grpc: GrpcAction) {
		this.grpc = grpc;
	}

	/**
	 * Generates wallet seed phrase which can be used in createWallet
	 * @return {Promise<Err<unknown> | Ok<string[]>>}
	 */
	async genSeed(passphrase: string = '', entropy: string = ''): Promise<Result<string[]>> {
		try {
			const message = wu_lnrpc.GenSeedRequest.create({
				aezeedPassphrase: passphrase ? stringToBytes(passphrase) : undefined,
				seedEntropy: entropy ? stringToBytes(entropy) : undefined
			});

			const serializedResponse = await this.grpc.sendCommand(
				EGrpcSyncMethods.GenSeed,
				wu_lnrpc.GenSeedRequest.encode(message).finish()
			);

			return ok(wu_lnrpc.GenSeedResponse.decode(serializedResponse).cipherSeedMnemonic);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Once LND is started then the wallet can be created and unlocked with this.
	 * @return {Promise<Err<unknown> | Ok<wu_lnrpc.InitWalletResponse>>}
	 * @param password
	 * @param seed
	 * @param multiChanBackup
	 */
	async initWallet(
		password: string,
		seed: string[],
		multiChanBackup?: string
	): Promise<Result<wu_lnrpc.InitWalletResponse>> {
		const message = wu_lnrpc.InitWalletRequest.create();
		message.cipherSeedMnemonic = seed;
		message.walletPassword = stringToBytes(password);

		if (multiChanBackup) {
			message.channelBackups = lnrpc.ChanBackupSnapshot.create({
				multiChanBackup: lnrpc.MultiChanBackup.create({
					multiChanBackup: hexStringToBytes(multiChanBackup)
				})
			});
		}

		try {
			const serializedResponse = await this.grpc.sendCommand(
				EGrpcSyncMethods.InitWallet,
				wu_lnrpc.InitWalletRequest.encode(message).finish()
			);

			return ok(wu_lnrpc.InitWalletResponse.decode(serializedResponse));
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Once LND is started then the wallet can be unlocked with this.
	 * @return {Promise<Ok<wu_lnrpc.UnlockWalletResponse> | Err<unknown>>}
	 * @param password
	 */
	async unlockWallet(password: string): Promise<Result<wu_lnrpc.UnlockWalletResponse>> {
		const message = wu_lnrpc.UnlockWalletRequest.create();
		message.walletPassword = stringToBytes(password);

		try {
			const serializedResponse = await this.grpc.sendCommand(
				EGrpcSyncMethods.UnlockWallet,
				wu_lnrpc.UnlockWalletRequest.encode(message).finish()
			);

			return ok(wu_lnrpc.UnlockWalletResponse.decode(serializedResponse));
		} catch (e) {
			return err(e);
		}
	}
}

export default WalletUnlocker;
