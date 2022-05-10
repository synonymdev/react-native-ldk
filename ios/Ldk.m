#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Ldk, NSObject)

RCT_EXTERN_METHOD(version:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startChainMonitor:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
