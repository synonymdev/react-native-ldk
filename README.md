# react-native-ldk

:warning: This is pre-alpha software and not suitable for production apps yet.


### Description
This library hopes to simplify the process of adding Lightning via LDK to any React-Native app.

## Getting started

```bash
yarn add @synonymdev/react-native-ldk
#or
npm i -S @synonymdev/react-native-ldk
````

### iOS installation
```bash
cd ios && pod install && cd ../
````

### Android installation
1. Add the following line to `dependencies` in `/android/app/build.gradle`
```
dependencies {
  ...
  implementation files("../../node_modules/@synonymdev/react-native-ldk/android/libs/LDK-release.aar")
}
```
2. Ensure `minSdkVersion` is set to at least `24` in `/android/build.gradle`


## Running example app
```bash

#Build dist files
git clone https://github.com/synonymdev/react-native-ldk.git
cd react-native-ldk/lib/ && yarn install && yarn build && cd ../

cd example/ && yarn install && yarn rn-setup

yarn ios
#or
yarn android
```

## Notes
 - It is important to not mix and match account names and seeds when starting LDK. Doing so can result in a corrupt save.

 ## Using zero conf channels
 Channels needs to be manually accepted but this is handled by channel-manager.ts if counterparty is in our trusted peer list.
 ```javascript
 const userConfig: TUserConfig = {
	channel_handshake_config: {
		announced_channel: false,
		minimum_depth: 1,
		max_htlc_value_in_flight_percent_of_channel: 100,
		negotiate_anchors_zero_fee_htlc_tx: true, //Required for zero conf
	},
	manually_accept_inbound_channels: true, //Required for zero conf
	accept_inbound_channels: true,
};
 ```
When starting LDK, provide a list of node public keys from which you are willing to accept zero-confirmation channels.

```javascript
const lmStart = await lm.start(
  ...
  trustedZeroConfPeers: ['03fc8877790430d7fb29e7bcf6b8bbfa3050e5e89189e27f97300e8a1e9ce589a3']
```

From LND update your conf as specified [here](https://github.com/lightningnetwork/lnd/blob/master/docs/zero_conf_channels.md) and open with these params:
 `lncli openchannel --node_key=03c6b2081d6f333fe3a9655cdb864be7b6b46c8648188a44b6a412e41b63a43272 --local_amt=200000 --push_amt=50000 --private=true --zero_conf --channel_type=anchors`

## Upgrading LDK
- Use latest LDK-release.aar from [ldk-garbagecollected](https://github.com/lightningdevkit/ldk-garbagecollected/releases) and place in `lib/android/libs`.
- Use latest LDKFramework.xcframework from [ldk-swift](https://github.com/lightningdevkit/ldk-swift/releases) and place in lib/ios.
  - To get `pod install` working you might have to open the `LDKFramework.xcframework` directory, delete non ios frameworks and remove all references to deleted frameworks inside `LDKFramework.xcframework/Info.plist`.
- Update Swift and Kotlin code if there are any breaking changes.

## How to test your code

Because it's a native module, you need to mock this package.

The package provides a default mock you may use in your \_\_mocks\_\_/@synonymdev/react-native-ldk.js or jest.setup.js.

```ts
import * as mockLDK from '@synonymdev/react-native-ldk/dist/mock';

jest.mock('@synonymdev/react-native-ldk', () => mockLDK);
```
