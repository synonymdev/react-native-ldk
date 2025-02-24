import { ENetworks } from './utils/types';

export * from './utils/types';

const noop = (): void => {};

export const ldk = {
	ldkEvent: noop,
	logListeners: [],
	reset: noop,
};

export default {
	getBestBlock: noop,
	getTransactionData: noop,
	getTransactionPosition: noop,
	getAddress: noop,
	getScriptPubKeyHistory: noop,
	getFees: noop,
	broadcastTransaction: noop,
	addPeer: noop,
	removePeer: noop,
	getPeers: noop,
	importAccount: noop,
	backupAccount: noop,
	payWithTimeout: noop,
	subscribeAndPay: noop,
	subscribeToPaymentResponses: noop,
	unsubscribeFromPaymentSubscriptions: noop,
	getChangeDestinationScript: noop,
	getLdkPaymentIds: noop,
	removeLdkPaymentId: noop,
	appendLdkPaymentId: noop,
	getLdkUnconfirmedTxs: noop,
	getLdkSpendableOutputs: noop,
	readAddressesFromFile: noop,
	saveUnconfirmedTxs: noop,
	saveBroadcastedTxs: noop,
	saveLdkPeerData: noop,

	currentBlock: {
		height: 1,
		hex: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
		hash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
	},
	unconfirmedTxs: [],
	watchTxs: [],
	watchOutputs: [],
	account: {
		name: 'wallet0bitcoinldkaccount',
		seed: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
	},
	backupSubscriptions: {},
	backupSubscriptionsId: 1,
	backupSubscriptionsDebounceTimer: 1,
	network: ENetworks.mainnet,
	baseStoragePath: '/ldk/',
	logFilePath: '/ldk/wallet0bitcoinldkaccount/logs/1.log',
};
