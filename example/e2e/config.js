/**
 * E2E Test Configuration
 * Shared configuration for all E2E tests
 */

const { Platform } = require('react-native');

/**
 * Get host for accessing localhost services
 * Android emulator uses 10.0.2.2 to access host machine
 * iOS simulator can use 127.0.0.1
 */
const getHost = () => {
	if (device.getPlatform() === 'android') {
		return '10.0.2.2';
	}
	return '127.0.0.1';
};

/**
 * Bitcoin Core RPC configuration
 */
const bitcoin = {
	url: `http://user:pass@${getHost()}:18443`,
	host: getHost(),
	port: 18443,
	user: 'user',
	pass: 'pass',
};

/**
 * Electrum server configuration
 */
const electrum = {
	host: getHost(),
	port: 60001,
	protocol: 'tcp',
};

/**
 * LND node configuration
 */
const lnd = {
	host: getHost(),
	restPort: 8080,
	p2pPort: 9735,
	rpcPort: 10009,
	// Admin macaroon (hex encoded)
	macaroon:
		'0201036c6e640224030a10a03e69dddedffea70372bbe27e2b1c281201301a0c0a04696e666f120472656164000006202d1cda6fcc33cdfca4faba851280c9e56e22a2100b3fad75a3c15d31d4c3bb9f',
	// LND node public key (will be populated after LND starts)
	pubKey: '',
};

/**
 * Core Lightning node configuration
 */
const clightning = {
	host: getHost(),
	restPort: 18081,
	p2pPort: 9736,
	rpcPort: 11001,
	// Access macaroon
	macaroon: '',
	pubKey: '',
};

/**
 * Eclair node configuration
 */
const eclair = {
	host: getHost(),
	restPort: 28081,
	p2pPort: 9737,
	password: 'pass',
	pubKey: '',
};

/**
 * Backup server configuration
 */
const backupServer = {
	host: `http://${getHost()}:3003`,
	port: 3003,
	serverPubKey:
		'0319c4ff23820afec0c79ce3a42031d7fef1dff78b7bdd69b5560684f3e1827675',
};

/**
 * Test timeouts (in milliseconds)
 */
const timeouts = {
	short: 5000, // 5 seconds
	medium: 30000, // 30 seconds
	long: 60000, // 1 minute
	veryLong: 120000, // 2 minutes
	ldkStart: 180000, // 3 minutes for LDK startup
};

/**
 * Test accounts
 * Different seed phrases for different test scenarios
 */
const accounts = {
	// Default test account
	default: {
		name: 'test-default',
		seed: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
		network: 'regtest',
	},
	// Account for channel tests
	channel: {
		name: 'test-channel',
		seed: 'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong',
		network: 'regtest',
	},
	// Account for payment tests
	payment: {
		name: 'test-payment',
		seed: 'legal winner thank year wave sausage worth useful legal winner thank yellow',
		network: 'regtest',
	},
	// Account for backup/restore tests
	backup: {
		name: 'test-backup',
		seed: 'letter advice cage absurd amount doctor acoustic avoid letter advice cage above',
		network: 'regtest',
	},
};

/**
 * Channel configuration
 */
const channel = {
	// Default channel capacity in satoshis
	defaultCapacity: 1000000, // 0.01 BTC
	// Minimum channel capacity
	minCapacity: 20000,
	// Default push amount
	defaultPushAmount: 0,
	// Confirmation blocks required
	confirmations: 3,
};

/**
 * Payment configuration
 */
const payment = {
	// Default payment amounts in satoshis
	small: 1000, // 1k sats
	medium: 10000, // 10k sats
	large: 100000, // 100k sats
};

/**
 * Mining configuration
 */
const mining = {
	// Default number of blocks to mine for confirmations
	defaultBlocks: 6,
	// Blocks to mine to mature coinbase outputs
	coinbaseMaturity: 101,
};

module.exports = {
	getHost,
	bitcoin,
	electrum,
	lnd,
	clightning,
	eclair,
	backupServer,
	timeouts,
	accounts,
	channel,
	payment,
	mining,
};
