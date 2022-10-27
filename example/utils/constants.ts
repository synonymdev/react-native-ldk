import { TAvailableNetworks } from '@synonymdev/react-native-ldk';

export const selectedNetwork: TAvailableNetworks = 'bitcoinRegtest';

//Lightning Peer Info
export const peers = {
	// lnd: {
	// 	pubKey:
	// 		'032092b9f32cfce4adf95ee82e28a152adb50b3b43327ab9b2cd49077867c3c8a3',
	// 	address: '127.0.0.1',
	// 	port: 9735,
	// },
	bt: {
		pubKey:
			'0296b2db342fcf87ea94d981757fdf4d3e545bd5cef4919f58b5d38dfdd73bf5c9',
		address: '34.79.58.84',
		port: 9735,
	},
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
			host: '35.233.47.252',
			ssl: 18484,
			tcp: 18483,
			protocol: 'tcp',
		},
	],
};
