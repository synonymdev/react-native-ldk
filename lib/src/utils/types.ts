export enum ENetworks {
	regtest = 'regtest',
	testnet = 'testnet',
	mainnet = 'mainnet',
}

export enum EEventTypes {
	ldk_log = 'ldk_log',
	native_log = 'native_log',
	register_tx = 'register_tx',
	register_output = 'register_output',
	broadcast_transaction = 'broadcast_transaction',
	backup = 'backup',
	channel_manager_funding_generation_ready = 'channel_manager_funding_generation_ready',
	channel_manager_payment_received = 'channel_manager_payment_received',
	channel_manager_payment_sent = 'channel_manager_payment_sent',
	channel_manager_open_channel_request = 'channel_manager_open_channel_request',
	channel_manager_payment_path_successful = 'channel_manager_payment_path_successful',
	channel_manager_payment_path_failed = 'channel_manager_payment_path_failed',
	channel_manager_payment_failed = 'channel_manager_payment_failed',
	channel_manager_pending_htlcs_forwardable = 'channel_manager_pending_htlcs_forwardable',
	channel_manager_spendable_outputs = 'channel_manager_spendable_outputs',
	channel_manager_channel_closed = 'channel_manager_channel_closed',
	channel_manager_discard_funding = 'channel_manager_discard_funding',
	channel_manager_payment_claimed = 'channel_manager_payment_claimed',
	emergency_force_close_channel = 'emergency_force_close_channel',
}

//LDK event responses
export type TRegisterTxEvent = { txid: string; script_pubkey: string };
export type TRegisterOutputEvent = {
	block_hash: string;
	index: number;
	script_pubkey: string;
};
export type TBroadcastTransactionEvent = { tx: string };

//LDK channel manager event responses
export type TChannelManagerFundingGenerationReady = {
	temp_channel_id: string;
	output_script: string;
	user_channel_id: number;
	value_satoshis: number;
};
export type TChannelManagerPayment = {
	payment_hash: string;
	amount_sat: number;
	payment_preimage: string;
	payment_secret: string;
	spontaneous_payment_preimage: string;
};
export type TChannelManagerPaymentSent = {
	payment_id: string;
	payment_preimage: string;
	payment_hash: string;
	fee_paid_sat: number;
};
export type TChannelManagerOpenChannelRequest = {
	temp_channel_id: string;
	counterparty_node_id: string;
	push_sat: number;
	funding_satoshis: number;
	channel_type: string;
};
export type TEmergencyForceCloseChannel = {
	channel_id: string;
	counterparty_node_id: string;
};

type TPath = {
	pubkey: string;
	fee_sat: number;
	short_channel_id: number;
	cltv_expiry_delta: number;
};

export type TChannelManagerPaymentPathSuccessful = {
	payment_id: string;
	payment_hash: string;
	path: TPath[];
};
export type TChannelManagerPaymentPathFailed = {
	payment_id: string;
	payment_hash: string;
	rejected_by_dest: boolean;
	short_channel_id: string;
	path: TPath[];
	network_update: string;
};
export type TChannelManagerPaymentFailed = {
	payment_id: string;
	payment_hash: string;
};
export type TChannelManagerPendingHtlcsForwardable = {
	time_forwardable: number;
};
export type TChannelManagerSpendableOutputs = {
	outputsSerialized: string[];
};
export type TChannelManagerChannelClosed = {
	user_channel_id: number;
	channel_id: string;
	reason: string;
};
export type TChannelManagerDiscardFunding = {
	channel_id: string;
	tx: string;
};

export type TChannel = {
	channel_id: string;
	is_public: boolean;
	is_usable: boolean;
	is_outbound: boolean;
	balance_sat: number;
	counterparty_node_id: string;
	funding_txo?: string;
	channel_type?: string;
	user_channel_id: number;
	confirmations_required?: number;
	short_channel_id?: number;
	inbound_scid_alias?: number;
	inbound_payment_scid?: number;
	inbound_capacity_sat: number;
	outbound_capacity_sat: number;
	channel_value_satoshis: number;
	force_close_spend_delay?: number;
	unspendable_punishment_reserve?: number;
};

