/**
 * E2E Test Helpers for react-native-ldk
 * Modeled after Bitkit's E2E test patterns
 */

const fs = require('fs');
const path = require('path');

/**
 * Promise-based sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Check if a test has been completed (for CI idempotence)
 * @param {string} name - Test name
 * @returns {boolean}
 */
const checkComplete = (name) => {
	const lockFile = path.join(__dirname, `.complete-${name}`);
	return fs.existsSync(lockFile);
};

/**
 * Mark a test as completed
 * @param {string} name - Test name
 */
const markComplete = (name) => {
	const lockFile = path.join(__dirname, `.complete-${name}`);
	fs.writeFileSync(lockFile, new Date().toISOString());
};

/**
 * Check if a button is enabled
 * @param {Detox.IndexableNativeElement} element - Detox element
 * @returns {Promise<boolean>}
 */
const isButtonEnabled = async (element) => {
	try {
		const attributes = await element.getAttributes();
		return attributes.enabled;
	} catch (error) {
		return false;
	}
};

/**
 * Wait for an element attribute to match a condition
 * @param {Detox.IndexableNativeElement} element - Detox element
 * @param {string} attribute - Attribute name
 * @param {any} expectedValue - Expected value
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
const waitForElementAttribute = async (
	element,
	attribute,
	expectedValue,
	timeout = 10000,
) => {
	const startTime = Date.now();
	while (Date.now() - startTime < timeout) {
		try {
			const attributes = await element.getAttributes();
			if (attributes[attribute] === expectedValue) {
				return;
			}
		} catch (error) {
			// Element might not be ready yet
		}
		await sleep(500);
	}
	throw new Error(
		`Timeout waiting for element attribute ${attribute} to be ${expectedValue}`,
	);
};

/**
 * Launch app and wait for it to be ready
 * @param {object} options - Launch options
 * @returns {Promise<void>}
 */
const launchAndWait = async (options = {}) => {
	await device.launchApp({
		newInstance: true,
		permissions: { notifications: 'YES', camera: 'YES' },
		...options,
	});

	// Wait for app to be ready
	await waitFor(element(by.text('react-native-ldk')))
		.toBeVisible()
		.withTimeout(60000);
};

/**
 * Tap the dev button to navigate to dev screen
 * @returns {Promise<void>}
 */
const navigateToDevScreen = async () => {
	await element(by.id('dev')).tap();
	await sleep(1000);
};

/**
 * Wait for LDK to start and show "Running LDK" message
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
const waitForLDKReady = async (timeout = 60000) => {
	await waitFor(element(by.text('Running LDK')))
		.toBeVisible()
		.withTimeout(timeout);
};

/**
 * Wait for text to appear on screen
 * @param {string} text - Text to wait for
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
const waitForText = async (text, timeout = 30000) => {
	await waitFor(element(by.text(text)))
		.toBeVisible()
		.withTimeout(timeout);
};

/**
 * Wait for element by ID to be visible
 * @param {string} id - Element ID
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
const waitForElement = async (id, timeout = 30000) => {
	await waitFor(element(by.id(id)))
		.toBeVisible()
		.withTimeout(timeout);
};

/**
 * Scroll to element and tap it
 * @param {string} id - Element ID
 * @param {string} scrollViewId - ScrollView ID
 * @returns {Promise<void>}
 */
const scrollAndTap = async (id, scrollViewId = 'scrollView') => {
	await waitFor(element(by.id(id)))
		.toBeVisible()
		.whileElement(by.id(scrollViewId))
		.scroll(200, 'down');
	await element(by.id(id)).tap();
};

/**
 * Type text into an input field
 * @param {string} id - Input field ID
 * @param {string} text - Text to type
 * @returns {Promise<void>}
 */
const typeText = async (id, text) => {
	await element(by.id(id)).tap();
	await element(by.id(id)).typeText(text);
};

/**
 * Clear text from an input field
 * @param {string} id - Input field ID
 * @returns {Promise<void>}
 */
const clearText = async (id) => {
	await element(by.id(id)).tap();
	await element(by.id(id)).clearText();
};

