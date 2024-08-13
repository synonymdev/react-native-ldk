export enum ENetworks {
	signet = 'signet',
	regtest = 'regtest',
	testnet = 'testnet',
	mainnet = 'bitcoin',
}

export type TAvailableNetworks =
	| 'bitcoin'
	| 'bitcoinTestnet'
	| 'bitcoinRegtest'
	| 'bitcoinSignet';

export enum EEventTypes {
	ldk_log = 'ldk_log',
	native_log = 'native_log',
	register_tx = 'register_tx',
	register_output = 'register_output',
	broadcast_transaction = 'broadcast_transaction',
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
	backup_state_update = 'backup_state_update',
	lsp_log = 'lsp_log',
	used_close_address = 'used_close_address',
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

export type TPaymentState = 'pending' | 'failed' | 'successful';

export type TChannelManagerClaim = {
	payment_hash: string;
	amount_sat: number;
	payment_preimage: string;
	payment_secret: string;
	spontaneous_payment_preimage: string;
	unix_timestamp: number;
	state: TPaymentState;
};

export type TChannelManagerPaymentSent = {
	bolt11_invoice?: string;
	description?: string;
	payment_id: string;
	payment_preimage?: string;
	payment_hash: string;
	fee_paid_sat: number;
	amount_sat?: number;
	unix_timestamp: number;
	state: TPaymentState;
};

export type TChannelManagerOpenChannelRequest = {
	temp_channel_id: string;
	counterparty_node_id: string;
	push_sat: number;
	funding_satoshis: number;
	requires_zero_conf: boolean;
	supports_zero_conf: boolean;
	requires_anchors_zero_fee_htlc_tx: boolean;
};

export type TChannelUpdate = {
	channel_id: string;
	counterparty_node_id: string;
};

type TPathHop = {
	pubkey: string;
	fee_sat: number;
	short_channel_id: string;
	cltv_expiry_delta: number;
};

export type TChannelManagerPaymentPathSuccessful = {
	payment_id: string;
	payment_hash: string;
	path_hops: TPathHop[];
};

export type TChannelManagerPaymentPathFailed = {
	payment_id: string;
	payment_hash: string;
	payment_failed_permanently: boolean;
	short_channel_id: string;
	path_hops: TPathHop[];
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
	funding_output_index? : number;
	channel_type?: string;
	user_channel_id: string;
	confirmations_required?: number;
	short_channel_id: string;
	inbound_scid_alias: string;
	inbound_payment_scid: string;
	inbound_capacity_sat: number;
	outbound_capacity_sat: number;
	channel_value_satoshis: number;
	force_close_spend_delay?: number;
	unspendable_punishment_reserve?: number;
	config_forwarding_fee_base_msat: number;
	config_forwarding_fee_proportional_millionths: number;
	confirmations: number;
};

export type TChannelMonitor = {
	channel_id: string;
	funding_txo_index: number;
	funding_txo_txid: string;
	counterparty_node_id: string;
	claimable_balances: [TClaimableBalance];
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
	anchorChannelFee: number;
	nonAnchorChannelFee: number;
	channelCloseMinimum: number;
	minAllowedAnchorChannelRemoteFee: number;
	onChainSweep: number;
	minAllowedNonAnchorChannelRemoteFee: number;
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

export type TCloseChannelReq = {
	channelId: string;
	counterPartyNodeId: string;
	force?: boolean;
};

export type TAcceptChannelReq = {
	temporaryChannelId: string;
	counterPartyNodeId: string;
	trustedPeer0Conf: boolean;
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
	timeout?: number; //ms
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

export type TDownloadScorer = {
	scorerDownloadUrl: string;
	skipHoursThreshold?: number;
};

export type TInitKeysManager = {
	seed: string;
	address: string;
	channelCloseDestinationScriptPublicKey: string;
	channelCloseWitnessProgram: string;
	channelCloseWitnessProgramVersion: number;
};

export type TInitNetworkGraphReq = {
	network: ENetworks;
	rapidGossipSyncUrl?: string;
	skipHoursThreshold?: number;
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
	negotiate_anchors_zero_fee_htlc_tx?: boolean;
	our_max_accepted_htlcs_arg?: number; //UInt16
	max_inbound_htlc_value_in_flight_percent_of_channel?: number; //UInt8
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
	max_dust_htlc_exposure_type?: 'fixed_limit' | 'fee_rate_multiplier';
	max_dust_htlc_exposure?: number; //UInt64
	force_close_avoidance_max_fee_satoshis?: number; //UInt64
	accept_underpaying_htlcs?: boolean;
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
	accept_mpp_keysend?: boolean;
};

export const defaultUserConfig: TUserConfig = {
	channel_handshake_config: {
		announced_channel: false,
		minimum_depth: 1,
		max_htlc_value_in_flight_percent_of_channel: 100,
		max_inbound_htlc_value_in_flight_percent_of_channel: 100,
		negotiate_anchors_zero_fee_htlc_tx: true,
	},
	manually_accept_inbound_channels: true,
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
	amount_satoshis: number;
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
	remotePersist: boolean;
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

export type TGetTransactionData = (
	txid: string,
) => Promise<TTransactionData | undefined>;
export type TGetTransactionPosition = (params: {
	tx_hash: string;
	height: number;
}) => Promise<TTransactionPosition>;
export type TGetBestBlock = () => Promise<THeader>;

//LDK file names should match labels on backup server
export enum ELdkFiles {
	seed = 'seed', //32 bytes of entropy saved natively
	channel_manager = 'channel_manager.bin', //Serialised rust object
	channels = 'channels', //Path containing multiple files of serialised channels
	peers = 'peers.json', //File saved from JS
	trusted_peer_node_ids = 'trusted_peer_node_ids.json', //File saved from JS
	unconfirmed_transactions = 'unconfirmed_transactions.json',
	broadcasted_transactions = 'broadcasted_transactions.json',
	confirmed_broadcasted_transactions = 'confirmed_broadcasted_transactions.json',
	payment_ids = 'payment_ids.json',
	spendable_outputs = 'spendable_outputs.json',
	payments_claimed = 'payments_claimed.json', // Written in swift/kotlin and read from JS
	payments_sent = 'payments_sent.json', // Written in swift/kotlin and read from JS
	bolt11_invoices = 'bolt11_invoices.json', // Saved/read from JS
	addresses = 'addresses.json', // Saved/read from JS
	confirmed_watch_outputs = 'confirmed_watch_outputs.json',
}

export enum ELdkData {
	channel_manager = 'channel_manager',
	channel_monitors = 'channel_monitors',
	peers = 'peers',
	unconfirmed_transactions = 'unconfirmed_transactions',
	broadcasted_transactions = 'broadcasted_transactions',
	payment_ids = 'payment_ids',
	timestamp = 'timestamp',
	spendable_outputs = 'spendable_outputs',
	payments_claimed = 'payments_claimed',
	payments_sent = 'payments_sent',
	bolt11_invoices = 'bolt11_invoices',
}

//Can be removed after importAccount is officially removed
export type TLdkData = {
	[ELdkData.channel_manager]: string;
	[ELdkData.channel_monitors]: { [key: string]: string };
	[ELdkData.peers]: TLdkPeers;
	[ELdkData.unconfirmed_transactions]: TLdkUnconfirmedTransactions;
	[ELdkData.broadcasted_transactions]: TLdkBroadcastedTransactions;
	[ELdkData.payment_ids]: TLdkPaymentIds;
	[ELdkData.timestamp]: number;
	[ELdkData.spendable_outputs]: TLdkSpendableOutputs;
	[ELdkData.payments_claimed]: TChannelManagerClaim[];
	[ELdkData.payments_sent]: TChannelManagerPaymentSent[];
	[ELdkData.bolt11_invoices]: TBolt11Invoices;
};

//Can be removed after importAccount is officially removed
export type TAccountBackup = {
	account: TAccount;
	package_version: string;
	network: ENetworks;
	data: TLdkData;
};

export type TLdkPeers = TPeer[];

export type TLdkUnconfirmedTransaction = TTransactionData & {
	txid: string;
	script_pubkey: string;
};

export type TLdkUnconfirmedTransactions = TLdkUnconfirmedTransaction[];

export type TLdkBroadcastedTransactions = string[];

export type TLdkPaymentIds = string[];

export type TBolt11Invoices = string[];

export type TLdkSpendableOutputs = string[];

export type TAccount = {
	name: string;
	seed: string;
};

type TForceCloseOnStartup = {
	forceClose: boolean;
	broadcastLatestTx: boolean;
};

export type TLdkStart = {
	account: TAccount;
	getBestBlock: TGetBestBlock;
	getTransactionData: TGetTransactionData;
	getTransactionPosition: TGetTransactionPosition;
	getAddress: TGetAddress;
	getScriptPubKeyHistory: TGetScriptPubKeyHistory;
	getFees: TGetFees;
	broadcastTransaction: TBroadcastTransaction;
	network: ENetworks;
	rapidGossipSyncUrl?: string;
	scorerDownloadUrl?: string;
	forceCloseOnStartup?: TForceCloseOnStartup;
	userConfig?: TUserConfig;
	skipParamCheck?: boolean;
	skipRemoteBackups?: boolean;
	lspLogEvent?: TLspLogEvent;
};

export interface IAddress {
	address: string;
	publicKey: string;
}

export type TGetAddress = () => Promise<IAddress>;

export type TGetScriptPubKeyHistory = (
	address: string,
) => Promise<TGetScriptPubKeyHistoryResponse[]>;

export type TGetScriptPubKeyHistoryResponse = { height: number; txid: string };

export type TBroadcastTransaction = (rawTx: string) => Promise<any>;

export type TLspLogPayload = { nodeId: string; body: string };
export type TLspLogEvent = (payload: TLspLogPayload) => Promise<void>;

export type TGetFees = () => Promise<TFeeUpdateReq>;

export type TVout = { hex: string; n: number; value: number };

export type TReconstructAndSpendOutputsReq = {
	outputScriptPubKey: string;
	outputValue: number;
	outpointTxId: string;
	outpointIndex: number;
	feeRate: number;
	changeDestinationScript: string;
};

export type TSpendRecoveredForceCloseOutputsReq = {
	transaction: string;
	confirmationHeight: number;
	changeDestinationScript: string;
};

export type TBackupServerDetails = {
	host: string;
	serverPubKey: string;
};

export type TBackedUpFileList = {
	list: [string];
	channel_monitors: [string];
};

export type TNodeSignReq = {
	message: string;
	messagePrefix?: string;
};

type TBackupFileState = {
	lastQueued: number;
	lastPersisted?: number;
	lastFailed?: number;
	lastErrorMessage?: string;
};

export type TBackupStateUpdate = {
	[key: string]: TBackupFileState;
};
