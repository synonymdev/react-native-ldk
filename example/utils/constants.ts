import { TAvailableNetworks } from '@synonymdev/react-native-ldk';

export const selectedNetwork: TAvailableNetworks = 'bitcoinRegtest';

//Lightning Peer Info
export const peers = {
	lnd: {
		pubKey:
			'02709a23bb26d78cc2425aa8651a8ae18d05d852079bdae4151b9759d15ab98c12',
		address: '192.168.0.100',
		port: 9736,
	},
	clightning: {
		pubKey:
			'03ef67f43678c4bc7a1ef6c9ec5a57168a019657aab52c04798cecbf6561510d23',
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

//Electrum Server Info (Synonym Regtest Set By Default)
export const customPeers = {
	bitcoin: [],
	bitcoinTestnet: [],
	bitcoinRegtest: [
		{
			host: '192.168.0.100',
			ssl: 50001,
			tcp: 50001,
			protocol: 'tcp',
		},
	],
	bitcoinSignet: [],
};
