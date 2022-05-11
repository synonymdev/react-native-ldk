import ldk from './ldk';
import { ok, Result } from './utils/result';
import { ELdkLogLevels } from './utils/types';

//TODO startup steps
// Step 1: Initialize the FeeEstimator ✅
// Step 2: Initialize the Logger ✅
// Step 3: Initialize the BroadcasterInterface ✅
// Step 4: Initialize Persist ✅
// Step 5: Initialize the ChainMonitor ✅
// Step 6: Initialize the KeysManager
// Step 7: Read ChannelMonitor state from disk
// Step 8: Initialize the ChannelManager
// Step 9: Sync ChannelMonitors and ChannelManager to chain tip
// Step 10: Give ChannelMonitors to ChainMonitor
// Step 11: Optional: Initialize the NetGraphMsgHandler
// Step 12: Initialize the PeerManager
// Step 13: Initialize networking
// Step 14: Connect and Disconnect Blocks
// Step 15: Handle LDK Events
// Step 16: Initialize routing ProbabilisticScorer
// Step 17: Create InvoicePayer
// Step 18: Persist ChannelManager and NetworkGraph
// Step 19: Background Processing

class LightningManager {
	async start(): Promise<Result<string>> {
		// Step 1: Initialize the FeeEstimator
		const feeRes = await ldk.initFeeEstimator();
		if (feeRes.isErr()) {
			return feeRes;
		}

		// Set fee estimates
		const feeUpdateRes = await ldk.updateFees({ high: 1000, normal: 500, low: 250 });
		if (feeUpdateRes.isErr()) {
			return feeUpdateRes;
		}

		// Step 2: Initialize the Logger
		const loggerRes = await ldk.initLogger();
		if (loggerRes.isErr()) {
			return loggerRes;
		}

		//Switch on log levels we're interested in
		await ldk.setLogLevel(ELdkLogLevels.info, true);
		await ldk.setLogLevel(ELdkLogLevels.warn, true);
		await ldk.setLogLevel(ELdkLogLevels.error, true);

		// Step 3: Initialize the BroadcasterInterface
		const broadcasterRes = await ldk.initBroadcaster();
		if (broadcasterRes.isErr()) {
			return broadcasterRes;
		}

		// Step 4: Initialize Persist
		const persisterRes = await ldk.initPersister();
		if (persisterRes.isErr()) {
			return persisterRes;
		}
		//TODO add listeners to persist events

		// Step 5: Initialize the ChainMonitor
		const chainMonitorRes = await ldk.initChainMonitor();
		if (chainMonitorRes.isErr()) {
			return chainMonitorRes;
		}

		// Step 6: Initialize the KeysManager
		const keysManager = await ldk.initKeysManager(
			'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
		); //TODO get stored/generated 32-byte entropy
		if (keysManager.isErr()) {
			return keysManager;
		}

		// Step 7: Read ChannelMonitor state from disk

		return ok('Node running');
	}
}

export default new LightningManager();
