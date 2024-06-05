import {
	TAvailableNetworks,
	TBackupServerDetails,
} from '@synonymdev/react-native-ldk';

export const selectedNetwork: TAvailableNetworks = 'bitcoinRegtest';

//Lightning Peer Info
export const peers = {
	lnd: {
		pubKey:
			'0341e41583ad691951634e24dd20252d13feace9286a85d47f220dde74e7e09a15',
		address: '192.168.0.106',
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
			host: '192.168.0.106',
			ssl: 18484,
			tcp: 50001,
			protocol: 'tcp',
		},
		// {
		// 	host: '192.168.0.100',
		// 	ssl: 50001,
		// 	tcp: 50001,
		// 	protocol: 'tcp',
		// },
		// {
		// 	host: 'localhost',
		// 	ssl: 60001,
		// 	tcp: 60001,
		// 	protocol: 'tcp',
		// },
	],
	bitcoinSignet: [],
};

//Once local server is setup, add server details below to enable backups
export const backupServerDetails: TBackupServerDetails | undefined = undefined;
// 	{
// 	host: 'https://jaybird-logical-sadly.ngrok-free.app',
// 	serverPubKey:
// 		'0343a6c1b7700840ac7b76372617a6e9a05cf4c9716efdc847def65360b238f243',
// };
