#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(Ldk, NSObject)

//MARK: Startup methods
RCT_EXTERN_METHOD(setAccountStoragePath:(NSString *)storagePath
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setLogFilePath:(NSString *)path
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(writeToLogFile:(NSString *)line
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initChainMonitor:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initKeysManager:(NSString *)seed
                  address:(NSString *)address
                  destinationScriptPublicKey:(NSString *)destinationScriptPublicKey
                  witnessProgram:(NSString *)witnessProgram
                  witnessProgramVersion:(NSInteger *)witnessProgramVersion                  
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initUserConfig:(NSDictionary *)userConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(downloadScorer:(NSString *)scorerSyncUrl
                  skipHoursThreshold:(NSInteger *)skipHoursThreshold
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initNetworkGraph:(NSString *)network
                  rapidGossipSyncUrl:(NSString *)rapidGossipSyncUrl
                  skipHoursThreshold:(NSInteger *)skipHoursThreshold
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initChannelManager:(NSString *)network
                  blockHash:(NSString *)blockHash
                  blockHeight:(NSInteger *)blockHeight
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(restart:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(stop:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

//MARK: Update methods
RCT_EXTERN_METHOD(updateFees:(NSInteger *)anchorChannelFee
                  nonAnchorChannelFee:(NSInteger *)nonAnchorChannelFee
                  channelCloseMinimum:(NSInteger *)channelCloseMinimum
                  minAllowedAnchorChannelRemoteFee:(NSInteger *)minAllowedAnchorChannelRemoteFee
                  onChainSweep:(NSInteger *)onChainSweep
                  minAllowedNonAnchorChannelRemoteFee:(NSInteger *)minAllowedNonAnchorChannelRemoteFee
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setLogLevel:(NSString *)level
                  active:(BOOL *)active
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(syncToTip:(NSString *)header
                  blockHash:(NSString *)blockHash
                  height:(NSInteger *)height
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(addPeer:(NSString *)address
                  port:(NSInteger *)port
                  pubKey:(NSString *)pubKey
                  timeout:(NSInteger *)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setTxConfirmed:(NSString *)header
                  txData:(NSArray *)txData
                  height:(NSInteger *)height
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setTxUnconfirmed:(NSString *)txId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(acceptChannel:(NSString *)temporaryChannelId
                  counterPartyNodeId:(NSString *)counterPartyNodeId
                  trustedPeer0Conf:(BOOL *)trustedPeer0Conf
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(closeChannel:(NSString *)channelId
                  counterPartyNodeId:(NSString *)counterPartyNodeId
                  force:(BOOL *)force
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(createChannel:(NSString *)counterPartyNodeId
                  channelValueSats:(NSInteger *)channelValueSats
                  pushSats:(NSInteger *)pushSats
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(fundChannel:(NSString *)temporaryChannelId
                  counterpartyNodeId:(NSString *)counterpartyNodeId
                  fundingTransaction:(NSString *)fundingTransaction
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(forceCloseAllChannels:(BOOL *)broadcastLatestTx
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(spendOutputs:(NSArray *)descriptorsSerialized
                  outputs:(NSArray *)outputs
                  changeDestinationScript:(NSString *)changeDestinationScript
                  feeRate:(NSInteger *)feeRate
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

//MARK: Fetch methods
RCT_EXTERN_METHOD(version:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(nodeId:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(listPeers:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(listChannels:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(listUsableChannels:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(listChannelFiles:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(listChannelMonitors:(BOOL *)ignoreOpenChannels
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(networkGraphListNodeIds:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(networkGraphListChannels:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(networkGraphChannel:(NSString *)shortChannelId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(networkGraphNodes:(NSArray *)nodeIds
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(claimableBalances:(BOOL *)ignoreOpenChannels
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

//MARK: Payments
RCT_EXTERN_METHOD(decode:(NSString *)paymentRequest
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(pay:(NSString *)paymentRequest
                  amountSats:(NSInteger *)amountSats
                  timeoutSeconds:(NSInteger *)timeoutSeconds
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(abandonPayment:(NSString *)paymentId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(createPaymentRequest:(NSInteger *)amountSats
                  description:(NSString *)description
                  expiryDelta:(NSInteger *)expiryDelta
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(processPendingHtlcForwards:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(claimFunds:(NSString *)paymentPreimage
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(failHtlcBackwards:(NSString *)paymentHash
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

//MARK: Misc methods
RCT_EXTERN_METHOD(writeToFile:(NSString *)fileName
                  path:(NSString *)path
                  content:(NSString *)content
                  format:(NSString *)format
                  remotePersist:(BOOL *)remotePersist
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(readFromFile:(NSString *)fileName
                  path:(NSString *)path
                  format:(NSString *)format
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(reconstructAndSpendOutputs:(NSString *)outputScriptPubKey
                  outputValue:(NSInteger *)outputValue
                  outpointTxId:(NSString *)outpointTxId
                  outpointIndex:(NSInteger *)outpointIndex
                  feeRate:(NSInteger *)feeRate
                  changeDestinationScript:(NSString *)changeDestinationScript
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(spendRecoveredForceCloseOutputs:(NSString *)transaction
                  confirmationHeight:(NSInteger *)confirmationHeight
                  changeDestinationScript:(NSString *)changeDestinationScript
                  useInner:(BOOL *)useInner
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(nodeSign:(NSString *)message
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(nodeStateDump:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

//MARK: Backup methods
RCT_EXTERN_METHOD(backupSetup:(NSString *)seed
                  network:(NSString *)network
                  server:(NSString *)server
                  serverPubKey:(NSString *)serverPubKey
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(restoreFromRemoteBackup:(BOOL *)overwrite
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(backupSelfCheck:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(backupListFiles:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(backupFile:(NSString *)fileName
                  content:(NSString *)content
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(fetchBackupFile:(NSString *)fileName
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
@end

//MARK: Events
@interface RCT_EXTERN_MODULE(LdkEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