export type TNetworkGraphChannelInfo = {
	shortChannelId: string;
	capacity_sats?: number;
	node_one: string;
	node_two: string;
	one_to_two_fees_base_sats: number;
	one_to_two_fees_proportional_millionths: number;
	one_to_two_enabled: boolean;
	one_to_two_last_update: number;
	one_to_two_htlc_maximum_sats: number;
	one_to_two_htlc_minimum_sats: number;
	two_to_one_fees_base_sats: number;
	two_to_one_fees_proportional_millionths: number;
	two_to_one_enabled: boolean;
	two_to_one_last_update: number;
	two_to_one_htlc_maximum_sats: number;
	two_to_one_htlc_minimum_sats: number;
};

export type TNetworkGraphNodeInfo = {
	nodeId: string;
	shortChannelIds: string[];
};

export type TInvoice = {
	amount_satoshis?: number;
	description?: string;
	check_signature: boolean;
	is_expired: boolean;
	duration_since_epoch: number;
	expiry_time: number;
	min_final_cltv_expiry: number;
	payee_pub_key: string;
	recover_payee_pub_key: string;
	payment_hash: string;
	payment_secret: string;
	timestamp: number;
	features?: string;
	currency: number;
	to_str: string; //Actual bolt11 invoice string
	route_hints: RouteHints[];
};

export type RouteHints = RouteHintHop[];

export type RouteHintHop = {
	src_node_id: string;
	short_channel_id: string;
};

export type TLogListener = {
	id: string;
	callback: (log: string) => void;
};

export type TFeeUpdateReq = {
	highPriority: number;
	normal: number;
	background: number;
};

export type TSyncTipReq = {
	header: string;
	height: number;
};

export type TPeer = {
	address: string;
	port: number;
	pubKey: string;
};

export type TAddPeerReq = {
	address: string;
	port: number;
	pubKey: string;
	timeout: number;
};

export type TSetTxConfirmedReq = {
	header: string;
	txData: {
		transaction: string;
		pos: number;
	}[];
	height: number;
};

export type TSetTxUnconfirmedReq = {
	txId: string;
};

export type TCloseChannelReq = {
	channelId: string;
	counterPartyNodeId: string;
	force?: boolean;
};

export type TSpendOutputsReq = {
	descriptorsSerialized: string[];
	outputs: {
		script_pubkey: string;
		value: number;
	}[];
	change_destination_script: string;
	feerate_sat_per_1000_weight: number;
};

export type TPaymentReq = {
	paymentRequest: string;
	amountSats?: number;
};

export type TCreatePaymentReq = {
	amountSats?: number;
	description: string;
	expiryDeltaSeconds: number;
};

export type TInitChannelManagerReq = {
	network: ENetworks;
	bestBlock: {
		hash: string;
		height: number;
	};
};

export type TInitNetworkGraphReq = {
	genesisHash: string;
};

export type TInitConfig = {
	acceptInboundChannels: boolean;
	manuallyAcceptInboundChannels: boolean;
	announcedChannels: boolean;
	minChannelHandshakeDepth: number;
};

export enum ELdkLogLevels {
	trace = 1, //LDKLevel_Trace
	debug = 2, //LDKLevel_Debug
	info = 3, //LDKLevel_Info
	warn = 4, //LDKLevel_Warn
	error = 5, //LDKLevel_Error
}

export type THeader = {
	hex: string;
	hash: string;
	height: number;
};

export type TTransactionData = {
	header: string;
	height: number;
	transaction: string;
	vout: TVout[];
};

export type TFileWriteReq = {
	fileName: string;
	path?: string;
	content: string;
	format?: 'hex' | 'string';
};