/**
 * RPC Client for Bitcoin Core
 */
class BitcoinRPC {
	constructor(url = 'http://user:pass@127.0.0.1:18443') {
		this.url = url;
	}

	async call(method, params = []) {
		const response = await fetch(this.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '1.0',
				id: 'test',
				method,
				params,
			}),
		});

		const data = await response.json();
		if (data.error) {
			throw new Error(`Bitcoin RPC error: ${data.error.message}`);
		}
		return data.result;
	}

	async getBlockCount() {
		return await this.call('getblockcount');
	}

	async generateToAddress(blocks, address) {
		return await this.call('generatetoaddress', [blocks, address]);
	}

	async getNewAddress() {
		return await this.call('getnewaddress');
	}

	async sendToAddress(address, amount) {
		return await this.call('sendtoaddress', [address, amount]);
	}

	async getTransaction(txid) {
		return await this.call('gettransaction', [txid]);
	}
}

/**
 * RPC Client for LND
 */
class LNDRPC {
	constructor(
		host = '127.0.0.1',
		port = 8080,
		macaroon = '0201036c6e640224030a10a03e69dddedffea70372bbe27e2b1c281201301a0c0a04696e666f120472656164000006202d1cda6fcc33cdfca4faba851280c9e56e22a2100b3fad75a3c15d31d4c3bb9f',
	) {
		this.host = host;
		this.port = port;
		this.macaroon = macaroon;
		this.headers = {
			'Content-Type': 'application/json',
			'Grpc-Metadata-macaroon': macaroon,
		};
	}

