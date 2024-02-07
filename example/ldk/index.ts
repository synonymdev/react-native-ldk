import AsyncStorage from '@react-native-async-storage/async-storage';
import * as electrum from 'rn-electrum-client/helpers';
import { err, ok, Result } from '../utils/result';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';
import {
	getBlockHeader,
	getBlockHex,
	getScriptPubKeyHistory,
} from '../electrum';
import lm, {
	DefaultTransactionDataShape,
	defaultUserConfig,
	THeader,
	TTransactionData,
	TTransactionPosition,
} from '@synonymdev/react-native-ldk';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';
import {
	backupServerDetails,
	peers,
	selectedNetwork,
} from '../utils/constants';
import {
	getAccount,
	getAddress,
	getNetwork,
	ldkNetwork,
} from '../utils/helpers';
import * as bitcoin from 'bitcoinjs-lib';

/**
 * Retrieves data from local storage.
 * @param {string} key
 * @returns {Promise<string>}
 */
export const getItem = async (key: string = ''): Promise<any> => {
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
	const syncResponse = await lm.syncLdk();
	return syncResponse;
};

/**
 * Used to spin-up LDK services.
 * In order, this method:
 * 1. Retrieves and sets the seed from storage.
 * 2. Starts ldk with the necessary params.
 * 3. Adds/Connects saved peers from storage. (Note: Not needed as LDK handles this automatically once a peer has been added successfully. Only used to make example app easier to test.)
 * 4. Syncs LDK.
 */
export const setupLdk = async (
	forceCloseAllChannels = false,
): Promise<Result<string>> => {
	try {
		await ldk.stop();
		const account = await getAccount();
		const storageRes = await lm.setBaseStoragePath(
			`${RNFS.DocumentDirectoryPath}/ldk/`,
		);
		if (storageRes.isErr()) {
			return err(storageRes.error);
		}

		if (backupServerDetails) {
			const res = await ldk.backupSetup({
				network: ldkNetwork(selectedNetwork),
				seed: account.seed,
				details: backupServerDetails,
			});
			if (res.isErr()) {
				return err(res.error);
			}
		}

		const lmStart = await lm.start({
			getBestBlock,
			account,
			getAddress,
			getScriptPubKeyHistory,
			getFees: () =>
				Promise.resolve({
					anchorChannelFee: 10,
					nonAnchorChannelFee: 10,
					channelCloseMinimum: 10,
					minAllowedAnchorChannelRemoteFee: 10,
					maxAllowedNonAnchorChannelRemoteFee: 10,
					onChainSweep: 10,
					minAllowedNonAnchorChannelRemoteFee: 10,
				}),
			getTransactionData,
			getTransactionPosition,
			broadcastTransaction,
			network: ldkNetwork(selectedNetwork),
			forceCloseOnStartup: forceCloseAllChannels
				? { forceClose: true, broadcastLatestTx: false }
				: undefined,
			userConfig: {
				...defaultUserConfig,
				channel_handshake_config: {
					...defaultUserConfig.channel_handshake_config,
					negotiate_anchors_zero_fee_htlc_tx: true,
				},
				manually_accept_inbound_channels: true,
			},
			trustedZeroConfPeers: [peers.lnd.pubKey],
			skipRemoteBackups: !backupServerDetails,
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

		const syncRes = await lm.syncLdk();
		if (syncRes.isErr()) {
			return err(syncRes.error.message);
		}

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
): Promise<TTransactionData | undefined> => {
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

	if (
		//TODO: Update types for electrum response.
		// @ts-ignore
		response?.error &&
		//TODO: Update types for electrum response.
		// @ts-ignore
		response?.error?.message &&
		/No such mempool or blockchain transaction|Invalid tx hash/.test(
			//TODO: Update types for electrum response.
			// @ts-ignore
			response?.error?.message,
		)
	) {
		//Transaction may have been removed/bumped from the mempool or potentially reorg'd out.
		return undefined;
	}

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
}: {
	tx_hash: string;
	height: number;
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
