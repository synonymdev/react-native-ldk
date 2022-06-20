import { TAvailableNetworks } from '../../src';

export const selectedNetwork: TAvailableNetworks = 'bitcoinRegtest';

//Lightning Peer Info
export const peers = {
	lnd: {
		pubKey:
			'0239af55c86cf84167bc216ffa48687b304a4f0601d6496febf8bbb286a65c814c',
		address: '127.0.0.1',
		port: 9735,
	},
	clightning: {
		pubKey:
			'03e8fa0ceb4aa0cc696278189269e01bac22b0549ad62fac726f26cc6c65008ef4',
		address: '127.0.0.1',
		port: 9836,
	},
	eclair: {
		pubKey:
			'03e0588a30b5db6eb91df62a243e179b11f63fe27c44856e510055a9156a845bd2',
		address: '127.0.0.1',
		port: 9937,
	},
};

//Electrum Server Info
export const customPeers = [
	{
		host: '127.0.0.1',
		ssl: 50002,
		tcp: 50001,
		protocol: 'ssl',
	},
];
