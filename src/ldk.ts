import { NativeModules, Platform } from 'react-native';
import { err, ok, Result } from './utils/result';
import { TLogListener } from './utils/types';

const LINKING_ERROR =
	`The package 'react-native-ldk' doesn't seem to be linked. Make sure: \n\n` +
	Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
	'- You rebuilt the app after installing the package\n' +
	'- You are not using Expo managed workflow\n';

const NativeLDK = NativeModules.Ldk
	? NativeModules.Ldk
	: new Proxy(
			{},
			{
				get() {
					throw new Error(LINKING_ERROR);
				}
			}
	  );

class LDK {
	/**
	 * Array of callbacks to be fired off when a new log entry arrives.
	 * Developers are responsible for adding and removing listeners.
	 *
	 * @type {TLogListener[]}
	 */
	private readonly logListeners: TLogListener[];

	constructor() {
		this.logListeners = [];
	}

	/**
	 * Starts the startChainMonitor service
	 * @return {Promise<Err<unknown> | Ok<string>>}
	 */
	async startChainMonitor(): Promise<Result<string>> {
		const res = await NativeLDK.startChainMonitor();

		return ok(res);
	}

	async version(): Promise<
		Result<{ c_bindings_get_compiled_version: string; ldk_get_compiled_version: string }>
	> {
		try {
			const res = await NativeLDK.version();
			console.log(res);
			return ok(JSON.parse(res));
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Callback passed though will get triggered for each LND log item
	 * @param callback
	 * @returns {string}
	 */
	addLogListener(callback: (log: string) => void): string {
		const id = new Date().valueOf().toString() + Math.random().toString();
		this.logListeners.push({ id, callback });
		return id; // Developer needs to use this ID to unsubscribe later
	}

	/**
	 * Removes a log listener once dev no longer wants to receive updates.
	 * e.g. When a component has been unmounted
	 * @param id
	 */
	removeLogListener(id: string): void {
		let removeIndex = -1;
		this.logListeners.forEach((listener, index) => {
			if (listener.id === id) {
				removeIndex = index;
			}
		});

		if (removeIndex > -1) {
			this.logListeners.splice(removeIndex, 1);
		}
	}

	/**
	 * Triggers every listener that has subscribed
	 * @param log
	 */
	private processLogListeners(log: string): void {
		if (!log) {
			return;
		}

		if (__DEV__) {
			console.log(log);
		}

		this.logListeners.forEach((listener) => listener.callback(log));
	}

	/**
	 * Gets LND log file content
	 * @param limit
	 * @returns {Promise<Err<unknown> | Ok<string[]>>}
	 */
	async getLogFileContent(limit: number = 100): Promise<Result<string[]>> {
		// try {
		// 	const content: string[] = await this.lnd.logFileContent(network, limit);
		// 	return ok(content);
		// } catch (e) {
		// 	return err(e);
		// }

		return ok([]);
	}
}

export default new LDK();
