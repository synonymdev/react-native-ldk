import Keychain from 'react-native-keychain';
import { ELdkData, TAccount } from '@synonymdev/react-native-ldk';
import { getItem, setItem } from '../ldk';
import { EAccount } from './types';
import { getLdkStorageKey } from '@synonymdev/react-native-ldk/dist/utils/helpers';
import { err, ok, Result } from './result';

/**
 * Use Keychain to save LDK name & seed.
 * @param {string} [key]
 * @param {string} seed
 */
export const setAccount = async ({
	name = EAccount.name,
	seed = dummyRandomSeed(),
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
		seed: dummyRandomSeed(),
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
			seed: dummyRandomSeed(),
		};
		await setAccount(account);
		return ok(account);
	} catch (e) {
		console.log(e);
		return err(e);
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
