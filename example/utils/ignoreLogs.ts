import { LogBox } from 'react-native';

const ENABLE_LOGBOX = true;
const ENABLE_LDK_LOGS = true;
const ENABLE_TX_LOGS = true;

if (__DEV__) {
	const ignoredLogs: string[] = [];
	const ignoredInfo: string[] = [];
	const ignoredWarnings: string[] = [];
	const ignoredErrors: string[] = [];

	if (!ENABLE_LOGBOX) {
		LogBox.ignoreAllLogs();
	}

	if (!ENABLE_LDK_LOGS) {
		ignoredLogs.push('LDK:', 'react-native-ldk:', 'DEBUG (JS)', 'ERROR (JS)');
	}

	if (!ENABLE_TX_LOGS) {
		ignoredLogs.push('INFO (JS)', 'broadcastTransaction');
	}

	const withoutIgnored = (
		logger: (...data: any[]) => void,
		ignoreList: string[],
	): any => {
		return (...args): void => {
			let output: string;
			try {
				output = args.join(' ');
			} catch (err) {
				// if we can't check if the log should be ignored, just log it
				logger(...args);
				return;
			}

			if (!ignoreList.some((log) => output.includes(log))) {
				logger(...args);
			}
		};
	};

	console.log = withoutIgnored(console.log, ignoredLogs);
	console.info = withoutIgnored(console.info, ignoredInfo);
	console.warn = withoutIgnored(console.warn, ignoredWarnings);
	console.error = withoutIgnored(console.error, ignoredErrors);
}
