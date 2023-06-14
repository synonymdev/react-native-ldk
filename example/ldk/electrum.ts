import * as electrum from 'rn-electrum-client/helpers';
import {
	DefaultTransactionDataShape,
	TTransactionData,
	TTransactionPosition,
} from '@synonymdev/react-native-ldk';
import { selectedNetwork } from '../utils/constants';
import { getBlockHeader, getBlockHex } from '../electrum';
import {
	getAddressFromScriptPubKey,
	getNetwork,
	getScriptHash,
} from '../utils/helpers';
import * as bitcoin from 'bitcoinjs-lib';
import { TGetAddressHistory } from '../utils/types';

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
	const { confirmations, hex: hex_encoded_tx, vout } = response.data[0].result;
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
	const voutData = vout.map(({ n, value, scriptPubKey: { hex } }) => {
		return { n, hex, value };
	});
	return {
		header: hexEncodedHeader.value,
		height: confirmedHeight,
		transaction: hex_encoded_tx,
		vout: voutData,
	};
};

/**
 * Returns the position/index of the provided tx_hash within a block.
 * @param {string} tx_hash
 * @param {number} height
 * @returns {Promise<number>}
 */
export const getTransactionPosition = async ({
	tx_hash,
	height,
}): Promise<TTransactionPosition> => {
	const response = await electrum.getTransactionMerkle({
		tx_hash,
		height,
		network: selectedNetwork,
	});
	if (response.error || isNaN(response.data?.pos || response.data?.pos < 0)) {
		return -1;
	}
	return response.data.pos;
};

/**
 * Attempts to broadcast the provided rawTx.
 * @param {string} rawTx
 * @returns {Promise<string>}
 */
export const broadcastTransaction = async (rawTx: string): Promise<string> => {
	try {
		const response = await electrum.broadcastTransaction({
			rawTx,
			network: selectedNetwork,
		});
		console.log('broadcastTransaction', response);
		return response.data;
	} catch (e) {
		console.log(e);
		return '';
	}
};

/**
 * Returns the balance in sats of the provided Bitcoin address.
 * @param {string} [address]
 * @returns {Promise<number>}
 */
export const getAddressBalance = async (address = ''): Promise<number> => {
	try {
		const network = getNetwork(selectedNetwork);
		const script = bitcoin.address.toOutputScript(address, network);
		let hash = bitcoin.crypto.sha256(script);
		const reversedHash = new Buffer(hash.reverse());
		const scriptHash = reversedHash.toString('hex');
		const response = await electrum.getAddressScriptHashBalance({
			scriptHash,
			network: selectedNetwork,
		});
		if (response.error) {
			return 0;
		}
		const { confirmed, unconfirmed } = response.data;
		return confirmed + unconfirmed;
	} catch {
		return 0;
	}
};

export const getScriptPubKeyHistory = async (
	scriptPubkey: string,
): Promise<TGetAddressHistory[]> => {
	try {
		const address = getAddressFromScriptPubKey(scriptPubkey);
		const scriptHash = getScriptHash(address);
		const response = await electrum.getAddressScriptHashesHistory({
			scriptHashes: [scriptHash],
			network: selectedNetwork,
		});

		/*
		const mempoolResponse = await electrum.getAddressScriptHashesMempool({
			scriptHashes: [scriptHash],
			network: selectedNetwork,
		});

		if (response.error || mempoolResponse.error) {
			return [];
		}
		const combinedResponse = [...response.data, ...mempoolResponse.data];
		*/

		let history: { txid: string; height: number }[] = [];
		await Promise.all(
			response.data.map(({ result }): void => {
				if (result && result?.length > 0) {
					result.map((item) => {
						// @ts-ignore
						history.push({
							txid: item?.tx_hash ?? '',
							height: item?.height ?? 0,
						});
					});
				}
			}),
		);

		return history;
	} catch {
		return [];
	}
};
