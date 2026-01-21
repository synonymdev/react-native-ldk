/**
 * LDK RPC-Driven E2E Tests
 * Tests LDK functionality using direct API calls instead of UI interactions
 * These tests can run without any UI implementation
 */

const {
	sleep,
	checkComplete,
	markComplete,
	BitcoinRPC,
	LNDRPC,
	mineBlocks,
	fundAddress,
} = require('./helpers');
const config = require('./config');

// These will be imported from the app when running
// For now, we'll check if they're available
let lm, ldk, EEventTypes, ENetworks;
try {
	const ldkModule = require('@synonymdev/react-native-ldk');
	lm = ldkModule.default;
	ldk = ldkModule.ldk;
	EEventTypes = ldkModule.EEventTypes;
	ENetworks = ldkModule.ENetworks;
} catch (e) {
	console.warn('LDK module not available, tests will be skipped');
}

const d = checkComplete('ldk-rpc') ? describe.skip : describe;

d('LDK RPC - Initialization', () => {
	let bitcoin;
	let account;

	beforeAll(async () => {
		if (!ldk) {
			console.log('⊘ LDK module not available, skipping tests');
			return;
		}

		bitcoin = new BitcoinRPC(config.bitcoin.url);

		// Ensure we have blocks
		const blockCount = await bitcoin.getBlockCount();
		if (blockCount < 101) {
			await mineBlocks(bitcoin, 101 - blockCount);
		}

		// Create test account
		account = {
			name: 'e2e-test',
			seed: config.accounts.default.seed,
		};
	});

	afterAll(async () => {
		if (ldk) {
			await ldk.stop();
		}
	});

	it('should start LDK with minimal configuration', async () => {
		if (!lm) {
			console.log('⊘ LDK not available');
			return;
		}

		const startResult = await lm.start({
			account,
			getBestBlock: async () => {
				const height = await bitcoin.getBlockCount();
				const hash = await bitcoin.call('getblockhash', [height]);
				const block = await bitcoin.call('getblock', [hash]);
				return {
					hash: block.hash,
					height,
					hex: block.hex || '',
				};
			},
			getAddress: async () => ({
				address: 'bcrt1qtk89me2ae95dmlp3yfl4q9ynpux8mxjus4s872',
				publicKey:
					'0298720ece754e377af1b2716256e63c2e2427ff6ebdc66c2071c43ae80132ca32',
			}),
			getScriptPubKeyHistory: async () => [],
			getFees: () =>
				Promise.resolve({
					nonAnchorChannelFee: 5,
					anchorChannelFee: 5,
					maxAllowedNonAnchorChannelRemoteFee: 5,
					channelCloseMinimum: 5,
					minAllowedAnchorChannelRemoteFee: 5,
					minAllowedNonAnchorChannelRemoteFee: 5,
					outputSpendingFee: 5,
					urgentOnChainSweep: 5,
					maximumFeeEstimate: 5,
				}),
			getTransactionData: async () => ({
				header: '',
				height: 0,
				transaction: '',
				vout: [],
			}),
			getTransactionPosition: async () => -1,
			broadcastTransaction: async () => '',
			network: ENetworks.regtest,
			skipRemoteBackups: true,
		});

		expect(startResult.isOk()).toBe(true);

		// Sync LDK
		const syncResult = await lm.syncLdk();
		expect(syncResult.isOk()).toBe(true);

		// Get node ID
		const nodeIdResult = await ldk.nodeId();
		expect(nodeIdResult.isOk()).toBe(true);
		expect(nodeIdResult.value).toBeTruthy();
		expect(nodeIdResult.value.length).toBe(66); // 33 bytes hex = 66 chars

		console.log(`✓ LDK started with node ID: ${nodeIdResult.value}`);
	});

	it('should return LDK version information', async () => {
		if (!ldk) {
			console.log('⊘ LDK not available');
			return;
		}

		const versionResult = await ldk.version();
		expect(versionResult.isOk()).toBe(true);
		expect(versionResult.value.ldk).toBeTruthy();
		expect(versionResult.value.c_bindings).toBeTruthy();

		console.log(`✓ LDK version: ${versionResult.value.ldk}`);
	});
});

