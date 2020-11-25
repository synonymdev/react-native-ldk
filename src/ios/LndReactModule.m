#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

//MARK: LND functions
@interface RCT_EXTERN_MODULE(LndReactModule, NSObject)

RCT_EXTERN_METHOD(
                  walletExists: (NSString *)network
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  start: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  genSeed: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  createWallet: (NSString *)password
                  seed: (NSArray *)seed
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  unlockWallet: (NSString *)password
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  sendCommand: (NSString *)method
                  body: (NSString *)seed
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
@end

//MARK: Events
@interface RCT_EXTERN_MODULE(LightningEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
