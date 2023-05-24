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
	getLdkConfirmedTxs: noop,
	getLdkPaymentIds: noop,
	removeLdkPaymentId: noop,
	appendLdkPaymentId: noop,
	getLdkConfirmedOutputs: noop,
	getLdkSpendableOutputs: noop,
	saveConfirmedTxs: noop,
	saveConfirmedOutputs: noop,
	saveBroadcastedTxs: noop,
	saveLdkPeerData: noop,

	currentBlock: {
		height: 1,
		hex: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
		hash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
	},
	watchTxs: [],
	watchOutputs: [],
	account: {
		name: 'wallet0bitcoinldkaccount',
		seed: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
	},
	backupSubscriptions: {},
	backupSubscriptionsId: 1,
	backupSubscriptionsDebounceTimer: 1,
	network: 'mainnet',
	baseStoragePath: '/ldk/',
	logFilePath: '/ldk/wallet0bitcoinldkaccount/logs/1.log',
};
