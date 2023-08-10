import { expect } from 'chai';
import { describe, it } from 'mocha';
import BitcoinJsonRpc from 'bitcoin-json-rpc';
import RNFS from 'react-native-fs';
import lm, { ldk } from '@synonymdev/react-native-ldk';

import {
	LND,
	TestProfile,
	initWaitForElectrumToSync,
	sleep,
	wipeLdkStorage,
} from './utils';

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

		// const electrumResponse = await connectToElectrum({});
		// if (electrumResponse.isErr()) {
		// 	throw electrumResponse.error;
		// }
		// const account = await getAccount();

		profile = new TestProfile({
			// name: account.name,
			// seed: account.seed,
			headerCallback: async (): Promise<void> => {
				const syncRes = await lm.syncLdk();
				if (syncRes.isErr()) {
					console.info('SYNC ERROR', syncRes.error);
					throw syncRes.error;
				}
			},
		});
		await profile.init();
	});

	afterEach(async function () {
		await profile?.cleanup();
		if (this.currentTest?.state === 'failed') {
			return;
		}
		await wipeLdkStorage();
	});

	it('can exchange payments', async function () {
		// Test plan:
		// - start LDK
		// - add LND peer
		// - open LND -> LDK channel
		// - make a few payments
		// - backup and restore LDK
		// - check if channel is still open

		// const account = await getAccount();

		await ldk.stop();
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
			local_funding_amount: '100000',
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
				throw new Error('Channel not active');
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
		await lnd.sendPaymentSync({
			payment_request: inv1.value.to_str,
			amt: 10000,
		});

		// LND -> LDK, 1000 sats
		const inv2 = await lm.createAndStorePaymentRequest({
			amountSats: 1000,
			description: 'ololo',
			expiryDeltaSeconds: 60,
		});
		if (inv2.isErr()) {
			throw inv2.error;
		}
		await lnd.sendPaymentSync({ payment_request: inv2.value.to_str });

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

		// backup LDK
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
				throw new Error('Channel not active');
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

	it('can recover stale backup', async function () {
		// Test plan:
		// - open LND -> LDK channel
		// - make a few payments
		// - backup
		// - make more payments
		// - try to restore stale backup

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
				throw new Error('Channel not active');
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
		await lnd.sendPaymentSync({
			payment_request: inv1.value.to_str,
		});

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
			await lnd.sendPaymentSync({
				payment_request: inv.value.to_str,
			});
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
				throw new Error('Channel not active');
			}
		}

		// TODO: search for refunding transaction
	});
});
