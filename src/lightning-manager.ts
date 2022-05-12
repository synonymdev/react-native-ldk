import ldk from './ldk';
import { ok, Result } from './utils/result';
import { EEventTypes, ELdkLogLevels, ENetworks } from './utils/types';

//TODO startup steps
// Step 0: Listen for events ✅
// Step 1: Initialize the FeeEstimator ✅
// Step 2: Initialize the Logger ✅
// Step 3: Initialize the BroadcasterInterface ✅
// Step 4: Initialize Persist ✅
// Step 5: Initialize the ChainMonitor ✅
// Step 6: Initialize the KeysManager
// Step 7: Read ChannelMonitor state from disk
// Step 8: Initialize the ChannelManager ✅
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
	constructor() {
		// Step 0: Subscribe to all events
		ldk.onEvent(EEventTypes.swift_log, console.info);
		ldk.onEvent(EEventTypes.ldk_log, console.info);
		ldk.onEvent(EEventTypes.register_tx, this.onRegisterTx.bind(this));
		ldk.onEvent(EEventTypes.register_output, this.onRegisterOutput.bind(this));
		ldk.onEvent(EEventTypes.broadcast_transaction, this.onBroadcastTransaction.bind(this));
		ldk.onEvent(EEventTypes.persist_manager, this.onPersistManager.bind(this));
		ldk.onEvent(EEventTypes.persist_new_channel, this.onPersistNewChannel.bind(this));
		ldk.onEvent(EEventTypes.channel_manager_event, this.onChannelManagerEvent.bind(this));
		ldk.onEvent(EEventTypes.update_persisted_channel, this.onUpdatePersistedChannel.bind(this));
	}

	async start(): Promise<Result<string>> {
		// Step 1: Initialize the FeeEstimator
		const feeRes = await ldk.initFeeEstimator();
		if (feeRes.isErr()) {
			return feeRes;
		}

		// Set fee estimates
		const feeUpdateRes = await ldk.updateFees({ highPriority: 1000, normal: 500, background: 250 });
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

		// Step 7: Read ChannelMonitors state from disk
		const channelMonitorsRes = await ldk.loadChannelMonitors([]);
		if (channelMonitorsRes.isErr()) {
			return channelMonitorsRes;
		}

		// Step 8: Initialize the ChannelManager
		const channelManagerRes = await ldk.initChannelManager({
			network: ENetworks.regtest,
			serializedChannelManager: '', //TODO this should also probably be restored from storage
			bestBlock: {
				hash: '23a17def8c7b3e66c4f05e66d3f2da3a6adbd112a70a3e5508120f8132b750a0',
				height: 736
			}
		});
		if (channelManagerRes.isErr()) {
			return channelManagerRes;
		}

		// Step 9: Sync ChannelMonitors and ChannelManager to chain tip

		return ok('Node running');
	}

	//TODO do proper types instead of 'any'
	private onRegisterTx(data: any) {
		console.log(`onRegisterTx: ${data}`); //TODO
	}

	private onRegisterOutput(data: any) {
		console.log(`onRegisterOutput: ${data}`); //TODO
	}

	private onBroadcastTransaction(data: any) {
		console.log(`onBroadcastTransaction: ${data}`); //TODO
	}

	private onPersistManager(data: any) {
		console.log(`onPersistManager: ${data}`); //TODO
	}

	private onPersistNewChannel(data: any) {
		console.log(`onPersistNewChannel: ${data}`); //TODO
	}

	private onChannelManagerEvent(data: any) {
		console.log(`onChannelManagerEvent: ${data}`); //TODO
	}

	private onUpdatePersistedChannel(data: any) {
		console.log(`onUpdatePersistedChannel: ${data}`); //TODO
	}
}

export default new LightningManager();
