import {
	DefaultLdkDataShape,
	ELdkData,
	ELdkStorage,
	ENetworks,
	TLdkStart,
	TLdkStorage,
	TLdkStorageKeys,
	TStorage,
} from './types';
import { err, ok, Result } from './result';

/**
 * Convert string to bytes
 * @param str
 * @returns {Uint8Array}
 */
export const stringToBytes = (str: string): Uint8Array => {
	return Uint8Array.from(str, (x) => x.charCodeAt(0));
};

/**
 * Converts bytes to readable string
 * @returns {string}
 * @param bytes
 */
export const bytesToString = (bytes: Uint8Array): string => {
	const arr: number[] = [];
	bytes.forEach((n) => arr.push(n));
	return String.fromCharCode.apply(String, arr);
};

/**
 * Converts bytes to hex string
 * @param bytes
 * @returns {string}
 */
// export const bytesToHexString = (bytes: Uint8Array): string => {
// 	return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
// };

/**
 * Converts hex string to bytes
 * @param hexString
 * @returns {Uint8Array}
 */
export const hexStringToBytes = (hexString: string): Uint8Array => {
	return new Uint8Array(
		(hexString.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)),
	);
};

/**
 * Split '_' separated words and convert to uppercase
 * @param  {string} value     The input string
 * @param  {string} separator The separator to be used
 * @param  {string} split     The split char that concats the value
 * @return {string}           The words conected with the separator
 */
export const toCaps = (
	value: string = '',
	separator: string = ' ',
	split: string = '-',
): string => {
	return value
		.split(split)
		.map((v) => v.charAt(0).toUpperCase() + v.substring(1))
		.reduce((a, b) => `${a}${separator}${b}`);
};

const chars =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const btoa = (input: string): string => {
	let str = input;
	let output = '';

	for (
		let block = 0, charCode, i = 0, map = chars;
		// eslint-disable-next-line no-bitwise
		str.charAt(i | 0) || ((map = '='), i % 1);
		// eslint-disable-next-line no-bitwise
		output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
	) {
		charCode = str.charCodeAt((i += 3 / 4));

		if (charCode > 0xff) {
			throw new Error(
				"'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
			);
		}
		// eslint-disable-next-line no-bitwise
		block = (block << 8) | charCode;
	}

	return output;
};

export const getDefaultLdkStorageShape = (seed: string): TLdkStorage => {
	return {
		[seed]: DefaultLdkDataShape,
	};
};

/**
 * This method runs a check on each parameter passed to the start method
 * to ensure that they are providing the expected data.
 * @param {string} seed
 * @param {string} genesisHash
 * @param {TGetBestBlock} getBestBlock
 * @param {TStorage} getItem
 * @param {TStorage} setItem
 * @param {TGetTransactionData} getTransactionData
 * @param {ENetworks} network
 * @returns {Promise<Result<string>>}
 */
