import { ENetworks, TLdkStart } from './types';
import { err, ok, Result } from './result';
import * as bitcoin from 'bitcoinjs-lib';
import { bech32m } from 'bech32';
import networks from './networks';
/**
 * This method runs a check on each parameter passed to the start method
 * to ensure that they are providing the expected data.
 * @param {string} seed
 * @param {TGetBestBlock} getBestBlock
 * @param {TGetTransactionData} getTransactionData
 * @param {TBroadcastTransaction} broadcastTransaction
 * @param {TGetAddress} getAddress
 * @param {TGetScriptPubKeyHistory} getScriptPubKeyHistory
 * @param {ENetworks} network
 * @returns {Promise<Result<string>>}
 */
export const startParamCheck = async ({
	account,
	getBestBlock,
	getTransactionData,
	getTransactionPosition,
	broadcastTransaction,
	getAddress,
	getScriptPubKeyHistory,
	getFees,
	network = ENetworks.regtest,
}: TLdkStart): Promise<Result<string>> => {
	try {
		// Test Network
		if (typeof network !== 'string') {
			return err('network must be a string.');
		}

		if (!Object.values(ENetworks).includes(network)) {
			return err(
				`The provided network (${network}) is invalid. It must on of the following: '${Object.values(
					ENetworks,
				).join(', ')}'.`,
			);
		}

		// Test account
		if (typeof account !== 'object') {
			return err('account must be an object.');
		}
		if (!account?.name || !account?.seed) {
			return err('account must contain both a name and seed.');
		}

		// Test getBestBlock
		if (!isFunction(getBestBlock)) {
			return err('getBestBlock must be a function.');
		}
		const bestBlock = await getBestBlock();
		if (!bestBlock?.hex || !bestBlock.height || !bestBlock.hash) {
			return err('getBestBlock is not providing the expected data.');
		}

		// Test getTransactionData
		if (!isFunction(getTransactionData)) {
			return err('getTransactionData must be a function.');
		}

		// Test getTransactionPosition
		if (!isFunction(getTransactionPosition)) {
			return err('getTransactionPosition must be a function.');
		}

		// Test getAddress
		if (!isFunction(getAddress)) {
			return err('getAddress must be a function.');
		}

		// Test getScriptPubKeyHistory
		if (!isFunction(getScriptPubKeyHistory)) {
			return err('getScriptPubKeyHistory must be a function.');
		}

		// Test getFees
		if (!isFunction(getFees)) {
			return err('getFees must be a function.');
		}

		if (!isFunction(broadcastTransaction)) {
			return err('broadcastTransaction must be a function.');
		}

		// Test getTransactionData response if using mainnet or testnet.
		if (network === ENetworks.mainnet || network === ENetworks.testnet) {
			const expectedData = {
				[ENetworks.mainnet]: {
					txid: '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098',
					data: {
						pos: 0,
						header:
							'010000006fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000982051fd1e4ba744bbbe680e1fee14677ba1a3c3540bf7b1cdb606e857233e0e61bc6649ffff001d01e36299',
						height: 1,
						transaction:
							'01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000',
						vout: [
							{
								n: 0,
								hex: '410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac',
								value: 50,
							},
						],
					},
				},
				[ENetworks.testnet]: {
					txid: 'f0315ffc38709d70ad5647e22048358dd3745f3ce3874223c80a7c92fab0c8ba',
					data: {
						pos: 0,
						header:
							'0100000043497fd7f826957108f4a30fd9cec3aeba79972084e90ead01ea330900000000bac8b0fa927c0ac8234287e33c5f74d38d354820e24756ad709d7038fc5f31f020e7494dffff001d03e4b672',
						height: 1,
						transaction:
							'01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0e0420e7494d017f062f503253482fffffffff0100f2052a010000002321021aeaf2f8638a129a3156fbe7e5ef635226b0bafd495ff03afe2c843d7e3a4b51ac00000000',
						vout: [
							{
								n: 0,
								hex: '21021aeaf2f8638a129a3156fbe7e5ef635226b0bafd495ff03afe2c843d7e3a4b51ac',
								value: 50,
							},
						],
					},
				},
			};
			const transactionData = await getTransactionData(
				expectedData[network].txid,
			);
			const data = expectedData[network].data;
			if (transactionData?.header !== data.header) {
				return err('getTransactionData is not returning the expected header.');
			}
			if (transactionData?.height !== data.height) {
				return err('getTransactionData is not returning the expected height.');
			}
			if (transactionData?.transaction !== data.transaction) {
				return err(
					'getTransactionData is not returning the expected transaction.',
				);
			}
			if (!transactionData?.vout || !Array.isArray(transactionData?.vout)) {
				return err(
					'getTransactionData is not returning the expected vout array.',
				);
			}
			if (transactionData.vout[0]?.n !== data.vout[0].n) {
				return err(
					'getTransactionData is not returning the expected vout[0].n',
				);
			}
			if (transactionData.vout[0]?.hex !== data.vout[0].hex) {
				return err(
					'getTransactionData is not returning the expected vout[0].hex',
				);
			}
			if (transactionData.vout[0]?.value !== data.vout[0].value) {
				return err(
					'getTransactionData is not returning the expected vout[0].value',
				);
			}

			const transactionPosition = await getTransactionPosition({
				tx_hash: expectedData[network].txid,
				height: expectedData[network].data.height,
			});
			if (isNaN(transactionPosition)) {
				return err('getTransactionPosition is not returning a number.');
			}
			if (transactionPosition < 0) {
				return err('getTransactionPosition is returning a negative integer.');
			}
			if (transactionPosition !== data.pos) {
				return err(
					'getTransactionPosition is not returning the expected transaction position.',
				);
			}

			//TODO validate entire object
			const address = (await getAddress()).address;
			if (typeof address !== 'string') {
				return err('getAddress is not returning the expected data.');
			}
			if (!validateAddress({ address, network })) {
				return err(
					`getAddress is not returning valid addresses (${address}) for the specified network (${network}).`,
				);
			}
		}
		return ok('Params passed all checks.');
	} catch (e) {
		return err(e);
	}
};