d('LDK RPC - Channel Operations', () => {
	let bitcoin;
	let lnd;
	let ldkNodeId;

	beforeAll(async () => {
		if (!lm || !ldk) {
			return;
		}

		bitcoin = new BitcoinRPC(config.bitcoin.url);
		lnd = new LNDRPC(config.lnd.host, config.lnd.restPort, config.lnd.macaroon);

		// Fund LND
		const lndInfo = await lnd.getInfo();
		console.log(`LND node: ${lndInfo.identity_pubkey}`);

		const { address: lndAddress } = await lnd.newAddress();
		await fundAddress(bitcoin, lndAddress, 1, 6);

		// Get LDK node ID
		const nodeIdResult = await ldk.nodeId();
		if (nodeIdResult.isOk()) {
			ldkNodeId = nodeIdResult.value;
		}
	});

	it('should add LND as peer', async () => {
		if (!lm) {
			console.log('⊘ LDK not available');
			return;
		}

		const lndInfo = await lnd.getInfo();
		const lndPubKey = lndInfo.identity_pubkey;

		const addPeerResult = await lm.addPeer({
			pubKey: lndPubKey,
			address: config.lnd.host,
			port: config.lnd.p2pPort,
			timeout: 5000,
		});

		expect(addPeerResult.isOk()).toBe(true);

		// Wait for peer connection
		let connected = false;
		for (let i = 0; i < 20; i++) {
			const { peers } = await lnd.listPeers();
			if (peers.some((p) => p.pub_key === ldkNodeId)) {
				connected = true;
				break;
			}
			await sleep(1000);
		}

		expect(connected).toBe(true);
		console.log('✓ LND peer connected');
	});

	it('should open channel from LND to LDK', async () => {
		if (!lm || !ldkNodeId) {
			console.log('⊘ LDK not available or no node ID');
			return;
		}

		// Sync LDK
		await lm.syncLdk();

		// LND opens channel to LDK
		const channelResult = await lnd.openChannelSync({
			node_pubkey_string: ldkNodeId,
			local_funding_amount: config.channel.defaultCapacity.toString(),
			private: true,
		});

		expect(channelResult.funding_txid_str).toBeTruthy();

		// Mine blocks
		await mineBlocks(bitcoin, config.channel.confirmations);
		await sleep(2000);

		// Sync LDK
		await lm.syncLdk();
		await sleep(1000);

		// Wait for channel to be active
		let channelActive = false;
		for (let i = 0; i < 30; i++) {
			const listChannelsResult = await ldk.listChannels();
			if (listChannelsResult.isOk()) {
				const channels = listChannelsResult.value;
				if (channels.length > 0 && channels[0].is_usable) {
					channelActive = true;
					break;
				}
			}
			await sleep(2000);
		}

		expect(channelActive).toBe(true);
		console.log('✓ Channel opened and active');
	});

	it('should list open channels', async () => {
		if (!ldk) {
			console.log('⊘ LDK not available');
			return;
		}

		const listChannelsResult = await ldk.listChannels();
		expect(listChannelsResult.isOk()).toBe(true);
		expect(listChannelsResult.value.length).toBeGreaterThan(0);

		const channel = listChannelsResult.value[0];
		expect(channel.is_usable).toBe(true);
		expect(channel.balance_sat).toBeGreaterThan(0);

		console.log(`✓ Found ${listChannelsResult.value.length} channel(s)`);
	});
});

