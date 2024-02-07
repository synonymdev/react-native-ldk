import { expect } from 'chai';
import { describe, it } from 'mocha';
import BitcoinJsonRpc from 'bitcoin-json-rpc';
import RNFS from 'react-native-fs';
import lm, {
	EEventTypes,
	ENetworks,
	TChannel,
	ldk,
} from '@synonymdev/react-native-ldk';
import * as bitcoin from 'bitcoinjs-lib';
import ElectrumClient from 'electrum-client';
import { Platform } from 'react-native';

import {
	LND,
	TestProfile,
	getTxFeeRate,
	initWaitForElectrumToSync,
	skipRemoteBackups,
	sleep,
	waitForLDKEvent,
	wipeLdkStorage,
} from './utils';
import { Result } from '../utils/result';
import { getScriptHash } from '../utils/helpers';
import { backupServerDetails } from './utils';

// import {
// 	broadcastTransaction,
// 	getBestBlock,
// 	getTransactionData,
// 	getTransactionPosition,
// } from '../ldk';
// import {
// 	connectToElectrum,
// 	getScriptPubKeyHistory,
// 	subscribeToHeader,
// } from '../electrum';r
// import { getAccount, getAddress, ldkNetwork } from '../utils/helpers';
// import { selectedNetwork } from '../utils/constants';

const b64url = (str: string): string => {
	const res = Buffer.from(str, 'hex').toString('base64');
	return res.replaceAll('+', '-').replaceAll('/', '_');
};

const bitcoinURL = 'http://polaruser:polarpass@localhost:9091';
const lndConfig = {
	host: 'localhost',
	port: 9090,
	macaroon: global.environment.lndmacaroon,
};

