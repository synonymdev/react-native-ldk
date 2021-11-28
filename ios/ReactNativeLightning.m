#import "ReactNativeLightning.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

//MARK: LND functions
@interface RCT_EXTERN_MODULE(ReactNativeLightning, NSObject)

RCT_EXTERN_METHOD(
                  walletExists: (NSString *)network
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  logFileContent: (NSString *)network
                  limit: (NSInteger)limit
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  start: (NSString *)configContent
                  network: (NSString *)network
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  sendCommand: (NSString *)method
                  body: (NSString *)body
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  sendStreamCommand: (NSString *)method
                  streamId: (NSString *)streamId
                  body: (NSString *)body
                  )

RCT_EXPORT_METHOD(
                  addListener : (NSString *)eventName
                  ) {
    // Keep: Required for RN built in Event Emitter Calls.
                  }

RCT_EXPORT_METHOD(
                  removeListeners : (NSInteger)count
                  ) {
    // Keep: Required for RN built in Event Emitter Calls.
                  }
@end

//MARK: Events
@interface RCT_EXTERN_MODULE(LightningEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
