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
// Step 6: Initialize the KeysManager ✅
// Step 7: Read ChannelMonitor state from disk ✅
// Step 8: Initialize the ChannelManager ✅
// Step 9: Sync ChannelMonitors and ChannelManager to chain tip
// Step 10: Give ChannelMonitors to ChainMonitor
// Step 11: Optional: Initialize the NetGraphMsgHandler [Not required for a non routing node]
// Step 12: Initialize the PeerManager ✅
// Step 13: Initialize networking ✅
// Step 14: Connect and Disconnect Blocks
// Step 15: Handle LDK Events
// Step 16: Initialize routing ProbabilisticScorer
// Step 17: Create InvoicePayer
// Step 18: Persist ChannelManager and NetworkGraph
// Step 19: Background Processing

class LightningManager {
	constructor() {
		// Step 0: Subscribe to all events
		// ldk.onEvent(EEventTypes.swift_log, (line) => console.log(`SWIFT: ${line}`));
		ldk.onEvent(EEventTypes.ldk_log, (line) => console.log(`LDK: ${line}`));
		ldk.onEvent(EEventTypes.register_tx, this.onRegisterTx.bind(this));
		ldk.onEvent(EEventTypes.register_output, this.onRegisterOutput.bind(this));
		ldk.onEvent(EEventTypes.broadcast_transaction, this.onBroadcastTransaction.bind(this));
		ldk.onEvent(EEventTypes.persist_manager, this.onPersistManager.bind(this));
		ldk.onEvent(EEventTypes.persist_new_channel, this.onPersistNewChannel.bind(this));
		ldk.onEvent(EEventTypes.channel_manager_event, this.onChannelManagerEvent.bind(this));
		ldk.onEvent(EEventTypes.update_persisted_channel, this.onUpdatePersistedChannel.bind(this));
	}

	/**
	 * Spins up and syncs all processes
	 * @returns {Promise<Err<string> | Ok<string>>}
	 */
	async start(): Promise<Result<string>> {
		const isExistingNode = false;

		// Step 1: Initialize the FeeEstimator
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.FeeEstimator.html

		// Set fee estimates
		const feeUpdateRes = await ldk.updateFees({ highPriority: 1000, normal: 500, background: 250 });
		if (feeUpdateRes.isErr()) {
			return feeUpdateRes;
		}

		// Step 2: Initialize the Logger
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/util/logger/index.html

		//Switch on log levels we're interested in
		await ldk.setLogLevel(ELdkLogLevels.info, true);
		await ldk.setLogLevel(ELdkLogLevels.warn, true);
		await ldk.setLogLevel(ELdkLogLevels.error, true);

		//TODO might not always need these ones
		await ldk.setLogLevel(ELdkLogLevels.trace, true);
		await ldk.setLogLevel(ELdkLogLevels.debug, true);

		// Step 3: Initialize the BroadcasterInterface
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/chain/chaininterface/trait.BroadcasterInterface.html

		// Step 4: Initialize Persist
		// Lazy loaded in native code
		// https://docs.rs/lightning/latest/lightning/chain/chainmonitor/trait.Persist.html

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

		// Step 11: Optional: Initialize the NetGraphMsgHandler
		// [Needs to happen first before ChannelManagerConstructor inside initChannelManager() can be called 🤷️]
		const networkGraph = await ldk.initNetworkGraph(
			'0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206' //bitcoin-cli getblockhash 0
			//TODO load a cached version once persisted
		);
		if (networkGraph.isErr()) {
			return networkGraph;
		}

		// Step 8: Initialize the UserConfig ChannelManager
		const confRes = await ldk.initConfig({
			acceptInboundChannels: true,
			manuallyAcceptInboundChannels: false, //TODO might need to be true if we want to set closing address when blocktank opens with us
			announcedChannels: false,
			minChannelHandshakeDepth: 1 //TODO Verify correct min
		});
		if (confRes.isErr()) {
			return confRes;
		}

		const channelManagerRes = await ldk.initChannelManager({
			network: ENetworks.regtest,
			serializedChannelManager: '', //TODO [UNTESTED]
			bestBlock: {
				//bitcoin-cli getblockchaininfo
				hash: '2da7ce158365b304c0cf11604bc8f7a15e2c9cf56758651a7fdc76f40739a290',
				height: 9
			}
		});
		if (channelManagerRes.isErr()) {
			return channelManagerRes;
		}

		// Step 9: Sync ChannelMonitors and ChannelManager to chain tip
		if (!isExistingNode) {
			// https://github.com/lightningdevkit/ldk-sample/blob/c0a722430b8fbcb30310d64487a32aae839da3e8/src/main.rs#L479
			// Sample app only syncs when restarting an existing node
		}

		// Step 10: Give ChannelMonitors to ChainMonitor
		// TODO Pass these pointers through when we have test channels to restore

		// Step 12: Initialize the PeerManager

		// Step 13: Initialize networking

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
		console.log(`onPersistManager: ${JSON.stringify(data)}`); //TODO
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
