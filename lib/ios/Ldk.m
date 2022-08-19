#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(Ldk, NSObject)

//MARK: Startup methods
RCT_EXTERN_METHOD(initChainMonitor:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initKeysManager:(NSString *)seed
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initConfig:(BOOL *)acceptInboundChannels
                  manuallyAcceptInboundChannels:(BOOL *)manuallyAcceptInboundChannels
                  announcedChannels:(BOOL *)announcedChannels
                  minChannelHandshakeDepth:(NSInteger *)minChannelHandshakeDepth
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initNetworkGraph:(NSString *)genesisHash
                  serializedBackup:(NSString *)serializedBackup
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initChannelManager:(NSString *)network
                  channelManagerSerialized:(NSString *)channelManagerSerialized
                  channelMonitorsSerialized:(NSArray *)channelMonitorsSerialized
                  blockHash:(NSString *)blockHash
                  blockHeight:(NSInteger *)blockHeight
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(reset:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

//MARK: Update methods
RCT_EXTERN_METHOD(updateFees:(NSInteger *)high
                  normal:(NSInteger *)normal
                  low:(NSInteger *)low
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setLogLevel:(NSInteger *)high
                  active:(BOOL *)active
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setLogFilePath:(NSString *)path
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(syncToTip:(NSString *)header
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

//MARK: Payments
RCT_EXTERN_METHOD(decode:(NSString *)paymentRequest
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(pay:(NSString *)paymentRequest
                  amountSats:(NSInteger *)amountSats
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
@end

//MARK: Events
@interface RCT_EXTERN_MODULE(LdkEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
