import Keychain from 'react-native-keychain';
import {
	TAccount,
	TAvailableNetworks,
	IAddress,
} from '@synonymdev/react-native-ldk';
import { getItem, setItem } from '../ldk';
import { EAccount, TWallet } from './types';
import { err, ok, Result } from './result';
// @ts-ignore
import { randomBytes } from 'react-native-randombytes';
import * as bitcoin from 'bitcoinjs-lib';
import { selectedNetwork } from './constants';
import RNFS from 'react-native-fs';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import { ENetworks } from '@synonymdev/react-native-ldk/dist/utils/types';
import networks from '@synonymdev/react-native-ldk/dist/utils/networks';

/**
 * Use Keychain to save LDK name & seed.
 * @param {string} [key]
 * @param {string} seed
 */
export const setWallet = async ({
	name = EAccount.name,
	mnemonic = createMnemonic(),
}: TWallet): Promise<boolean> => {
	try {
		const wallet = {
			name,
			mnemonic,
		};
		await Keychain.setGenericPassword(name, JSON.stringify(wallet), {
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
export const getWallet = async (accountName?: string): Promise<TWallet> => {
	if (!accountName) {
		accountName = await getCurrentAccountName();
	}
	const defaultWallet: TWallet = {
		name: EAccount.name,
		mnemonic: createMnemonic(),
	};
	try {
		let result = await Keychain.getGenericPassword({ service: accountName });
		if (result && result?.password) {
			return JSON.parse(result.password);
		} else {
			// Setup default account.
			await setWallet({ name: accountName, mnemonic: defaultWallet.mnemonic });
			return defaultWallet;
		}
	} catch (e) {
		console.log(e);
		return defaultWallet;
	}
};

export const getAccount = async (accountName?: string): Promise<TAccount> => {
	const wallet = await getWallet(accountName);
	return {
		name: wallet.name,
		seed: await getLdkSeed(wallet.mnemonic),
	};
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
			const accountExists = await RNFS.exists(
				`${RNFS.DocumentDirectoryPath}/ldk/wallet${num}`,
			);
			if (accountExists) {
				num++;
			} else {
				emptyAccount = true;
			}
		}
		const name = `wallet${num}`;
		const mnemonic = createMnemonic();

		const account: TAccount = {
			name,
			seed: await getLdkSeed(mnemonic),
		};
		await setWallet({ name, mnemonic });
		return ok(account);
	} catch (e) {
		console.log(e);
		return err(e);
	}
};

export const createMnemonic = (): string => {
	return bip39.entropyToMnemonic(randomBytes(32));
};

/**
 * Returns seed derived from mnemonic that is compatible with LDK-Node.
 * @returns {Promise<string>}
 */
export const getLdkSeed = async (mnumonic: string): Promise<string> => {
	const mnemonicSeed = await bip39.mnemonicToSeed(mnumonic);
	const root = bip32.fromSeed(mnemonicSeed, getNetwork(selectedNetwork));
	return root.privateKey!.toString('hex');
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
			return networks.bitcoin;
		case 'bitcoinTestnet':
			return networks.testnet;
		case 'bitcoinRegtest':
			return networks.regtest;
		case 'bitcoinSignet':
			return networks.signet;
		default:
			return networks.regtest;
	}
};

/**
 * Converts address to output script.
 * @param {string} address
 * @returns {string}
 */
export const getOutputScript = (address: string): string => {
	const _network = getNetwork(selectedNetwork);
	return bitcoin.address.toOutputScript(address, _network).toString('hex');
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

/**
 * @param {string} accountSeed
 * @returns {string}
 */
export const getMnemonicPhraseFromSeed = (accountSeed: string): string => {
	return bip39.entropyToMnemonic(accountSeed);
};

/**
 * Returns a single test address used for channel closures.
 * @returns {Promise<string>}
 */
export const getAddress = async (): Promise<IAddress> => {
	const network = getNetwork(selectedNetwork);

	const { mnemonic } = await getWallet();
	const mnemonicSeed = await bip39.mnemonicToSeed(mnemonic);
	const root = bip32.fromSeed(mnemonicSeed, network);
	const keyPair = root.derivePath("m/84'/1'/0'/0/0");
	const publicKey = keyPair.publicKey.toString('hex');
	const address =
		bitcoin.payments.p2wpkh({
			pubkey: keyPair.publicKey,
			network,
		}).address ?? '';

	return {
		address,
		publicKey,
	};
};

export const ldkNetwork = (network: TAvailableNetworks): ENetworks => {
	switch (network) {
		case 'bitcoinRegtest':
			return ENetworks.regtest;
		case 'bitcoinTestnet':
			return ENetworks.testnet;
		case 'bitcoin':
			return ENetworks.mainnet;
		case 'bitcoinSignet':
			return ENetworks.signet;
	}
};
