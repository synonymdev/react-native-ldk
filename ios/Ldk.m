#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(Ldk, NSObject)

//MARK: Startup methods
RCT_EXTERN_METHOD(inititlize:(NSString *)method
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initChainMonitor:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initKeysManager:(NSString *)seed
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(loadChannelMonitors:(NSArray *)channelMonitors
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initConfig:(BOOL *)acceptInboundChannels
                  manuallyAcceptInboundChannels:(BOOL *)manuallyAcceptInboundChannels
                  announcedChannels:(BOOL *)announcedChannels
                  minChannelHandshakeDepth:(NSInteger *)minChannelHandshakeDepth
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)    
RCT_EXTERN_METHOD(initChannelManager:(NSString *)network
                  serializedChannelManager:(NSString *)serializedChannelManager
                  blockHash:(NSString *)blockHash
                  blockHeight:(NSInteger *)blockHeight
                  resolve:(RCTPromiseResolveBlock)resolve
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

//MARK: Fetch methods
RCT_EXTERN_METHOD(version:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(nodeId:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

@end

//MARK: Events
@interface RCT_EXTERN_MODULE(LdkEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
