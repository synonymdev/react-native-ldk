import { TAvailableNetworks } from '@synonymdev/react-native-ldk';

export const selectedNetwork: TAvailableNetworks = 'bitcoinRegtest';

//Lightning Peer Info
export const peers = {
	alice: {
		pubKey:
			'0396493deab734833c670ea2a4c63edd5aa3f4a5e229372a148b18b42a287613e5',
		address: '192.168.0.100',
		port: 9735,
	},
	// bob: {
	// 	pubKey:
	// 		'0274a65af6ac433f756d511d07f2a703749161f6ff6a598b67bd59d581ae16ec2e',
	// 	address: '192.168.0.100',
	// 	port: 9736,
	// },
	// bt: {
	// 	pubKey:
	// 		'0296b2db342fcf87ea94d981757fdf4d3e545bd5cef4919f58b5d38dfdd73bf5c9',
	// 	address: '34.79.58.84',
	// 	port: 9735,
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
			host: '192.168.0.100',
			ssl: 18484,
			tcp: 50001,
			protocol: 'tcp',
		},
	],
};
