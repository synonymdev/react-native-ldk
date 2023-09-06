import Keychain from 'react-native-keychain';
import {
	EEventTypes,
	TAccount,
	TAvailableNetworks,
} from '@synonymdev/react-native-ldk';
import { backupAccount, getItem, importAccount, setItem } from '../ldk';
import { EAccount } from './types';
import { err, ok, Result } from './result';
import { randomBytes } from 'react-native-randombytes';
import * as bitcoin from 'bitcoinjs-lib';
import { selectedNetwork } from './constants';
import RNFS from 'react-native-fs';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import { ENetworks } from '@synonymdev/react-native-ldk/dist/utils/types';
import networks from '@synonymdev/react-native-ldk/dist/utils/networks';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';
import Clipboard from '@react-native-clipboard/clipboard';
import b4a from 'b4a';
import sodium from 'sodium-native';
import { SlashAuthClient } from '@slashtags/slashauth-client';

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
export const getAddress = async (): Promise<string> => {
	const network = getNetwork(selectedNetwork);

	const { seed: accountSeed } = await getAccount();
	const mnemonic = getMnemonicPhraseFromSeed(accountSeed);
	const mnemonicSeed = await bip39.mnemonicToSeed(mnemonic);
	const root = bip32.fromSeed(mnemonicSeed, network);
	const keyPair = root.derivePath("m/84'/1'/0'/0/0");
	return (
		bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network }).address ??
		''
	);
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

export const simulateStaleRestore = async (
	onUpdate: (string) => void,
): Promise<void> => {
	const channels = await ldk.listChannels();
	if (channels.isErr()) {
		throw channels.error;
	}
	if (channels.value.filter((c) => c.is_usable).length === 0) {
		throw new Error('No usable channels. Open a channel first.');
	}

	onUpdate('Backing up...');
	const backupResponse = await backupAccount();
	if (backupResponse.isErr()) {
		throw backupResponse.error;
	}

	const timeoutSeconds = 30;
	const invoice = await ldk.createPaymentRequest({
		amountSats: 12,
		description: 'crash test',
		expiryDeltaSeconds: timeoutSeconds,
	});
	if (invoice.isErr()) {
		throw invoice.error;
	}

	let paymentClaimed = false;
	let paymentSubscription = ldk.onEvent(
		EEventTypes.channel_manager_payment_claimed,
		() => (paymentClaimed = true),
	);

	Clipboard.setString(invoice.value.to_str);

	//Keep checking if we got the payment
	for (let i = 0; i < timeoutSeconds; i++) {
		onUpdate(
			`Please pay invoice in clipboard to continue (${timeoutSeconds - i})...`,
		);

		if (paymentClaimed) {
			onUpdate('Payment claimed! Testing stale restore...');
			break;
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	paymentSubscription.remove();

	if (!paymentClaimed) {
		throw new Error('No payment claimed. Timeout out.');
	}

	onUpdate('Importing stale backup and force closing all channels...');

	await new Promise((resolve) => setTimeout(resolve, 2500));

	await ldk.stop();
	const forceCloseAllChannels = true; //To test the crash restore set to false
	const importResponse = await importAccount(
		backupResponse.value,
		forceCloseAllChannels,
	);
	if (importResponse.isErr()) {
		throw importResponse.error;
	}

	await new Promise((resolve) => setTimeout(resolve, 2500));
	onUpdate(
		"If this didn't crash and you can see your claimable balance, you're good!",
	);
};

const createKeyPair = (
	seed,
): {
	publicKey: Buffer;
	secretKey: Buffer;
} => {
	const publicKey = b4a.allocUnsafe(sodium.crypto_sign_PUBLICKEYBYTES);
	const secretKey = b4a.allocUnsafe(sodium.crypto_sign_SECRETKEYBYTES);

	console.log(
		'sodium.crypto_sign_seed_keypair',
		sodium.crypto_sign_seed_keypair,
	);

	if (seed) {
		sodium.crypto_sign_seed_keypair(publicKey, secretKey, seed);
	} else {
		sodium.crypto_sign_keypair(publicKey, secretKey);
	}

	return {
		publicKey,
		secretKey,
	};
};

export const getBearerAuthToken = async (): Promise<string> => {
	const DHLEN = sodium.crypto_scalarmult_ed25519_BYTES;
	const PKLEN = sodium.crypto_scalarmult_ed25519_BYTES;
	const SCALARLEN = sodium.crypto_scalarmult_ed25519_BYTES;

	return JSON.stringify({ DHLEN, PKLEN, SCALARLEN });

	const backupServer = 'http://0.0.0.0:3003/v1';
	const seed =
		'000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F'; //TODO get real seed

	const res = await fetch(`${backupServer}/auth`);
	const body = await res.json();
	if (!body.slashauth) {
		console.log(body);
		throw new Error('No slashauth found in response');
	}

	const slashauth = body.slashauth;

	const seedBuffer = Buffer.from(seed, 'hex');
	const keypair = createKeyPair(seedBuffer);

	console.log(`pubkey: ${keypair.publicKey.length}`);
	console.log(`secretKey: ${keypair.secretKey.length}`);

	const client = new SlashAuthClient({ keypair });

	console.log(slashauth);

	try {
		const { status, bearer } = await client.magiclink(slashauth);
	} catch (e) {
		console.log(e);
		return 'shitttt ' + e;
	}

	if (status !== 'ok') {
		throw new Error('slashauth magiclink failed');
	}

	return 'bearer';
};
