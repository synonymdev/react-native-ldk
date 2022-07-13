import Keychain from 'react-native-keychain';
import { ELdkData, TAccount } from '@synonymdev/react-native-ldk';
import { getItem, setItem } from '../ldk';
import { EAccount } from './types';
import { getLdkStorageKey } from '@synonymdev/react-native-ldk/dist/utils/helpers';
import { err, ok, Result } from './result';
import { randomBytes } from 'react-native-randombytes';

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
