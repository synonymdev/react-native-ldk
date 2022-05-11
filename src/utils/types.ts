export enum ENetworks {
	regtest = 'regtest',
	testnet = 'testnet',
	mainnet = 'mainnet'
}

export enum EStreamEventType {
	data = 'data',
	error = 'error'
}

export type TNativeStreamResponse = {
	data: string | undefined;
	event: EStreamEventType;
	streamId: string;
	error: string | undefined;
};

export enum EStreamEventTypes {
	Logs = 'logs',
	StreamEvent = 'streamEvent'
}

export type TLogListener = {
	id: string;
	callback: (log: string) => void;
};

export type TFeeUpdateReq = {
	highPriority: number,
	normal: number,
	background: number
}

export enum ELdkLogLevels {
	trace = 1, //LDKLevel_Trace
	debug = 2, //LDKLevel_Debug
	info = 3, //LDKLevel_Info
	warn = 4, //LDKLevel_Warn
	error = 5, //LDKLevel_Error
}