	async call(path, method = 'GET', body = null) {
		const url = `http://${this.host}:${this.port}${path}`;
		const options = {
			method,
			headers: this.headers,
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(url, options);
		if (!response.ok) {
			const error = await response.json();
			throw new Error(`LND RPC error: ${error.message || response.statusText}`);
		}
		return await response.json();
	}

	async getInfo() {
		return await this.call('/v1/getinfo');
	}

	async listPeers() {
		return await this.call('/v1/peers');
	}

	async listChannels(params = {}) {
		const queryString = Object.keys(params)
			.map((key) => `${key}=${params[key]}`)
			.join('&');
		const path = queryString ? `/v1/channels?${queryString}` : '/v1/channels';
		return await this.call(path);
	}

	async openChannelSync(body) {
		return await this.call('/v1/channels', 'POST', body);
	}

	async addInvoice(body) {
		return await this.call('/v1/invoices', 'POST', body);
	}

	async sendPaymentSync(body) {
		return await this.call('/v1/channels/transactions', 'POST', body);
	}

	async decodePayReq(paymentRequest) {
		return await this.call(`/v1/payreq/${paymentRequest}`);
	}

	async newAddress() {
		return await this.call('/v1/newaddress');
	}
}

/**
 * Wait for LND to sync with blockchain
 * @param {LNDRPC} lnd - LND RPC client
 * @param {BitcoinRPC} bitcoin - Bitcoin RPC client
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
const waitForLNDSync = async (lnd, bitcoin, timeout = 30000) => {
	const startTime = Date.now();
	while (Date.now() - startTime < timeout) {
		const info = await lnd.getInfo();
		const blockCount = await bitcoin.getBlockCount();
		if (info.synced_to_chain && info.block_height === blockCount) {
			return;
		}
		await sleep(1000);
	}
	throw new Error('Timeout waiting for LND to sync');
};

/**
 * Wait for peer connection to be established
 * @param {LNDRPC} lnd - LND RPC client
 * @param {string} nodeId - Node public key to wait for
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
const waitForPeerConnection = async (lnd, nodeId, timeout = 30000) => {
	const startTime = Date.now();
	while (Date.now() - startTime < timeout) {
		const { peers } = await lnd.listPeers();
		if (peers.find((p) => p.pub_key === nodeId)) {
			return;
		}
		await sleep(1000);
	}
	throw new Error(`Timeout waiting for peer connection to ${nodeId}`);
};

/**
 * Wait for channel to become active
 * @param {LNDRPC} lnd - LND RPC client
 * @param {string} channelPoint - Channel point (txid:vout)
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<object>}
 */
const waitForActiveChannel = async (lnd, channelPoint, timeout = 60000) => {
	const startTime = Date.now();
	while (Date.now() - startTime < timeout) {
		const { channels } = await lnd.listChannels({ active_only: true });
		const channel = channels.find((c) => c.channel_point === channelPoint);
		if (channel && channel.active) {
			return channel;
		}
		await sleep(2000);
	}
	throw new Error(`Timeout waiting for channel ${channelPoint} to become active`);
};

/**
 * Mine blocks and wait for confirmation
 * @param {BitcoinRPC} bitcoin - Bitcoin RPC client
 * @param {number} blocks - Number of blocks to mine
 * @returns {Promise<void>}
 */
const mineBlocks = async (bitcoin, blocks = 6) => {
	const address = await bitcoin.getNewAddress();
	await bitcoin.generateToAddress(blocks, address);
	await sleep(2000); // Wait for propagation
};

/**
 * Fund an address with bitcoin and mine confirmation blocks
 * @param {BitcoinRPC} bitcoin - Bitcoin RPC client
 * @param {string} address - Address to fund
 * @param {number} amount - Amount in BTC
 * @param {number} confirmations - Number of confirmation blocks
 * @returns {Promise<string>} Transaction ID
 */
const fundAddress = async (bitcoin, address, amount, confirmations = 6) => {
	const txid = await bitcoin.sendToAddress(address, amount);
	await mineBlocks(bitcoin, confirmations);
	return txid;
};

/**
 * Wait for Electrum server to sync with Bitcoin Core
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
const waitForElectrumSync = async (timeout = 30000) => {
	// This is a simplified version - in production you'd connect to Electrum
	// For now, just wait a bit for sync to happen
	await sleep(2000);
};

/**
 * Wait for backup to complete
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
const waitForBackup = async (timeout = 10000) => {
	// Wait for backup state to update
	await sleep(2000);
	// In real implementation, you'd check backup server or app state
};

/**
 * Get seed phrase from app UI
 * This navigates through the UI to extract the seed phrase
 * @returns {Promise<string[]>} Array of seed words
 */
const getSeed = async () => {
	// Navigate to settings/backup to view seed
	// This is app-specific and would need to be implemented
	// based on the actual UI flow
	throw new Error('getSeed not implemented - app specific UI navigation required');
};

/**
 * Restore wallet from seed phrase
 * @param {string[]} seed - Array of seed words
 * @param {string} passphrase - BIP39 passphrase (optional)
 * @returns {Promise<void>}
 */
const restoreWallet = async (seed, passphrase = '') => {
	// Navigate through restore flow
	// This is app-specific and would need to be implemented
	throw new Error(
		'restoreWallet not implemented - app specific UI navigation required',
	);
};

/**
 * Complete onboarding flow
 * @param {object} options - Onboarding options
 * @returns {Promise<void>}
 */
const completeOnboarding = async (options = {}) => {
	// Navigate through onboarding screens
	// This is app-specific and would need to be implemented
	throw new Error(
		'completeOnboarding not implemented - app specific UI navigation required',
	);
};

module.exports = {
	// Test state management
	checkComplete,
	markComplete,

	// Utilities
	sleep,
	isButtonEnabled,
	waitForElementAttribute,

	// App navigation
	launchAndWait,
	navigateToDevScreen,
	waitForLDKReady,
	waitForText,
	waitForElement,
	scrollAndTap,
	typeText,
	clearText,

	// RPC clients
	BitcoinRPC,
	LNDRPC,

	// Lightning operations
	waitForLNDSync,
	waitForPeerConnection,
	waitForActiveChannel,

	// Blockchain operations
	mineBlocks,
	fundAddress,
	waitForElectrumSync,

	// Backup operations
	waitForBackup,

	// Wallet operations (to be implemented per app)
	getSeed,
	restoreWallet,
	completeOnboarding,
};
