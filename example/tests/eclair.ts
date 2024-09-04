import lm, { ENetworks, ldk } from '@synonymdev/react-native-ldk';
import BitcoinJsonRpc from 'bitcoin-json-rpc';
import { describe, it } from 'mocha';
import RNFS from 'react-native-fs';

import {
	Eclair,
	TestProfile,
	backupServerDetails,
	initWaitForElectrumToSync,
	skipRemoteBackups,
	sleep,
	wipeLdkStorage,
} from './utils';

const bitcoinURL = 'http://polaruser:polarpass@localhost:9091';
const eclairConfig = {
	host: 'localhost',
	port: 28081,
	password: 'eclairpw',
};

describe('Eclair', function () {
	this.retries(3);
	this.timeout(5 * 60 * 1000); // 5 minutes
	let waitForElectrum: any;
	const rpc = new BitcoinJsonRpc(bitcoinURL);
	const ec = new Eclair(eclairConfig);
	let profile: TestProfile;

	before(async () => {
		let balance = await rpc.getBalance();
		const address = await rpc.getNewAddress();

		while (balance < 10) {
			await rpc.generateToAddress(10, address);
			balance = await rpc.getBalance();
		}

		const ecAddress = await ec.getnewaddress();
		await rpc.sendToAddress(ecAddress, '1');
		await rpc.generateToAddress(6, await rpc.getNewAddress());

		const storageRes = await lm.setBaseStoragePath(
			`${RNFS.DocumentDirectoryPath}/ldk/`,
		);
		if (storageRes.isErr()) {
			throw storageRes.error;
		}

		waitForElectrum = await initWaitForElectrumToSync({
			electrum: { port: 60001, host: 'localhost' },
			bitcoin: bitcoinURL,
			eclair: eclairConfig,
		});
		await waitForElectrum({ ec: true });
	});

	after(async () => {
		await ldk.stop();
		ec.destroy();
		waitForElectrum?.close();
	});

	beforeEach(async () => {
		await waitForElectrum({ ec: true });

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
		// - add Eclair peer
		// - open Eclair -> LDK channel
		// - make a few payments

		await ldk.stop();

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

		const { nodeId: ecPubKey } = await ec.getInfo();
		const addPeer = await lm.addPeer({
			pubKey: ecPubKey,
			address: '127.0.0.1',
			port: 9737,
			timeout: 5000,
		});
		if (addPeer.isErr()) {
			throw addPeer.error;
		}

		// wait for peer to be connected
		let n = 0;
		while (true) {
			const peers = await ec.peers();
			if (peers.some((p) => p.nodeId === nodeId.value)) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('Peer not connected');
			}
		}

		// open a channel
		const open = await ec.open({
			nodeId: nodeId.value,
			fundingSatoshis: 10000000,
			fundingFeeBudgetSatoshis: 2000,
			fundingFeerateSatByte: 1,
			announceChannel: false,
			// channelType: 'anchor_outputs_zero_fee_htlc_tx',
		});

		if (open.includes('error')) {
			throw open;
		}

		await rpc.generateToAddress(10, await rpc.getNewAddress());
		await waitForElectrum({ ec: true });

		let syncLdk = await lm.syncLdk();
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

		// Eclair -> LDK, 0 sats
		const inv1 = await lm.createAndStorePaymentRequest({
			amountSats: 0,
			description: 'trololo',
			expiryDeltaSeconds: 60,
		});
		if (inv1.isErr()) {
			throw inv1.error;
		}
		await ec.pay({
			invoice: inv1.value.to_str,
			amountMsat: 10000 * 1000, // milli-sats
		});

		// Eclair -> LDK, 1000 sats
		const inv2 = await lm.createAndStorePaymentRequest({
			amountSats: 1000,
			description: 'ololo',
			expiryDeltaSeconds: 60,
		});
		if (inv2.isErr()) {
			throw inv2.error;
		}
		await ec.pay({ invoice: inv2.value.to_str });

		// FIXME LDK -> ECLAIR doesn't work

		// LDK -> Eclair, 0 sats
		// const { serialized: invoice3 } = await ec.createinvoice({
		// 	// amount: 0,
		// 	// label: 'payment3' + new Date(),
		// 	description: 'payment3',
		// });
		// const pay3 = await lm.payWithTimeout({
		// 	paymentRequest: invoice3,
		// 	amountSats: 100,
		// 	timeout: 10000,
		// });
		// if (pay3.isErr()) {
		// 	throw pay3.error;
		// }

		// // LDK -> Eclair, 444 sats
		// const { serialized: invoice4 } = await ec.createinvoice({
		// 	amountMsat: 444000, // milisats
		// 	// label: 'payment4' + new Date(),
		// 	description: 'payment4',
		// });
		// const decoded2 = await ldk.decode({ paymentRequest: invoice4 });
		// if (decoded2.isErr()) {
		// 	throw decoded2.error;
		// }
		// const pay4 = await lm.payWithTimeout({
		// 	paymentRequest: invoice4,
		// 	timeout: 10000,
		// });
		// if (pay4.isErr()) {
		// 	throw pay4.error;
		// }
	});
});
