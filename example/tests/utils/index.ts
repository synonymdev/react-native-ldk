import BitcoinJsonRpc from 'bitcoin-json-rpc';
import ElectrumClient from 'electrum-client';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import lm, { ldk } from '@synonymdev/react-native-ldk';

import LND from './lnd-rpc';
import CL from './clightning-rpc';
import Eclair from './eclair-rpc';

export { default as TestProfile } from './test-profile';
export { default as LND } from './lnd-rpc';
export { default as CL } from './clightning-rpc';
export { default as Eclair } from './eclair-rpc';

export const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

type TInitOpts = {
	bitcoin: string;
	electrum: { host: string; port: number };
	lnd?: { host: string; port: number; macaroon: string };
	clightning?: { host: string; port: number; macaroon: string };
	eclair?: { host: string; port: number; password: string };
};

type TWaitOpts = {
	timeout?: number;
	lnd?: boolean;
	cl?: boolean;
	ec?: boolean;
};

// tracks blocks count in electrum and when it maches bitcoin core resolves the promise
export const initWaitForElectrumToSync = async (
	initOpts: TInitOpts,
): Promise<any> => {
	let electrumHeight: number = 0;

	const bitcoin = new BitcoinJsonRpc(initOpts.bitcoin);
	const electrum = new ElectrumClient(
		global.net,
		global.tls,
		initOpts.electrum.port,
		initOpts.electrum.host,
		'tcp',
	);
	const lnd = initOpts.lnd && new LND(initOpts.lnd);
	const cl = initOpts.clightning && new CL(initOpts.clightning);
	const ec = initOpts.eclair && new Eclair(initOpts.eclair);

	electrum.subscribe.on('blockchain.headers.subscribe', (params) => {
		// get max height
		const h = params
			.map(({ height: hh }) => hh)
			.sort()
			.reverse()[0];
		electrumHeight = h;
	});

	await electrum.initElectrum({ client: 'wait-for-block', version: '1.4' });

	const tip = await electrum.blockchainHeaders_subscribe();
	electrumHeight = tip.height;

	const waitForElectrum = function (
		opts: TWaitOpts | undefined,
	): Promise<void> {
		const timeout = opts?.timeout ?? 30000;
		const waitLnd = opts?.lnd ?? false;
		const waitCl = opts?.cl ?? false;
		const waitEc = opts?.ec ?? false;

		return new Promise(async (resolve, reject) => {
			let running = true;

			if (waitLnd && !lnd) {
				throw new Error('LND not initialized');
			}
			if (waitCl && !cl) {
				throw new Error('CL not initialized');
			}
			if (waitEc && !ec) {
				throw new Error('Eclair not initialized');
			}

			const timer = setTimeout(async () => {
				running = false;
				// before timeout check block count once again
				const b = await bitcoin.getBlockCount();
				const { height: e } = await electrum.blockchainHeaders_subscribe();
				if (b !== e) {
					reject(new Error('Timeout error: Electrum out of sync'));
				}
				if (waitLnd && lnd) {
					const info = await lnd.getInfo();
					if (!info.synced_to_chain || info.block_height !== b) {
						reject(new Error('Timeout error: LND out of sync'));
					}
				}
				if (waitCl && cl) {
					const info = await cl.getInfo();
					if (info.blockheight !== b) {
						reject(new Error('Timeout error: CL out of sync'));
					}
				}
				if (waitEc && ec) {
					const info = await ec.getInfo();
					if (info.blockHeight !== b) {
						reject(new Error('Timeout error: Eclair out of sync'));
					}
				}
				resolve();
			}, timeout);

			while (running) {
				await sleep(100);
				let sync = true;
				const b = await bitcoin.getBlockCount();
				sync = sync && b === electrumHeight;
				if (sync && waitLnd && lnd) {
					const info = await lnd.getInfo();
					sync = info.synced_to_chain && info.block_height === b;
				}
				if (sync && waitCl && cl) {
					const info = await cl.getInfo();
					sync = info.blockheight === b;
				}
				if (sync && waitEc && ec) {
					const info = await ec.getInfo();
					sync = info.blockHeight === b;
				}

				if (sync) {
					clearTimeout(timer);
					resolve();
					return;
				}
			}
		});
	};

	waitForElectrum.close = (): void => {
		if (Platform.OS === 'android') {
			// FIXME: for some reason electrum?.close() on android causes a crash
			return;
		}
		electrum?.close();
	};

	return waitForElectrum;
};

/**
 * Wipes LDK data from storage
 * @returns {Promise<void>}
 */
export const wipeLdkStorage = async (): Promise<void> => {
	await ldk.stop();

	if (lm.account.name === '') {
		return;
	}

	const path = `${RNFS.DocumentDirectoryPath}/ldk/${lm.account.name}`;

	const deleteAllFiles = async (dirpath: string): Promise<void> => {
		const items = await RNFS.readDir(dirpath);
		for (const item of items) {
			if (item.isFile()) {
				await RNFS.unlink(item.path);
			} else {
				await deleteAllFiles(item.path);
			}
		}
	};

	// delete all files in the directory
	if (Platform.OS === 'android') {
		// NOTE: this is a workaround for RNFS.unlink(folder) freezing the app
		await deleteAllFiles(path);
		// await RNFS.unlink(path)
	} else {
		await RNFS.unlink(path);
	}
};
