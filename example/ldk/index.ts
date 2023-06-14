import AsyncStorage from '@react-native-async-storage/async-storage';
import { err, ok, Result } from '../utils/result';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';
import lm, {
	TAccount,
	TAccountBackup,
	THeader,
} from '@synonymdev/react-native-ldk';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';
import {
	Backend,
	peers,
	selectedBackend,
	selectedNetwork,
} from '../utils/constants';
import {
	getAccount,
	getAddress,
	ldkNetwork,
	setAccount,
} from '../utils/helpers';
import { EAccount } from '../utils/types';
import * as electrumBackend from './electrum';
import * as mempoolBackend from './mempool';

/**
 * Retrieves data from local storage.
 * @param {string} key
 * @returns {Promise<string>}
 */
export const getItem = async (key = ''): Promise<any> => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (e) {
		console.log(e);
		return '';
	}
};

/**
 * Saves data to local storage.
 * @param {string} key
 * @param {string} value
 * @returns {Promise<void>}
 */
export const setItem = async (key = '', value = ''): Promise<void> => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (e) {
		console.log(e);
	}
};

/**
 * Returns last known header information from storage.
 * @returns {Promise<THeader>}
 */
export const getBestBlock = async (): Promise<THeader> => {
	const bestBlock = await getItem('header');
	return bestBlock ? JSON.parse(bestBlock) : { height: 0, hex: '', hash: '' };
};

/**
 * Saves new/latest header data to local storage.
 * @param {THeader} header
 * @returns {Promise<void>}
 */
export const updateHeader = async ({
	header,
}: {
	header: THeader;
}): Promise<void> => {
	return await setItem('header', JSON.stringify(header));
};

/**
 * Syncs LDK to the current height.
 * @returns {Promise<Result<string>>}
 */
export const syncLdk = async (): Promise<Result<string>> => {
	const syncResponse = await lm.syncLdk();
	return syncResponse;
};

/**
 * Used to spin-up LDK services.
 * In order, this method:
 * 1. Retrieves and sets the seed from storage.
 * 2. Starts ldk with the necessary params.
 * 3. Adds/Connects saved peers from storage. (Note: Not needed as LDK handles this automatically once a peer has been added successfully. Only used to make example app easier to test.)
 * 4. Syncs LDK.
 */
export const setupLdk = async (): Promise<Result<string>> => {
	const electrum = selectedBackend === Backend.electrum ? true : false;
	try {
		await ldk.stop();
		const account = await getAccount();
		const storageRes = await lm.setBaseStoragePath(
			`${RNFS.DocumentDirectoryPath}/ldk/`,
		);
		if (storageRes.isErr()) {
			return err(storageRes.error);
		}

		const getTransactionData = electrum
			? electrumBackend.getTransactionData
			: mempoolBackend.getTransactionData;
		const getTransactionPosition = electrum
			? electrumBackend.getTransactionPosition
			: mempoolBackend.getTransactionPosition;
		const broadcastTransaction = electrum
			? electrumBackend.broadcastTransaction
			: mempoolBackend.broadcastTransaction;
		const getScriptPubKeyHistory = electrum
			? electrumBackend.getScriptPubKeyHistory
			: mempoolBackend.getScriptPubKeyHistory;

		const lmStart = await lm.start({
			getBestBlock,
			account,
			getAddress,
			getScriptPubKeyHistory,
			getFees: () =>
				Promise.resolve({
					highPriority: 10,
					normal: 5,
					background: 1,
				}),
			getTransactionData,
			getTransactionPosition,
			broadcastTransaction,
			network: ldkNetwork(selectedNetwork),
		});

		if (lmStart.isErr()) {
			return err(lmStart.error.message);
		}

		/*
		 * Note: This isn't needed once a peer has been add successfully.
		 * LDK stores peers in LDKData as they are added successfully and attempts to re-connect to them on-start.
		 * This is only here to make the example electrum app easier to work with for testing by pulling peers from constants.ts.
		 */
		try {
			const peersRes = await Promise.all(
				Object.keys(peers).map(async (peer) => {
					const addPeer = await lm.addPeer({
						...peers[peer],
						timeout: 5000,
					});
					if (addPeer.isErr()) {
						return err(addPeer.error.message);
					}
					return addPeer.value;
				}),
			);
			console.log('addPeer Responses:', JSON.stringify(peersRes));
		} catch (e) {
			return err(e.toString());
		}

		const nodeIdRes = await ldk.nodeId();
		if (nodeIdRes.isErr()) {
			return err(nodeIdRes.error.message);
		}

		Clipboard.setString(nodeIdRes.value);

		const syncRes = await lm.syncLdk();
		if (syncRes.isErr()) {
			return err(syncRes.error.message);
		}

		console.log(`Node ID: ${nodeIdRes.value}`);
		return ok('Running LDK'); //e2e test needs to see this string
	} catch (e) {
		return err(e.toString());
	}
};

/**
 * Used to backup a given account.
 * @param {TAccount} [account]
 * @returns {Promise<Result<string>>}
 */
export const backupAccount = async (
	account?: TAccount,
): Promise<Result<TAccountBackup>> => {
	if (!account) {
		account = await getAccount();
	}
	return await lm.backupAccount({
		account,
	});
};

/**
 * Used to import an account using the backup JSON string or TAccountBackup object.
 * @param {string | TAccountBackup} backup
 * @returns {Promise<Result<TAccount>>}
 */
export const importAccount = async (
	backup: string | TAccountBackup,
): Promise<Result<TAccount>> => {
	const importResponse = await lm.importAccount({
		backup,
		overwrite: true,
	});
	if (importResponse.isErr()) {
		return err(importResponse.error.message);
	}
	await setAccount(importResponse.value);
	await setItem(EAccount.currentAccountKey, importResponse.value.name);
	await setupLdk();
	await syncLdk();
	return ok(importResponse.value);
};

/**
 * Iterates over watch transactions for spends. Sets them as confirmed as needed.
 * @returns {Promise<boolean>}
 */
export const checkWatchTxs = async (): Promise<boolean> => {
	const checkedScriptPubKeys: string[] = [];
	const watchTransactionIds = lm.watchTxs.map((tx) => tx.txid);
	for (const watchTx of lm.watchTxs) {
		if (!checkedScriptPubKeys.includes(watchTx.script_pubkey)) {
			let scriptPubKeyHistory: { txid: string; height: number }[];
			if (selectedBackend === 'electrum') {
				scriptPubKeyHistory = await electrumBackend.getScriptPubKeyHistory(
					watchTx.script_pubkey,
				);
			} else {
				scriptPubKeyHistory = await mempoolBackend.getScriptPubKeyHistory(
					watchTx.script_pubkey,
				);
			}
			for (const data of scriptPubKeyHistory) {
				if (!watchTransactionIds.includes(data?.txid)) {
					let txData;
					if (selectedBackend === Backend.electrum) {
						txData = await electrumBackend.getTransactionData(data?.txid);
					} else {
						txData = await mempoolBackend.getTransactionData(data?.txid);
					}
					await ldk.setTxConfirmed({
						header: txData.header,
						height: txData.height,
						txData: [{ transaction: txData.transaction, pos: 0 }],
					});
					return true;
				}
			}
			checkedScriptPubKeys.push(watchTx.script_pubkey);
		}
	}
	return false;
};
