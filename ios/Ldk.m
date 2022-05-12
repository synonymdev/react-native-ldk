#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(Ldk, NSObject)

RCT_EXTERN_METHOD(version:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

//Startup methods
RCT_EXTERN_METHOD(inititlize:(NSString *)method
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initChainMonitor:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initKeysManager:(NSString *)seed
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(loadChannelMonitors:(NSArray *)channelMonitors
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initChannelManager:(NSString *)network
                  serializedChannelManager:(NSString *)serializedChannelManager
                  blockHash:(NSString *)blockHash
                  blockHeight:(NSInteger *)blockHeight
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)


//func (_ channelMonitors: NSArray, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {



//Update state methods
RCT_EXTERN_METHOD(updateFees:(NSInteger *)high
                  normal:(NSInteger *)normal
                  low:(NSInteger *)low
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setLogLevel:(NSInteger *)high
                  active:(BOOL *)active
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

@end

//MARK: Events
@interface RCT_EXTERN_MODULE(LdkEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
