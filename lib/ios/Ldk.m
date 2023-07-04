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
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initUserConfig:(NSDictionary *)userConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initNetworkGraph:(NSString *)network
                  rapidGossipSyncUrl:(NSString *)rapidGossipSyncUrl
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
RCT_EXTERN_METHOD(updateFees:(NSInteger *)high
                  normal:(NSInteger *)normal
                  low:(NSInteger *)low
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
RCT_EXTERN_METHOD(closeChannel:(NSString *)channelId
                  counterPartyNodeId:(NSString *)counterPartyNodeId
                  force:(BOOL *)force
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

//MARK: Misc methods
RCT_EXTERN_METHOD(writeToFile:(NSString *)fileName
                  path:(NSString *)path
                  content:(NSString *)content
                  format:(NSString *)format
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
@end

//MARK: Events
@interface RCT_EXTERN_MODULE(LdkEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