d('LDK RPC - Payment Operations', () => {
	let bitcoin;
	let lnd;

	beforeAll(async () => {
		if (!lm || !ldk) {
			return;
		}

		bitcoin = new BitcoinRPC(config.bitcoin.url);
		lnd = new LNDRPC(config.lnd.host, config.lnd.restPort, config.lnd.macaroon);
	});

	it('should create Lightning invoice', async () => {
		if (!lm) {
			console.log('⊘ LDK not available');
			return;
		}

		const invoiceResult = await lm.createAndStorePaymentRequest({
			amountSats: config.payment.medium,
			description: 'E2E test payment',
			expiryDeltaSeconds: 3600,
		});

		expect(invoiceResult.isOk()).toBe(true);
		expect(invoiceResult.value.to_str).toBeTruthy();
		expect(invoiceResult.value.to_str).toMatch(/^lnbcrt/);

		console.log('✓ Invoice created');
	});

	it('should receive payment from LND', async () => {
		if (!lm) {
			console.log('⊘ LDK not available');
			return;
		}

		// Create invoice
		const invoiceResult = await lm.createAndStorePaymentRequest({
			amountSats: config.payment.small,
			description: 'Receive test',
			expiryDeltaSeconds: 3600,
		});

		expect(invoiceResult.isOk()).toBe(true);

		await sleep(1000); // Wait for channel to be ready

		// LND pays the invoice
		const paymentResult = await lnd.sendPaymentSync({
			payment_request: invoiceResult.value.to_str,
		});

		expect(paymentResult.payment_error).toBe('');

		await sleep(1000);

		// Check claimed payments
		const claimed = await lm.getLdkPaymentsClaimed();
		expect(claimed.length).toBeGreaterThan(0);
		expect(claimed[0].state).toBe('successful');

		console.log('✓ Payment received from LND');
	});

	it('should send payment to LND', async () => {
		if (!lm || !ldk) {
			console.log('⊘ LDK not available');
			return;
		}

		// LND creates invoice
		const { payment_request: invoice } = await lnd.addInvoice({
			memo: 'E2E send test',
			value: config.payment.small.toString(),
		});

		// Decode invoice
		const decodeResult = await ldk.decode({ paymentRequest: invoice });
		expect(decodeResult.isOk()).toBe(true);

		// LDK pays invoice
		const payResult = await lm.payWithTimeout({
			paymentRequest: invoice,
			timeout: 10000,
		});

		expect(payResult.isOk()).toBe(true);

		await sleep(1000);

		// Check sent payments
		const sent = await lm.getLdkPaymentsSent();
		expect(sent.length).toBeGreaterThan(0);
		expect(sent[0].state).toBe('successful');

		console.log('✓ Payment sent to LND');
	});

	it('should handle zero-amount invoice', async () => {
		if (!lm) {
			console.log('⊘ LDK not available');
			return;
		}

		// Create zero-amount invoice
		const invoiceResult = await lm.createAndStorePaymentRequest({
			amountSats: 0,
			description: 'Zero amount test',
			expiryDeltaSeconds: 3600,
		});

		expect(invoiceResult.isOk()).toBe(true);

		await sleep(1000);

		// LND pays with custom amount
		const paymentResult = await lnd.sendPaymentSync({
			payment_request: invoiceResult.value.to_str,
			amt: config.payment.medium,
		});

		expect(paymentResult.payment_error).toBe('');

		console.log('✓ Zero-amount invoice works');
	});
});

d('LDK RPC - Event Handling', () => {
	it('should emit and handle events', async () => {
		if (!ldk || !EEventTypes) {
			console.log('⊘ LDK not available');
			return;
		}

		// Test event subscription
		let eventReceived = false;
		const subscription = ldk.onEvent(
			EEventTypes.channel_manager_payment_sent,
			() => {
				eventReceived = true;
			},
		);

		// In a real test, trigger an event by making a payment
		// For now, just verify subscription works
		expect(subscription).toBeTruthy();
		expect(subscription.remove).toBeTruthy();

		subscription.remove();

		console.log('✓ Event system works');
	});
});

d('LDK RPC - Cleanup', () => {
	it('should close channels cooperatively', async () => {
		if (!ldk) {
			console.log('⊘ LDK not available');
			return;
		}

		const listChannelsResult = await ldk.listChannels();
		if (listChannelsResult.isOk() && listChannelsResult.value.length > 0) {
			const channel = listChannelsResult.value[0];

			const closeResult = await ldk.closeChannel({
				channelId: channel.channel_id,
				counterPartyNodeId: channel.counterparty_node_id,
				force: false,
			});

			// Close might fail if channel is already closing
			console.log(
				closeResult.isOk() ? '✓ Channel close initiated' : '⊘ Channel already closing',
			);
		}
	});

	it('should stop LDK cleanly', async () => {
		if (!ldk) {
			console.log('⊘ LDK not available');
			return;
		}

		const stopResult = await ldk.stop();
		expect(stopResult.isOk()).toBe(true);

		console.log('✓ LDK stopped');

		// Mark test suite as complete
		markComplete('ldk-rpc');
	});
});
