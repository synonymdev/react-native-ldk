import RNFS, { DownloadProgressCallbackResult } from 'react-native-fs';
import { unzip, subscribe } from 'react-native-zip-archive';
import { err, ok, Result } from '../utils/result';
import { ENetworks, ICachedNeutrinoDBDownloadState } from '../utils/types';

class NeutrinoCache {
	private state: ICachedNeutrinoDBDownloadState = {
		downloadProgress: 0,
		unzipProgress: 0,
		task: undefined
	};

	private stateListener: ((state: ICachedNeutrinoDBDownloadState) => void) | undefined = undefined;

	addStateListener = (callback: (state: ICachedNeutrinoDBDownloadState) => void): void => {
		this.stateListener = callback;
	};

	readonly updateCachedNeutrinoDownloadState = (state: ICachedNeutrinoDBDownloadState): void => {
		this.state = state;
		if (this.stateListener) {
			this.stateListener(state);
		}
	};

	downloadCache = async (network: ENetworks): Promise<Result<boolean>> => {
		const url = 'https://github.com/Jasonvdb/lnd-ios/releases/download/1/'; // TODO once this repo is public cache will be moved
		const zipFile = `lnd-neutrino-${network}.zip`;
		const newFile = 'lnd-neutrino-cache.zip';
		const saveZipTo = `${RNFS.DocumentDirectoryPath}/${newFile}`;
		const unzipTo = RNFS.DocumentDirectoryPath;
		const existingLndDir = `${RNFS.DocumentDirectoryPath}/lnd/data`;

		const currentTask = this.state.task;
		if (currentTask === 'downloading' || currentTask === 'unzipping') {
			return ok(true);
		}

		let progressPercent = 0;

		const begin = (): void => {
			this.updateCachedNeutrinoDownloadState({
				task: 'downloading',
				downloadProgress: 0
			});
		};

		const progress = (res: DownloadProgressCallbackResult): void => {
			const percentage = Math.floor((res.bytesWritten / res.contentLength) * 100);

			// No need to update after each byte
			if (percentage !== progressPercent) {
				this.updateCachedNeutrinoDownloadState({
					task: 'downloading',
					downloadProgress: percentage
				});

				progressPercent = percentage;
			}
		};

		try {
			// If directory exists don't mess with it to be safe
			const exists = await RNFS.exists(existingLndDir);
			if (exists) {
				this.updateCachedNeutrinoDownloadState({ task: 'complete' });
				return ok(true);
			}

			const res = await RNFS.downloadFile({
				fromUrl: `${url}/${zipFile}`,
				toFile: `${saveZipTo}`, // Local filesystem path to save the file to
				begin,
				progress
			}).promise;

			if (res.statusCode !== 200) {
				this.updateCachedNeutrinoDownloadState({ task: 'failed' });
				return err(`Failed with code ${res.statusCode}`);
			}

			// Sanity check to confirm LND dir wasn't created while download happened
			const existsCheck = await RNFS.exists(existingLndDir);
			if (existsCheck) {
				await NeutrinoCache.cleanupCache(saveZipTo);
				this.updateCachedNeutrinoDownloadState({ task: 'complete' });
				return ok(true);
			}

			// Unzip
			this.updateCachedNeutrinoDownloadState({ task: 'unzipping' });
			const unzipRes = await NeutrinoCache.unzipCache(saveZipTo, unzipTo, (unzipProgress) =>
				this.updateCachedNeutrinoDownloadState({ unzipProgress })
			);

			if (unzipRes.isErr()) {
				this.updateCachedNeutrinoDownloadState({ task: 'failed' });

				return err(unzipRes.error);
			}

			await NeutrinoCache.cleanupCache(saveZipTo);

			this.updateCachedNeutrinoDownloadState({ task: 'complete' });

			return ok(true);
		} catch (e) {
			this.updateCachedNeutrinoDownloadState({ task: 'failed' });

			return err(e);
		}
	};

	private static readonly cleanupCache = async (filePath: string): Promise<Result<boolean>> => {
		try {
			await RNFS.unlink(filePath);
			return ok(true);
		} catch (e) {
			return err(e);
		}
	};

	private static readonly unzipCache = async (
		sourcePath: string,
		targetPath: string,
		onProgress: (arg0: number) => void
	): Promise<Result<string>> => {
		const zipProgress = subscribe(({ progress }) => {
			onProgress(Math.floor(progress * 100));
		});

		try {
			const path = await unzip(sourcePath, targetPath);
			zipProgress.remove();

			return ok(path);
		} catch (e) {
			zipProgress.remove();
			return err(e);
		}
	};
}

export default new NeutrinoCache();
