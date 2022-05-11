#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Ldk, NSObject)

RCT_EXTERN_METHOD(version:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startChainMonitor:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

//Startup methods
RCT_EXTERN_METHOD(initFeeEstimator:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

//Update state methods
RCT_EXTERN_METHOD(updateFees:(NSInteger *)high
                  normal:(NSInteger *)normal
                  low:(NSInteger *)low
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

@end