/**
 * Attempts to validate the provided address.
 * @param {string} address
 * @param {ENetworks} network
 */
const validateAddress = ({
	address = '',
	network = ENetworks.mainnet,
}: {
	address: string;
	network: ENetworks;
}): boolean => {
	try {
		// @ts-ignore
		bitcoin.address.toOutputScript(address, networks[network]);
		return true;
	} catch (e) {
		return false;
	}
};

/**
 * Extracts actual invoice string request from common formats that include lightning invoices
 * @param invoice
 * @returns {string}
 */
export const extractPaymentRequest = (paymentRequest: string): string => {
	let result = paymentRequest.replace('lightning:', '').toLowerCase();
	result = result.replace('bitcoin:', '').toLowerCase();
	result = result.replace(/[^\x00-\x7F]/g, ''); //Strip anything not utf8 to avoid LDK crashes

	//TODO support bip21 and other common formats
	return result;
};

const isFunction = (f: any): boolean => {
	try {
		return f && {}.toString.call(f) === '[object Function]';
	} catch {
		return false;
	}
};

export const parseData = (data: string, fallback: any): any => {
	try {
		return data ? JSON.parse(data) : fallback;
	} catch {
		return fallback;
	}
};

export const appendPath = (path1: string, path2: string): string => {
	return `${path1}${path1.slice(-1) === '/' ? '' : '/'}${path2}`;
};

export const promiseTimeout = <T>(
	ms: number,
	promise: Promise<any>,
): Promise<T> => {
	let id: NodeJS.Timeout | undefined;
	let timeout = new Promise((resolve) => {
		id = setTimeout(() => {
			resolve(err('Timed Out.'));
		}, ms);
	});
	return Promise.race([promise, timeout]).then((result) => {
		clearTimeout(id);
		return result;
	});
};

type TFindOutputsFromRawTxsRes = {
	outputScriptPubKey: string;
	outputValue: number;
	outpointTxId: string;
	outpointIndex: number;
};
export const findOutputsFromRawTxs = (
	rawTxs: string[],
	txId: string,
	index: number,
): TFindOutputsFromRawTxsRes | undefined => {
	let result: TFindOutputsFromRawTxsRes | undefined;
	for (const hexTx of rawTxs) {
		const tx = bitcoin.Transaction.fromHex(hexTx);
		if (tx.getId() !== txId) {
			continue;
		}

		if (tx.outs.length <= index) {
			continue;
		}

		const output = tx.outs[index];

		result = {
			outputScriptPubKey: output.script.toString('hex'),
			outputValue: output.value,
			outpointTxId: txId,
			outpointIndex: index,
		};
	}

	return result;
};

/**
 * Pauses execution of a function.
 * @param {number} ms The time to wait in milliseconds.
 * @returns {Promise<void>}
 */
export const sleep = (ms = 1000): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

/**
 * Returns if the provided string is a valid Bech32m encoded string (taproot/p2tr address) and if so, which network.
 * @param {string} address
 * @returns { isValid: boolean; network: ENetworks }
 */
export const isValidBech32mEncodedString = (
	address: string,
): { isValid: boolean; network: ENetworks } => {
	try {
		const decoded = bech32m.decode(address);
		if (decoded.prefix === 'bc') {
			return { isValid: true, network: ENetworks.mainnet };
		} else if (decoded.prefix === 'tb') {
			return { isValid: true, network: ENetworks.testnet };
		} else if (decoded.prefix === 'bcrt') {
			return { isValid: true, network: ENetworks.regtest };
		}
	} catch (error) {
		return { isValid: false, network: ENetworks.mainnet };
	}
	return { isValid: false, network: ENetworks.mainnet };
};
