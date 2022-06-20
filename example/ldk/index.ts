import AsyncStorage from '@react-native-async-storage/async-storage';
import { THeader, IHeader, TTransactionData } from '../../src';
import * as electrum from 'rn-electrum-client/helpers';
import { err, ok, Result } from '../utils/result';
import Clipboard from '@react-native-clipboard/clipboard';
import {
	getBlockHashFromHeight,
	getBlockHeader,
	getBlockHex,
} from '../electrum';
import lm from '@synonymdev/react-native-ldk';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';
import { selectedNetwork, peers } from '../utils/constants';

export const getItem = async (key = ''): Promise<any> => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (e) {
		console.log(e);
		return '';
	}
};

export const setItem = async (key = '', value = ''): Promise<any> => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (e) {
		console.log(e);
	}
};

export const getBestBlock = async (): Promise<THeader> => {
	const bestBlock = await getItem('header');
	return bestBlock ? JSON.parse(bestBlock) : { height: 0, hex: '', hash: '' };
};

export const updateHeader = async ({ header }: { header: IHeader }) => {
	return await setItem('header', JSON.stringify(header));
};

export const syncLdk = async (): Promise<Result<string>> => {
	return await lm.syncLdk();
};

/**
 * Used to spin-up LDK services.
 * In order, this method:
 * 1. Fetches and sets the genesis hash.
 * 2. Retrieves and sets the seed from storage.
 * 3. Starts ldk with the necessary params.
 * 4. Adds/Connects saved peers from storage.
 * 5. Syncs LDK.
 */
export const setupLdk = async (): Promise<Result<string>> => {
	try {
		const genesisHash = await getBlockHashFromHeight({
			height: 0,
		});
		if (genesisHash.isErr()) {
			return err(genesisHash.error.message);
		}
		let seed = await getItem('ldkseed');
		if (!seed) {
			seed = dummyRandomSeed();
			await setItem('ldkseed', seed);
		}
		const lmStart = await lm.start({
			getBestBlock,
			genesisHash: genesisHash.value,
			isExistingNode: true,
			setItem,
			getItem,
			seed,
			getTransactionData,
		});

		if (lmStart.isErr()) {
			return err(lmStart.error.message);
		}

		//TODO: Retrieve peers from storage and add them on setup.
		try {
			const peersRes = await Promise.all(
				Object.keys(peers).map(async (peer) => {
					const addPeer = await ldk.addPeer({
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
		return ok(`Node ID: ${nodeIdRes.value}`);
	} catch (e) {
		return err(e.toString());
	}
};

const shuffle = (array: string[]): string[] => {
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
};

export const dummyRandomSeed = (): string => {
	if (!__DEV__) {
		throw new Error('Use random bytes instead of dummyRandomSeed');
	}

	const bytes =
		'8a bd ac 77 55 2a 6e a6 0a 47 2f bf 6c d8 d5 af b4 78 19 96 a4 d2 e2 81 7c ae 6e 2b 38 ae 56 fd';

	return shuffle(bytes.split(' ')).join('');
};

const getTransactionData = async (
	txId: string = '',
): Promise<Result<TTransactionData>> => {
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
	if (response.error) {
		return err(response);
	}
	const { confirmations, hex: hex_encoded_tx } = response.data[0].result;
	const header = await getBlockHeader();
	const currentHeight = header.height;
	let confirmedHeight = 0;
	if (confirmations) {
		confirmedHeight = currentHeight - confirmations;
	}
	const hexEncodedHeader = await getBlockHex({
		height: confirmedHeight,
	});
	if (hexEncodedHeader.isErr()) {
		return err(hexEncodedHeader.error.message);
	}
	return ok({
		header: hexEncodedHeader.value,
		height: confirmedHeight,
		transaction: hex_encoded_tx,
	});
};
