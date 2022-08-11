import Keychain from 'react-native-keychain';
import {
	ELdkData,
	TAccount,
	TAvailableNetworks,
} from '@synonymdev/react-native-ldk';
import { getItem, setItem } from '../ldk';
import { EAccount } from './types';
import { getLdkStorageKey } from '@synonymdev/react-native-ldk/dist/utils/helpers';
import { err, ok, Result } from './result';
import { randomBytes } from 'react-native-randombytes';
import * as bitcoin from 'bitcoinjs-lib';
import { selectedNetwork } from './constants';

/**
 * Use Keychain to save LDK name & seed.
 * @param {string} [key]
 * @param {string} seed
 */
export const setAccount = async ({
	name = EAccount.name,
	seed = randomSeed(),
}: TAccount): Promise<boolean> => {
	try {
		const account: TAccount = {
			name,
			seed,
		};
		await Keychain.setGenericPassword(name, JSON.stringify(account), {
			service: name,
		});
		await setItem(EAccount.currentAccountKey, name);
		return true;
	} catch {
		return false;
	}
};

/**
 * Use Keychain to retrieve LDK name & seed.
 * @param {string} [accountName]
 * @returns {Promise<string>}
 */
export const getAccount = async (accountName?: string): Promise<TAccount> => {
	if (!accountName) {
		accountName = await getCurrentAccountName();
	}
	const defaultAccount: TAccount = {
		name: EAccount.name,
		seed: randomSeed(),
	};
	try {
		let result = await Keychain.getGenericPassword({ service: accountName });
		if (result && result?.password) {
			// Return existing account.
			return JSON.parse(result?.password);
		} else {
			// Setup default account.
			await setAccount(defaultAccount);
			return defaultAccount;
		}
	} catch (e) {
		console.log(e);
		return defaultAccount;
	}
};

/**
 * Returns current account name, if any.
 * @returns {Promise<string>}
 */
export const getCurrentAccountName = async (): Promise<string> => {
	const currentAccountName = await getItem(EAccount.currentAccountKey);
	return currentAccountName ?? EAccount.name;
};

/**
 * Creates and saves new name/seed pair.
 * @returns {Promise<TAccount>}
 */
export const createNewAccount = async (): Promise<Result<TAccount>> => {
	try {
		let emptyAccount = false;
		const currentAccountName = await getCurrentAccountName();
		let num = Number(currentAccountName.replace('wallet', ''));
		while (emptyAccount === false) {
			const channelManagerStorageKey = getLdkStorageKey(
				`wallet${num}`,
				ELdkData.channelManager,
			);
			const channelData = await getItem(channelManagerStorageKey);
			if (channelData) {
				num++;
			} else {
				emptyAccount = true;
			}
		}
		const name = `wallet${num}`;
		const account: TAccount = {
			name,
			seed: randomSeed(),
		};
		await setAccount(account);
		return ok(account);
	} catch (e) {
		console.log(e);
		return err(e);
	}
};

export const randomSeed = (): string => {
	return randomBytes(32).toString('hex');
};

/**
 * Returns the appropriate bitcoinjs-lib network object.
 * @param network
 * @returns {bitcoin.networks.Network}
 */
export const getNetwork = (
	network: TAvailableNetworks,
): bitcoin.networks.Network => {
	switch (network) {
		case 'bitcoin':
			return bitcoin.networks.bitcoin;
		case 'bitcoinTestnet':
			return bitcoin.networks.testnet;
		case 'bitcoinRegtest':
			return bitcoin.networks.regtest;
		default:
			return bitcoin.networks.regtest;
	}
};

/**
 * Get scriptHash for a given address
 * @param {string} address
 * @returns {string}
 */
export const getScriptHash = (address: string): string => {
	try {
		const _network = getNetwork(selectedNetwork);
		const script = bitcoin.address.toOutputScript(address, _network);
		let hash = bitcoin.crypto.sha256(script);
		const reversedHash = new Buffer(hash.reverse());
		return reversedHash.toString('hex');
	} catch (e) {
		console.log(e);
		return '';
	}
};

/**
 * Get address for a given scriptPubKey.
 * @param scriptPubKey
 * @returns {string}
 */
export const getAddressFromScriptPubKey = (scriptPubKey: string): string => {
	return bitcoin.address.fromOutputScript(
		Buffer.from(scriptPubKey, 'hex'),
		getNetwork(selectedNetwork),
	);
};