export const startParamCheck = async ({
	account,
	genesisHash,
	getBestBlock,
	getItem,
	setItem,
	getTransactionData,
	network = ENetworks.regtest,
}: TLdkStart): Promise<Result<string>> => {
	try {
		// Test Network
		if (typeof network !== 'string') {
			return err('network must be a string.');
		}
		if (
			!(
				network === ENetworks.mainnet ||
				network === ENetworks.testnet ||
				network === ENetworks.regtest
			)
		) {
			return err(
				`The provided network (${network}) is invalid. It must be either '${ENetworks.mainnet}', '${ENetworks.testnet}' or '${ENetworks.regtest}'.`,
			);
		}

		// Test account
		if (typeof account !== 'object') {
			return err('account must be an object.');
		}
		if (!account?.name || !account?.seed) {
			return err('account must contain both a name and seed.');
		}

		// Test genesisHash
		if (typeof genesisHash !== 'string') {
			return err('genesisHash must be a string.');
		}
		if (typeof genesisHash !== 'string') {
			return err('genesisHash must be a string.');
		}

		// Test getBestBlock
		if (!isFunction(getBestBlock)) {
			return err('getBestBlock must be a function.');
		}
		const bestBlock = await getBestBlock();
		if (!bestBlock?.hex || !bestBlock.height || !bestBlock.hash) {
			return err('getBestBlock is not providing the expected data.}');
		}

		// Test setItem & getItem
		const setAndGetCheckResponse = await setAndGetMethodCheck({
			setItem,
			getItem,
		});
		if (setAndGetCheckResponse.isErr()) {
			return err(setAndGetCheckResponse.error.message);
		}

		// Test getTransactionData
		if (!isFunction(getTransactionData)) {
			return err('getTransactionData must be a function.');
		}
		// Test getTransactionData response if using mainnet or testnet.
		if (network !== ENetworks.regtest) {
			const expectedData = {
				[ENetworks.mainnet]: {
					txid: '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098',
					data: {
						header:
							'010000006fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000982051fd1e4ba744bbbe680e1fee14677ba1a3c3540bf7b1cdb606e857233e0e61bc6649ffff001d01e36299',
						height: 1,
						transaction:
							'01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000',
					},
				},
				[ENetworks.testnet]: {
					txid: 'f0315ffc38709d70ad5647e22048358dd3745f3ce3874223c80a7c92fab0c8ba',
					data: {
						header:
							'0100000043497fd7f826957108f4a30fd9cec3aeba79972084e90ead01ea330900000000bac8b0fa927c0ac8234287e33c5f74d38d354820e24756ad709d7038fc5f31f020e7494dffff001d03e4b672',
						height: 1,
						transaction:
							'01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0e0420e7494d017f062f503253482fffffffff0100f2052a010000002321021aeaf2f8638a129a3156fbe7e5ef635226b0bafd495ff03afe2c843d7e3a4b51ac00000000',
					},
				},
			};
			const transactionData = await getTransactionData(
				expectedData[network].txid,
			);
			if (
				JSON.stringify(transactionData) !==
				JSON.stringify(expectedData[network].data)
			) {
				return err('getTransactionData is not returning the expected data.');
			}
		}
		return ok('Params passed all checks.');
	} catch (e) {
		return err(e);
	}
};

const isFunction = (f: any): boolean => {
	try {
		return f && {}.toString.call(f) === '[object Function]';
	} catch {
		return false;
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

/**
 * Used to test the setItem & getItem methods passed to react-native-ldk by the dev/user/software.
 * @param {TStorage} setItem
 * @param {TStorage} getItem
 * @returns {Promise<Result<boolean>>}
 */
export const setAndGetMethodCheck = async ({
	setItem,
	getItem,
}: {
	getItem: TStorage;
	setItem: TStorage;
}): Promise<Result<boolean>> => {
	// Test setItem & getItem
	if (!setItem || !isFunction(setItem)) {
		return err('setItem must be a function.');
	}
	if (!getItem || !isFunction(getItem)) {
		return err('getItem must be a function.');
	}
	const rand = Math.random().toString();
	await setItem('ldkstoragetest', rand);
	const getTest = await getItem('ldkstoragetest');
	if (getTest !== rand) {
		return err('setItem & getItem are not able to access storage.');
	}
	return ok(true);
};

export const getLdkStorageKey = (
	accountName: string,
	ldkDataKey: ELdkData,
): string => {
	return `${ELdkStorage.key}${accountName}${ldkDataKey}`;
};

/**
 * Returns the storage key for each key value in ELdkData for the given account name.
 * @param {string} accountName
 * @returns {Promise<TLdkStorageKeys>}
 */
export const getAllStorageKeys = async (
	accountName = '',
): Promise<TLdkStorageKeys> => {
	const storageKeys: TLdkStorageKeys = {
		[ELdkData.channelManager]: '',
		[ELdkData.channelData]: '',
		[ELdkData.peers]: '',
		[ELdkData.networkGraph]: '',
		[ELdkData.timestamp]: '0',
	};
	await Promise.all(
		Object.values(ELdkData).map((ldkDataKey) => {
			const storageKey = getLdkStorageKey(accountName, ldkDataKey);
			storageKeys[ldkDataKey] = storageKey;
		}),
	);
	return storageKeys;
};

export const parseData = (data: string, fallback: any): any => {
	try {
		return data ? JSON.parse(data) : fallback;
	} catch {
		return fallback;
	}
};
