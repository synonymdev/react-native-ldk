import * as bitcoin from 'bitcoinjs-lib';
import { ENetworks } from './types';

const networks: {
	[ENetworks.mainnet]: bitcoin.networks.Network;
	[ENetworks.testnet]: bitcoin.networks.Network;
	[ENetworks.regtest]: bitcoin.networks.Network;
	[ENetworks.signet]: bitcoin.networks.Network;
} = {
	...bitcoin.networks,
	signet: {
		messagePrefix: '\x18Bitcoin Signed Message:\n',
		bech32: 'ts',
		bip32: {
			public: 0x043587cf,
			private: 0x04358394,
		},
		pubKeyHash: 0x7d,
		scriptHash: 0x6e,
		wif: 0xef,
	},
};
export default networks;