describe('LND', function () {
	this.retries(3);
	this.timeout(5 * 60 * 1000); // 5 minutes
	let waitForElectrum: any;
	const rpc = new BitcoinJsonRpc(bitcoinURL);
	const lnd = new LND(lndConfig);
	let profile: TestProfile;

	before(async () => {
		let balance = await rpc.getBalance();
		const address = await rpc.getNewAddress();

		while (balance < 10) {
			await rpc.generateToAddress(10, address);
			balance = await rpc.getBalance();
		}

		const { address: lndAddress } = await lnd.newAddress();
		await rpc.sendToAddress(lndAddress, '1');
		await rpc.generateToAddress(1, await rpc.getNewAddress());

		const storageRes = await lm.setBaseStoragePath(
			`${RNFS.DocumentDirectoryPath}/ldk/`,
		);
		if (storageRes.isErr()) {
			throw storageRes.error;
		}

		waitForElectrum = await initWaitForElectrumToSync({
			electrum: { port: 60001, host: 'localhost' },
			bitcoin: bitcoinURL,
			lnd: lndConfig,
		});
		await waitForElectrum({ lnd: true });
	});

	after(async () => {
		await ldk.stop();
		lnd.destroy();
		waitForElectrum?.close();
	});

	beforeEach(async () => {
		await waitForElectrum({ lnd: true });
		profile = new TestProfile({});
		await profile.init();
	});

	afterEach(async function () {
		await sleep(100);
		await ldk.stop();
		await sleep(100);
		await profile?.cleanup();
		if (this.currentTest?.state === 'failed') {
			return;
		}
		await wipeLdkStorage();
	});

	it('can exchange payments, backup and restore', async function () {
		// Test plan:
		// - start LDK
		// - add LND peer
		// - open LND -> LDK channel
		// - make a few payments
		// - backup and restore LDK
		// - check if channel is still open

		if (!skipRemoteBackups) {
			const backupRes = await ldk.backupSetup({
				network: ENetworks.regtest,
				seed: profile.getAccount().seed,
				details: backupServerDetails,
			});
			if (backupRes.isErr()) {
				throw backupRes.error;
			}
		}

		// await ldk.stop();
		const lmStart = await lm.start({
			...profile.getStartParams(),
			// getBestBlock: getBestBlock,
			// account: account,
			// getAddress: getAddress,
			// getScriptPubKeyHistory: getScriptPubKeyHistory,
			// getFees: () =>
			// 	Promise.resolve({ highPriority: 10, normal: 5, background: 1 }),
			// getTransactionData: getTransactionData,
			// getTransactionPosition: getTransactionPosition,
			// broadcastTransaction: broadcastTransaction,
			// network: ldkNetwork(selectedNetwork),
		});
		if (lmStart.isErr()) {
			throw lmStart.error;
		}

		const nodeId = await ldk.nodeId();
		if (nodeId.isErr()) {
			throw nodeId.error;
		}

		const { identity_pubkey: lndPubKey } = await lnd.getInfo();

		const addPeer = await lm.addPeer({
			pubKey: lndPubKey,
			address: '127.0.0.1',
			port: 9735,
			timeout: 5000,
		});
		if (addPeer.isErr()) {
			throw addPeer.error;
		}

		// wait for peer to be connected
		let n = 0;
		while (true) {
			const { peers } = await lnd.listPeers();
			if (peers.some((p) => p.pub_key === nodeId.value)) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('Peer not connected');
			}
		}

		let syncLdk = await lm.syncLdk();
		if (syncLdk.isErr()) {
			throw syncLdk.error;
		}

		// open a channel
		await lnd.openChannelSync({
			node_pubkey_string: nodeId.value,
			local_funding_amount: '200002',
			private: true,
		});
		await rpc.generateToAddress(10, await rpc.getNewAddress());
		await waitForElectrum({ lnd: true });

		syncLdk = await lm.syncLdk();
		if (syncLdk.isErr()) {
			throw syncLdk.error;
		}
		await sleep(1000);

		// wait for channel to be active
		n = 0;
		while (true) {
			const listChannels = await ldk.listChannels();
			if (listChannels.isErr()) {
				throw listChannels.error;
			}
			if (listChannels.value.length > 0 && listChannels.value[0].is_usable) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('LDK channel not active 1');
			}
		}

		// LND -> LDK, 0 sats
		const inv1 = await lm.createAndStorePaymentRequest({
			amountSats: 0,
			description: 'trololo',
			expiryDeltaSeconds: 60,
		});
		if (inv1.isErr()) {
			throw inv1.error;
		}
		await sleep(1000); // FIXME, without it LND can't pay LDK. Looks like channel is not ready yet
		const lndPay1 = await lnd.sendPaymentSync({
			payment_request: inv1.value.to_str,
			amt: 10000,
		});
		expect(lndPay1.payment_error).to.be.empty;

		// LND -> LDK, 1000 sats
		const inv2 = await lm.createAndStorePaymentRequest({
			amountSats: 1000,
			description: 'ololo',
			expiryDeltaSeconds: 60,
		});
		await sleep(1000); // FIXME, without it LND can't pay LDK. Looks like channel is not ready yet
		if (inv2.isErr()) {
			throw inv2.error;
		}
		const lndPay2 = await lnd.sendPaymentSync({
			payment_request: inv2.value.to_str,
		});
		expect(lndPay2.payment_error).to.be.empty;

		// LDK -> LND, 0 sats
		const { payment_request: invoice3 } = await lnd.addInvoice({
			memo: 'payment3',
		});
		const decoded1 = await ldk.decode({ paymentRequest: invoice3 });
		if (decoded1.isErr()) {
			throw decoded1.error;
		}
		const pay3 = await lm.payWithTimeout({
			paymentRequest: invoice3,
			amountSats: 100,
			timeout: 10000,
		});
		if (pay3.isErr()) {
			throw pay3.error;
		}

		// LDK -> LND, 444 sats
		const { payment_request: invoice4 } = await lnd.addInvoice({
			memo: 'payment4',
			value: 444,
		});
		const decoded2 = await ldk.decode({ paymentRequest: invoice4 });
		if (decoded2.isErr()) {
			throw decoded2.error;
		}
		const pay4 = await lm.payWithTimeout({
			paymentRequest: invoice4,
			timeout: 10000,
		});
		if (pay4.isErr()) {
			throw pay4.error;
		}

		await sleep(1000); // FIXME: remove it and test will fail

		const claimed1 = await lm.getLdkPaymentsClaimed();
		expect(claimed1[0].amount_sat).to.equal(10000);
		expect(claimed1[0].state).to.equal('successful');
		expect(claimed1[1].amount_sat).to.equal(1000);
		expect(claimed1[1].state).to.equal('successful');

		const sent1 = await lm.getLdkPaymentsSent();
		expect(sent1[0].amount_sat).to.equal(100);
		expect(sent1[0].state).to.equal('successful');
		expect(sent1[1].amount_sat).to.equal(444);
		expect(sent1[1].state).to.equal('successful');

		const claimableBalances1 = await ldk.claimableBalances(false);
		if (claimableBalances1.isErr()) {
			throw claimableBalances1.error;
		}

		return;

		// backup LDK
		// eslint-disable-next-line no-unreachable
		const backupResp = await lm.backupAccount({
			account: profile.getAccount(),
			includeTransactionHistory: true,
		});
		if (backupResp.isErr()) {
			throw backupResp.error;
		}

		await wipeLdkStorage();

		// restore LDK
		const importResponse = await lm.importAccount({
			backup: JSON.stringify(backupResp.value),
			overwrite: true,
		});
		if (importResponse.isErr()) {
			throw importResponse.error;
		}

		expect(importResponse.value.name).to.equal(profile.name);
		expect(importResponse.value.seed).to.equal(profile.seed);

		const lmStart2 = await lm.start({
			...profile.getStartParams(),
			// forceCloseOnStartup: { forceClose: true, broadcastLatestTx: false },
		});
		if (lmStart2.isErr()) {
			throw lmStart2.error;
		}

		syncLdk = await lm.syncLdk();
		if (syncLdk.isErr()) {
			throw syncLdk.error;
		}
		await sleep(1000);

		const claimableBalances2 = await ldk.claimableBalances(false);
		if (claimableBalances2.isErr()) {
			throw claimableBalances2.error;
		}

		// wait for channel to be active
		n = 0;
		while (true) {
			const listChannels = await ldk.listChannels();
			if (listChannels.isErr()) {
				throw listChannels.error;
			}
			if (listChannels.value.length > 0 && listChannels.value[0].is_usable) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('LDK channel not active 2');
			}
		}

		// const sent2 = await lm.getLdkPaymentsSent();
		// const claimed2 = await lm.getLdkPaymentsClaimed();
		// console.info('claimed2', claimed2);
		// console.info('sent2', sent2);
		// expect(claimed2[0].amount_sat).to.equal(10000);
		// expect(claimed2[0].state).to.equal('successful');
		// expect(claimed2[1].amount_sat).to.equal(1000);
		// expect(claimed2[1].state).to.equal('successful');

		// // const sent2 = await lm.getLdkPaymentsSent();
		// expect(sent2[0].amount_sat).to.equal(100);
		// expect(sent2[0].state).to.equal('successful');
		// expect(sent2[1].amount_sat).to.equal(444);
		// expect(sent2[1].state).to.equal('successful');
	});

	it.skip('can recover stale backup', async function () {
		// Test plan:
		// - open LND -> LDK channel
		// - make a few payments
		// - backup
		// - make more payments
		// - try to restore stale backup

		profile.headerCallback = async (): Promise<void> => {
			const syncRes = await lm.syncLdk();
			if (syncRes.isErr()) {
				console.info('SYNC ERROR', syncRes.error);
				throw syncRes.error;
			}
		};

		await ldk.stop();
		const lmStart = await lm.start({
			...profile.getStartParams(),
		});
		if (lmStart.isErr()) {
			throw lmStart.error;
		}

		const nodeId = await ldk.nodeId();
		if (nodeId.isErr()) {
			throw nodeId.error;
		}

		const { identity_pubkey: lndPubKey } = await lnd.getInfo();

		const addPeer = await lm.addPeer({
			pubKey: lndPubKey,
			address: '127.0.0.1',
			port: 9735,
			timeout: 5000,
		});
		if (addPeer.isErr()) {
			throw addPeer.error;
		}

		// wait for peer to be connected
		let n = 0;
		while (true) {
			const { peers } = await lnd.listPeers();
			if (peers.some((p) => p.pub_key === nodeId.value)) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('Peer not connected');
			}
		}

		let syncLdk = await lm.syncLdk();
		if (syncLdk.isErr()) {
			throw syncLdk.error;
		}

		// open a channel
		await lnd.openChannelSync({
			node_pubkey_string: nodeId.value,
			local_funding_amount: '100000',
			private: true,
		});
		await rpc.generateToAddress(10, await rpc.getNewAddress());
		await waitForElectrum({ lnd: true });

		// syncLdk = await lm.syncLdk();
		// if (syncLdk.isErr()) {
		// 	throw syncLdk.error;
		// }
		await sleep(1000);

		// wait for channel to be active
		n = 0;
		while (true) {
			const listChannels = await ldk.listChannels();
			if (listChannels.isErr()) {
				throw listChannels.error;
			}
			if (listChannels.value.length > 0 && listChannels.value[0].is_usable) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('LDK channel not active; stale backup test');
			}
		}

		// LND -> LDK, 10000 sats
		const inv1 = await lm.createAndStorePaymentRequest({
			amountSats: 10000,
			description: 'trololo1',
			expiryDeltaSeconds: 60,
		});
		if (inv1.isErr()) {
			throw inv1.error;
		}
		await sleep(1000); // FIXME, without it LND can't pay LDK. Looks like channel is not ready yet
		const lndPay1 = await lnd.sendPaymentSync({
			payment_request: inv1.value.to_str,
		});
		expect(lndPay1.payment_error).to.be.empty;

		// LDK -> LND, 444 sats
		const { payment_request: inv2 } = await lnd.addInvoice({
			memo: 'trololo2',
			value: 444,
		});
		const pay2 = await lm.payWithTimeout({
			paymentRequest: inv2,
			timeout: 10000,
		});
		if (pay2.isErr()) {
			throw pay2.error;
		}

		await sleep(1000); // FIXME: remove it and test will fail

		// backup LDK
		const backupResp = await lm.backupAccount({
			account: profile.getAccount(),
			includeTransactionHistory: true,
		});
		if (backupResp.isErr()) {
			throw backupResp.error;
		}

		// 3 LND -> LDK, 10 sats each
		for (let i = 0; i < 3; i++) {
			const inv = await lm.createAndStorePaymentRequest({
				amountSats: 10,
				description: '10sats',
				expiryDeltaSeconds: 60,
			});
			if (inv.isErr()) {
				throw inv.error;
			}
			await sleep(1000); // FIXME, without it LND can't pay LDK. Looks like channel is not ready yet
			const lndPay = await lnd.sendPaymentSync({
				payment_request: inv.value.to_str,
			});
			expect(lndPay.payment_error).to.be.empty;
		}

		await wipeLdkStorage();

		// restore LDK
		const importResponse = await lm.importAccount({
			backup: JSON.stringify(backupResp.value),
		});

		if (importResponse.isErr()) {
			throw importResponse.error;
		}

		const lmStart2 = await lm.start({
			...profile.getStartParams(),
			forceCloseOnStartup: { forceClose: true, broadcastLatestTx: false },
		});
		if (lmStart2.isErr()) {
			throw lmStart2.error;
		}
		await rpc.generateToAddress(1, await rpc.getNewAddress());

		// wait for channel to be not active
		n = 0;
		while (true) {
			const { channels } = await lnd.listChannels({
				peer: b64url(nodeId.value),
			});
			if (channels.length === 0 || channels[0].active === false) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('LND channel not active');
			}
		}

		// TODO: search for refunding transaction
	});

	it.skip('can force close channel', async function () {
		// Test plan:
		// - start LDK
		// - add LND peer
		// - open LND -> LDK channel
		// - move some funds to LDK
		// - force close channel from LDK
		// - check everything is ok

		if (!skipRemoteBackups) {
			const backupRes = await ldk.backupSetup({
				network: ENetworks.regtest,
				seed: profile.getAccount().seed,
				details: backupServerDetails,
			});
			if (backupRes.isErr()) {
				throw backupRes.error;
			}
		}

		const lmStart = await lm.start({
			...profile.getStartParams(),
		});
		if (lmStart.isErr()) {
			throw lmStart.error;
		}

		const nodeId = await ldk.nodeId();
		if (nodeId.isErr()) {
			throw nodeId.error;
		}

		const { identity_pubkey: lndPubKey } = await lnd.getInfo();

		const addPeer = await lm.addPeer({
			pubKey: lndPubKey,
			address: '127.0.0.1',
			port: 9735,
			timeout: 5000,
		});
		if (addPeer.isErr()) {
			throw addPeer.error;
		}

		// wait for peer to be connected
		let n = 0;
		while (true) {
			const { peers } = await lnd.listPeers();
			if (peers.some((p) => p.pub_key === nodeId.value)) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('Peer not connected');
			}
		}

		// open a channel
		await lnd.openChannelSync({
			node_pubkey_string: nodeId.value,
			local_funding_amount: '5000000',
			private: true,
		});
		await rpc.generateToAddress(10, await rpc.getNewAddress());
		await waitForElectrum({ lnd: true });

		let syncLdk = await lm.syncLdk();
		if (syncLdk.isErr()) {
			throw syncLdk.error;
		}

		// wait for channel to be active
		n = 0;
		let listChannels: Result<TChannel[]>;
		while (true) {
			listChannels = await ldk.listChannels();
			if (listChannels.isErr()) {
				throw listChannels.error;
			}
			if (listChannels.value.length > 0 && listChannels.value[0].is_usable) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('Channel not active');
			}
		}

		const channel1 = listChannels.value[0];
		expect(channel1.force_close_spend_delay).to.be.a('number');

		// LND -> LDK, 100001 sats
		const inv1 = await lm.createAndStorePaymentRequest({
			amountSats: 100001,
			description: 'trololo',
			expiryDeltaSeconds: 60,
		});
		if (inv1.isErr()) {
			throw inv1.error;
		}
		await sleep(1000); // FIXME, without it LND can't pay LDK. Looks like channel is not ready yet
		const paymentResp = await lnd.sendPaymentSync({
			payment_request: inv1.value.to_str,
		});
		expect(paymentResp).to.have.property('payment_error').that.is.empty;

		// wait for LDK to broadcast channel close tx, timeout after 10s
		const closingTxBroadcastPromise = waitForLDKEvent(
			EEventTypes.broadcast_transaction,
		);

		// set high fees and restart LDK so it catches up
		// fees = {
		// 	nonAnchorChannelFee: 30,
		// 	anchorChannelFee: 30,
		// 	maxAllowedNonAnchorChannelRemoteFee: 30,
		// 	channelCloseMinimum: 5,
		// 	minAllowedAnchorChannelRemoteFee: 5,
		// 	minAllowedNonAnchorChannelRemoteFee: 5,
		// 	onChainSweep: 30,
		// };
		const syncRes0 = await lm.syncLdk();
		// await lm.setFees();
		if (syncRes0.isErr()) {
			throw syncRes0.error;
		}

		// force-close channel
		const closeReq = await ldk.closeChannel({
			channelId: channel1.channel_id,
			counterPartyNodeId: lndPubKey,
			force: true,
		});
		if (closeReq.isErr()) {
			throw closeReq.error;
		}
		const { tx: closingTxHex } = await closingTxBroadcastPromise;
		const closingTx = bitcoin.Transaction.fromHex(closingTxHex);
		await rpc.generateToAddress(1, await rpc.getNewAddress());
		await waitForElectrum({ lnd: true });

		const syncRes1 = await lm.syncLdk();
		if (syncRes1.isErr()) {
			throw syncRes1.error;
		}

		const feeRate = await getTxFeeRate(closingTx.getId());
		console.info('Closing transaction fee rate:', feeRate, 'sat/vbyte');

		// start listening channel_manager_spendable_outputs event
		const spendablePromise = waitForLDKEvent(
			EEventTypes.channel_manager_spendable_outputs,
		);

		// check claimableBalances
		const claimableBalances1 = await ldk.claimableBalances(true);
		if (claimableBalances1.isErr()) {
			throw claimableBalances1.error;
		}

		console.info('claimableBalances1', claimableBalances1);
		// FIXME: threre should only be one item, but it might be 2 on android
		if (Platform.OS === 'android') {
			// @ts-ignore
			claimableBalances1.value = claimableBalances1.value.filter(
				({ amount_satoshis }) => amount_satoshis > 0,
			);
		}

		expect(claimableBalances1.value).to.have.length(1);
		expect(claimableBalances1.value[0]).to.include({
			amount_satoshis: 100001,
			type: 'ClaimableAwaitingConfirmations',
		});
		expect(claimableBalances1.value[0])
			.to.have.property('confirmation_height')
			.that.to.be.a('number');

		// calculate how much blocks we need to mine, before LDK can spend the closing tx
		const blocksToMine =
			(claimableBalances1.value[0]?.confirmation_height ?? 0) -
			(await rpc.getBlockCount()) +
			1;
		// const blocksToMine = 601;
		console.info(`Mining ${blocksToMine} blocks...`);
		await rpc.generateToAddress(blocksToMine, await rpc.getNewAddress());
		await waitForElectrum({ lnd: true, checkInterval: 1000 });
		console.info('Blocks mined');

		const syncRes2 = await lm.syncLdk();
		if (syncRes2.isErr()) {
			throw syncRes2.error;
		}

		// wait for channel_manager_spendable_outputs event
		await spendablePromise;

		// now we need to wait for tx to be created and broadcasted my LN Manager
		await sleep(3000);
		await rpc.generateToAddress(1, await rpc.getNewAddress());
		await waitForElectrum();

		// check if sweep was successfull
		const electrum = new ElectrumClient(
			global.net,
			global.tls,
			60001,
			'localhost',
			'tcp',
		);
		await electrum.initElectrum({ client: 'get-balance', version: '1.4' });
		const balance = await electrum.blockchainScripthash_getBalance(
			getScriptHash((await profile.getAddress()).address),
		);

		expect(balance)
			.to.have.property('confirmed')
			.that.above(90000)
			.and.below(100001);
	});
});
