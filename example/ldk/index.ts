import AsyncStorage from '@react-native-async-storage/async-storage';
import * as electrum from 'rn-electrum-client/helpers';
import { err, ok, Result } from '../utils/result';
import Clipboard from '@react-native-clipboard/clipboard';
import {
	getBlockHashFromHeight,
	getBlockHeader,
	getBlockHex,
} from '../electrum';
import lm, {
	THeader,
	TTransactionData,
	DefaultTransactionDataShape,
	TAccount,
	TAccountBackup,
} from '@synonymdev/react-native-ldk';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';
import { selectedNetwork, peers } from '../utils/constants';
import { getAccount, setAccount } from '../utils/helpers';
import { EAccount } from '../utils/types';

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
	return await lm.syncLdk();
};

/**
 * Used to spin-up LDK services.
 * In order, this method:
 * 1. Fetches and sets the genesis hash.
 * 2. Retrieves and sets the seed from storage.
 * 3. Starts ldk with the necessary params.
 * 4. Adds/Connects saved peers from storage. (Note: Not needed as LDK handles this automatically once a peer has been added successfully. Only used to make example app easier to test.)
 * 5. Syncs LDK.
 */
export const setupLdk = async (): Promise<Result<string>> => {
	try {
		await ldk.reset();
		const genesisHash = await getBlockHashFromHeight({
			height: 0,
		});
		if (genesisHash.isErr()) {
			return err(genesisHash.error.message);
		}
		const account = await getAccount();
		const lmStart = await lm.start({
			getBestBlock,
			genesisHash: genesisHash.value,
			setItem,
			getItem,
			account,
			getTransactionData,
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

		await lm.syncLdk();

		console.log(`Node ID: ${nodeIdRes.value}`);
		return ok('Running LDK'); //e2e test needs to see this string
	} catch (e) {
		return err(e.toString());
	}
};

/**
 * Returns the transaction header, height and hex (transaction) for a given txid.
 * @param {string} txId
 * @returns {Promise<TTransactionData>}
 */
export const getTransactionData = async (
	txId: string = '',
): Promise<TTransactionData> => {
	let transactionData = DefaultTransactionDataShape;
	const data = {
		key: 'tx_hash',
		data: [
			{
				tx_hash: txId,
			},
		],
	};
	const response = await electrum.getTransactions({
		txHashes: data,
		network: selectedNetwork,
	});

	if (response.error || !response.data || response.data[0].error) {
		return transactionData;
	}
	const { confirmations, hex: hex_encoded_tx } = response.data[0].result;
	const header = await getBlockHeader();
	const currentHeight = header.height;
	let confirmedHeight = 0;
	if (confirmations) {
		confirmedHeight = currentHeight - confirmations + 1;
	}
	const hexEncodedHeader = await getBlockHex({
		height: confirmedHeight,
	});
	if (hexEncodedHeader.isErr()) {
		return transactionData;
	}
	return {
		header: hexEncodedHeader.value,
		height: confirmedHeight,
		transaction: hex_encoded_tx,
	};
};

/**
 * Used to backup a given account.
 * @param {TAccount} [account]
 * @returns {Promise<Result<string>>}
 */
export const backupAccount = async (
	account?: TAccount,
): Promise<Result<string>> => {
	if (!account) {
		account = await getAccount();
	}
	return await lm.backupAccount({
		account,
		setItem,
		getItem,
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
		setItem,
		getItem,
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
