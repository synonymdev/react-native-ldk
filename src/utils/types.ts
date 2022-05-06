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
