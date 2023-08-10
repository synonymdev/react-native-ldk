import { describe, it } from 'mocha';
import BitcoinJsonRpc from 'bitcoin-json-rpc';
import RNFS from 'react-native-fs';
import lm, { ldk } from '@synonymdev/react-native-ldk';

import {
	CL,
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

const bitcoinURL = 'http://polaruser:polarpass@localhost:9091';
const clConfig = {
	host: 'localhost',
	port: 18080,
	macaroon: global.environment.clmacaroon,
};

describe('Clightning', function () {
	this.timeout(5 * 60 * 1000); // 5 minutes
	let waitForElectrum: any;
	const rpc = new BitcoinJsonRpc(bitcoinURL);
	const cl = new CL(clConfig);
	let profile: TestProfile;

	before(async () => {
		let balance = await rpc.getBalance();
		const address = await rpc.getNewAddress();

		while (balance < 10) {
			await rpc.generateToAddress(10, address);
			balance = await rpc.getBalance();
		}

		const { address: lndAddress } = await cl.newAddr();
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
			clightning: clConfig,
		});
		await waitForElectrum({ cl: true });
	});

	after(async () => {
		await ldk.stop();
		cl.destroy();
		waitForElectrum?.close();
	});

	beforeEach(async () => {
		await waitForElectrum({ cl: true });

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
		// - add CL peer
		// - open CL -> LDK channel
		// - make a few payments

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

		const { id: clPubKey } = await cl.getInfo();

		const addPeer = await lm.addPeer({
			pubKey: clPubKey,
			address: '127.0.0.1',
			port: 9736,
			timeout: 5000,
		});
		if (addPeer.isErr()) {
			throw addPeer.error;
		}

		// wait for peer to be connected
		let n = 0;
		while (true) {
			const peers = await cl.listPeers();
			if (peers.some((p) => p.id === nodeId.value)) {
				break;
			}
			await sleep(1000);
			if (n++ === 20) {
				throw new Error('Peer not connected');
			}
		}

		// open a channel
		await cl.openChannel({
			id: nodeId.value,
			satoshis: '100000',
			// private: true,
		});
		await rpc.generateToAddress(10, await rpc.getNewAddress());
		await waitForElectrum({ cl: true });

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

		// CL -> LDK, 0 sats
		const inv1 = await lm.createAndStorePaymentRequest({
			amountSats: 0,
			description: 'trololo',
			expiryDeltaSeconds: 60,
		});
		if (inv1.isErr()) {
			throw inv1.error;
		}
		await cl.pay({
			invoice: inv1.value.to_str,
			amount: 10000 * 1000, // milli-sats
		});

		// CL -> LDK, 1000 sats
		const inv2 = await lm.createAndStorePaymentRequest({
			amountSats: 1000,
			description: 'ololo',
			expiryDeltaSeconds: 60,
		});
		if (inv2.isErr()) {
			throw inv2.error;
		}
		await cl.pay({ invoice: inv2.value.to_str });

		// LDK -> CL, 0 sats
		const { bolt11: invoice3 } = await cl.genInvoice({
			amount: 0,
			label: 'payment3' + new Date(),
			description: 'payment3',
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

		// LDK -> CL, 444 sats
		const { bolt11: invoice4 } = await cl.genInvoice({
			amount: 444000, // milisats
			label: 'payment4' + new Date(),
			description: 'payment4',
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
	});
});
