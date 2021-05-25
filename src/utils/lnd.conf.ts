/* Allows the conf to be kept in one place and passed to the native modules when lnd is started */

import { ENetworks, TLndConf, TLndConfSection } from './types';

const defaultRegtestConf = {
	'Application Options': {
		debuglevel: 'info',
		'no-macaroons': false,
		nolisten: true
	},
	Routing: {
		'routing.assumechanvalid': true
	},
	Bitcoin: {
		'bitcoin.active': true,
		'bitcoin.regtest': true,
		'bitcoin.node': 'bitcoind'
	},
	watchtower: {
		'watchtower.active': false
	},
	Bitcoind: {
		'bitcoind.rpchost': '127.0.0.1',
		'bitcoind.rpcuser': 'polaruser',
		'bitcoind.rpcpass': 'polarpass',
		'bitcoind.zmqpubrawblock': 'tcp://127.0.0.1:28334',
		'bitcoind.zmqpubrawtx': 'tcp://127.0.0.1:29335'
	}
};

const defaultTestnetBitcoindConf = {
	'Application Options': {
		debuglevel: 'info',
		'no-macaroons': false,
		maxbackoff: '2s',
		nolisten: true
	},
	Routing: {
		'routing.assumechanvalid': true
	},
	Bitcoin: {
		'bitcoin.active': true,
		'bitcoin.testnet': true,
		'bitcoin.node': 'neutrino'
	},
	Neutrino: {
		'neutrino.connect': '35.240.72.95:18333',
		'neutrino.feeurl': 'https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json'
	}
};

class LndConf {
	readonly network: ENetworks;
	readonly customFields: TLndConf;

	constructor(network: ENetworks, customFields: TLndConf = {}) {
		this.network = network;
		this.customFields = customFields;
	}

	private mergeConf(conf1: TLndConf, conf2: TLndConf): TLndConf {
		const mergedConf: TLndConf = {};
		Object.keys(conf1).forEach((heading) => {
			const section: TLndConfSection = conf1[heading];
			let customSectionFields: TLndConfSection = {};

			if (conf2[heading]) {
				customSectionFields = conf2[heading];
			}

			mergedConf[heading] = { ...section, ...customSectionFields };
		});

		// Merge headings that didn't exist in conf1 but exist in conf2
		Object.keys(conf2).forEach((heading) => {
			if (!mergedConf[heading]) {
				mergedConf[heading] = conf2[heading];
			}
		});

		return mergedConf;
	}

	private getDefaultConf(): TLndConf {
		let defaultConfObj: TLndConf;

		switch (this.network) {
			case ENetworks.regtest: {
				defaultConfObj = defaultRegtestConf;
				break;
			}
			case ENetworks.testnet: {
				defaultConfObj = defaultTestnetBitcoindConf;
				break;
			}
			case ENetworks.mainnet: {
				throw new Error('Not implemented yet: Networks.mainnet case');
			}
		}

		return defaultConfObj;
	}

	build(): string {
		const defaultConfObj = this.getDefaultConf();
		const mergedConf = this.mergeConf(defaultConfObj, this.customFields);

		// Build lnd.conf string
		let confContent = '';
		Object.keys(mergedConf).forEach((heading) => {
			confContent += `[${heading}]\n`;

			const section: TLndConfSection = mergedConf[heading];
			Object.keys(section).forEach((key: string) => {
				const value = section[key];

				// If it's an array then add multi line items
				if (Array.isArray(value)) {
					value.forEach((valueItem) => {
						confContent += `${key}=${valueItem}\n`;
					});
				} else {
					confContent += `${key}=${String(value)}\n`;
				}
			});

			confContent += '\n';
		});

		return confContent;
	}
}

export default LndConf;
