import { TAvailableNetworks } from '@synonymdev/react-native-ldk';

export const selectedNetwork: TAvailableNetworks = 'bitcoinRegtest';

//Lightning Peer Info
export const peers = {
	lnd: {
		pubKey:
			'020c53f9914ef8c2347af6e04cfe111bb8df0e900f8d4ca46abf8770c35ed8d1a7',
		address: '192.168.0.127',
		port: 9735,
	},
	// clightning: {
	// 	pubKey:
	// 		'03e8fa0ceb4aa0cc696278189269e01bac22b0549ad62fac726f26cc6c65008ef4',
	// 	address: '127.0.0.1',
	// 	port: 9836,
	// },
	// eclair: {
	// 	pubKey:
	// 		'03e0588a30b5db6eb91df62a243e179b11f63fe27c44856e510055a9156a845bd2',
	// 	address: '127.0.0.1',
	// 	port: 9937,
	// },
};

//Electrum Server Info (Synonym Regtest Set By Default)
export const customPeers = {
	bitcoin: [
		{
			host: '35.187.18.233',
			ssl: 8912,
			tcp: 8911,
			protocol: 'tcp',
		},
	],
	bitcoinTestnet: [],
	bitcoinRegtest: [
		{
			host: '192.168.0.127',
			ssl: 18484,
			tcp: 50001,
			protocol: 'tcp',
		},
	],
};
