export enum ENetworks {
	regtest = 'regtest',
	testnet = 'testnet',
	mainnet = 'mainnet'
}

export enum EEventTypes {
	ldk_log = 'ldk_log',
	swift_log = 'swift_log',
	register_tx = 'register_tx',
	register_output = 'register_output',
	broadcast_transaction = 'broadcast_transaction',
	persist_manager = 'persist_manager',
	persist_new_channel = 'persist_new_channel',
	persist_graph = 'persist_graph',
	update_persisted_channel = 'update_persisted_channel',
	//>>LdkChannelManagerPersister.handle_event()
	channel_manager_funding_generation_ready = 'channel_manager_funding_generation_ready',
	channel_manager_payment_received = 'channel_manager_payment_received',
	channel_manager_payment_sent = 'channel_manager_payment_sent',
	channel_manager_open_channel_request = 'channel_manager_open_channel_request',
	channel_manager_payment_path_successful = 'channel_manager_payment_path_successful',
	channel_manager_payment_path_failed = 'channel_manager_payment_path_failed',
	channel_manager_payment_failed = 'channel_manager_payment_failed',
	channel_manager_spendable_outputs = 'channel_manager_spendable_outputs',
	channel_manager_channel_closed = 'channel_manager_channel_closed',
	channel_manager_discard_funding = 'channel_manager_discard_funding'
	//<<
}

//LDK event responses
export type TChannelBackupEvent = { id: string; data: string };
export type TRegisterTxEvent = { txid: string; script_pubkey: string };
export type TRegisterOutputEvent = { block_hash: string; index: number; script_pubkey: string };
export type TPersistManagerEvent = { channel_manager: string };
export type TPersistGraphEvent = { network_graph: string };
export type TBroadcastTransactionEvent = { tx: string };

//LDK channel manager event responses
export type TChannelManagerFundingGenerationReady = {
	temp_channel_id: string;
	output_script: string;
	user_channel_id: number;
	value_satoshis: number;
};
export type TChannelManagerPaymentReceived = {
	payment_hash: string;
	amount: number;
	payment_preimage: string;
	payment_secret: string;
	spontaneous_payment_preimage: string;
};
export type TChannelManagerPaymentSent = {
	payment_id: string;
	payment_preimage: string;
	payment_hash: string;
	fee_paid_msat: number;
};
export type TChannelManagerOpenChannelRequest = {
	temp_channel_id: string;
	counterparty_node_id: string;
	push_msat: number;
	funding_satoshis: number;
	channel_type: string;
};
export type TChannelManagerPaymentPathSuccessful = {
	payment_id: string;
	payment_hash: string;
	path: {
		pubkey: string;
		fee_msat: number;
	}[];
};
export type TChannelManagerPaymentPathFailed = {
	payment_id: string;
	payment_hash: string;
	rejected_by_dest: boolean;
	channel_id: string;
	path: {
		pubkey: string;
		fee_msat: number;
	}[];
	network_update: string;
};
export type TChannelManagerPaymentFailed = {
	payment_id: string;
	payment_hash: string;
};
export type TChannelManagerSpendableOutputs = {
	outputs: string[];
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
	balance_msat: number;
	counterparty: string;
	funding_txo: string;
	channel_type: string;
	user_channel_id: number;
	confirmations_required?: number;
	short_channel_id?: number;
	is_funding_locked: boolean;
	inbound_scid_alias?: number;
	get_inbound_payment_scid?: number;
	inbound_capacity_msat: number;
	channel_value_satoshis: number;
	outbound_capacity_msat: number;
	force_close_spend_delay?: number;
	unspendable_punishment_reserve?: number;
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

export type TAddPeerReq = {
	address: string;
	port: number;
	pubKey: string;
};

export type TInitChannelManagerReq = {
	network: ENetworks;
	serializedChannelManager: string;
	bestBlock: {
		hash: string;
		height: number;
	};
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
	error = 5 //LDKLevel_Error
}