export type TFileReadReq = {
	fileName: string;
	format?: 'hex' | 'string';
	path?: string;
};

export type TFileReadRes = {
	content: string;
	timestamp: number;
};

export const DefaultTransactionDataShape: TTransactionData = {
	header: '',
	height: 0,
	transaction: '',
	vout: [],
};

export type TGetTransactionData = (txid: string) => Promise<TTransactionData>;
export type TGetBestBlock = () => Promise<THeader>;

export enum ELdkFiles {
	seed = 'seed', //32 bytes of entropy saved natively
	channel_manager = 'channel_manager.bin', //Serialised rust object
	channels = 'channels', //Path containing multiple files of serialised channels
	peers = 'peers.json', //JSON file saved from JS
	watch_transactions = 'watch_transactions.json', //JSON file saved from JS
	watch_outputs = 'watch_outputs.json', //JSON file saved from JS
	confirmed_transactions = 'confirmed_transactions.json',
	confirmed_outputs = 'confirmed_outputs.json',
	broadcasted_transactions = 'broadcasted_transactions.json',
}

export enum ELdkData {
	channel_manager = 'channel_manager',
	channel_monitors = 'channel_monitors',
	peers = 'peers',
	watch_transactions = 'watch_transactions',
	watch_outputs = 'watch_outputs',
	confirmed_transactions = 'confirmed_transactions',
	confirmed_outputs = 'confirmed_outputs',
	broadcasted_transactions = 'broadcasted_transactions',
	timestamp = 'timestamp',
}

export type TLdkData = {
	[ELdkData.channel_manager]: string;
	[ELdkData.channel_monitors]: { [key: string]: string };
	[ELdkData.peers]: TLdkPeers;
	[ELdkData.watch_transactions]: TRegisterTxEvent[];
	[ELdkData.watch_outputs]: TRegisterOutputEvent[];
	[ELdkData.confirmed_transactions]: TLdkConfirmedTransactions;
	[ELdkData.confirmed_outputs]: TLdkConfirmedOutputs;
	[ELdkData.broadcasted_transactions]: TLdkBroadcastedTransactions;
	[ELdkData.timestamp]: number;
};

export type TAccountBackup = {
	account: TAccount;
	data: TLdkData;
};

export type TLdkPeers = TPeer[];

export type TLdkConfirmedTransactions = string[];

export type TLdkConfirmedOutputs = string[];

export type TLdkBroadcastedTransactions = string[];

export const DefaultLdkDataShape: TLdkData = {
	[ELdkData.channel_manager]: '',
	[ELdkData.channel_monitors]: {},
	[ELdkData.peers]: [],
	[ELdkData.watch_transactions]: [],
	[ELdkData.watch_outputs]: [],
	[ELdkData.confirmed_transactions]: [],
	[ELdkData.confirmed_outputs]: [],
	[ELdkData.broadcasted_transactions]: [],

	[ELdkData.timestamp]: 0,
};

export type TAvailableNetworks =
	| 'bitcoin'
	| 'bitcoinTestnet'
	| 'bitcoinRegtest';

export type TAccount = {
	name: string;
	seed: string;
};

export type TLdkStart = {
	account: TAccount;
	genesisHash: string;
	getBestBlock: TGetBestBlock;
	getTransactionData: TGetTransactionData;
	getAddress: TGetAddress;
	getScriptPubKeyHistory: TGetScriptPubKeyHistory;
	broadcastTransaction: TBroadcastTransaction;
	network?: ENetworks;
	feeRate?: number;
};

export type TGetAddress = () => Promise<string>;

export type TGetScriptPubKeyHistory = (
	address: string,
) => Promise<TGetScriptPubKeyHistoryResponse[]>;

export type TGetScriptPubKeyHistoryResponse = { height: number; txid: string };

export type TBroadcastTransaction = (rawTx: string) => Promise<any>;

export type TVout = { hex: string; n: number; value: number };
