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
	channel_manager_payment_claimable = 'channel_manager_payment_claimable',
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
	new_channel = 'new_channel',
	network_graph_updated = 'network_graph_updated',
	channel_manager_restarted = 'channel_manager_restarted',
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
	user_channel_id: string;
	value_satoshis: number;
};

export type TChannelManagerClaim = {
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

export type TChannelUpdate = {
	channel_id: string;
	counterparty_node_id: string;
};

type TPath = {
	pubkey: string;
	fee_sat: number;
	short_channel_id: string;
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
	payment_failed_permanently: boolean;
	short_channel_id: string;
	path: TPath[];
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
	user_channel_id: string;
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
	is_channel_ready: boolean;
	is_outbound: boolean;
	balance_sat: number;
	counterparty_node_id: string;
	funding_txid?: string;
	channel_type?: string;
	user_channel_id: string;
	confirmations_required?: number;
	short_channel_id: string;
	inbound_scid_alias?: number;
	inbound_payment_scid?: number;
	inbound_capacity_sat: number;
	outbound_capacity_sat: number;
	channel_value_satoshis: number;
	force_close_spend_delay?: number;
	unspendable_punishment_reserve?: number;
	config_forwarding_fee_base_msat: number;
	config_forwarding_fee_proportional_millionths: number;
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
	id: string;
	shortChannelIds: string[];
	announcement_info_last_update: number;
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
	currency: string;
	to_str: string; //Actual bolt11 invoice string
	route_hints: TRouteHints[];
};

export type TNetworkGraphUpdated = {
	channel_count: number;
	node_count: number;
};

export type TRouteHints = TRouteHintHop[];

export type TRouteHintHop = {
	src_node_id: string;
	short_channel_id: string;
};

export type TPaymentRoute = TPaymentHop[];

export type TPaymentHop = {
	dest_node_id: string;
	short_channel_id: string;
	fee_sats: number;
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

export type TPaymentTimeoutReq = TPaymentReq & {
	timeout?: number; //ms
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
	network: ENetworks;
	rapidGossipSyncUrl?: string;
};

export type TChannelHandshakeConfig = {
	minimum_depth?: number; //UInt32
	//Snake case because of rust
	our_to_self_delay?: number; //UInt16
	our_htlc_minimum_msat?: number; //UInt64
	max_htlc_value_in_flight_percent_of_channel?: number; //UInt8
	negotiate_scid_privacy?: boolean;
	announced_channel?: boolean;
	commit_upfront_shutdown_pubkey?: boolean;
	their_channel_reserve_proportional_millionths?: number; //UInt32
};

export type TChannelHandshakeLimits = {
	min_funding_satoshis?: number; //UInt64
	max_funding_satoshis?: number; //UInt64
	max_htlc_minimum_msat?: number; //UInt64
	min_max_htlc_value_in_flight_msat?: number; //UInt64,
	max_channel_reserve_satoshis?: number; //UInt64
	min_max_accepted_htlcs?: number; //UInt16
	max_minimum_depth?: number; //UInt32
	trust_own_funding_0conf?: boolean;
	force_announced_channel_preference?: boolean;
	their_to_self_delay?: number; //UInt16
};

export type TChannelConfig = {
	forwarding_fee_proportional_millionths?: number; //UInt32
	forwarding_fee_base_msat?: number; //UInt32
	cltv_expiry_delta?: number; //UInt16
	max_dust_htlc_exposure_msat?: number; //UInt64
	force_close_avoidance_max_fee_satoshis?: number; //UInt64
};

//Mirrors the rust struct
export type TUserConfig = {
	channel_handshake_config?: TChannelHandshakeConfig;
	channel_handshake_limits?: TChannelHandshakeLimits;
	channel_config?: TChannelConfig;
	accept_forwards_to_priv_channels?: boolean;
	accept_inbound_channels?: boolean;
	manually_accept_inbound_channels?: boolean;
	accept_intercept_htlcs?: boolean;
};

export const defaultUserConfig: TUserConfig = {
	channel_handshake_config: {
		announced_channel: false,
		minimum_depth: 1,
		max_htlc_value_in_flight_percent_of_channel: 100,
	},
	manually_accept_inbound_channels: false,
	accept_inbound_channels: true,
};

export enum ELdkLogLevels {
	gossip = 'GOSSIP',
	trace = 'TRACE',
	debug = 'DEBUG',
	info = 'INFO',
	warn = 'WARN',
	error = 'ERROR',
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

export type TTransactionPosition = number;

export type TClaimableBalance = {
	claimable_amount_satoshis: number;
	type:
		| 'ClaimableAwaitingConfirmations'
		| 'ClaimableOnChannelClose'
		| 'ContentiousClaimable'
		| 'CounterpartyRevokedOutputClaimable'
		| 'MaybePreimageClaimableHTLC'
		| 'MaybeTimeoutClaimableHTLC'
		| 'Unknown';
	confirmation_height?: number;
	timeout_height?: number;
	claimable_height?: number;
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
export type TGetTransactionPosition = (params: {
	tx_hash: string;
	height: number;
}) => Promise<TTransactionPosition>;
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
	payment_ids = 'payment_ids.json',
}

export enum ELdkData {
	channel_manager = 'channel_manager',
	channel_monitors = 'channel_monitors',
	peers = 'peers',
	confirmed_transactions = 'confirmed_transactions',
	confirmed_outputs = 'confirmed_outputs',
	broadcasted_transactions = 'broadcasted_transactions',
	payment_ids = 'payment_ids',
	timestamp = 'timestamp',
}

export type TLdkData = {
	[ELdkData.channel_manager]: string;
	[ELdkData.channel_monitors]: { [key: string]: string };
	[ELdkData.peers]: TLdkPeers;
	[ELdkData.confirmed_transactions]: TLdkConfirmedTransactions;
	[ELdkData.confirmed_outputs]: TLdkConfirmedOutputs;
	[ELdkData.broadcasted_transactions]: TLdkBroadcastedTransactions;
	[ELdkData.payment_ids]: TLdkPaymentIds;
	[ELdkData.timestamp]: number;
};

export type TAccountBackup = {
	account: TAccount;
	package_version: string;
	network: ENetworks;
	data: TLdkData;
};

export type TLdkPeers = TPeer[];

export type TLdkConfirmedTransactions = string[];

export type TLdkConfirmedOutputs = string[];

export type TLdkBroadcastedTransactions = string[];

export type TLdkPaymentIds = string[];

export const DefaultLdkDataShape: TLdkData = {
	[ELdkData.channel_manager]: '',
	[ELdkData.channel_monitors]: {},
	[ELdkData.peers]: [],
	[ELdkData.confirmed_transactions]: [],
	[ELdkData.confirmed_outputs]: [],
	[ELdkData.broadcasted_transactions]: [],
	[ELdkData.payment_ids]: [],
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
	getTransactionPosition: TGetTransactionPosition;
	getAddress: TGetAddress;
	getScriptPubKeyHistory: TGetScriptPubKeyHistory;
	getFees: TGetFees;
	broadcastTransaction: TBroadcastTransaction;
	network: ENetworks;
	rapidGossipSyncUrl?: string;
	userConfig?: TUserConfig;
};

export type TGetAddress = () => Promise<string>;

export type TGetScriptPubKeyHistory = (
	address: string,
) => Promise<TGetScriptPubKeyHistoryResponse[]>;

export type TGetScriptPubKeyHistoryResponse = { height: number; txid: string };

export type TBroadcastTransaction = (rawTx: string) => Promise<any>;

export type TGetFees = () => Promise<TFeeUpdateReq>;

export type TVout = { hex: string; n: number; value: number };
