# react-native-ldk

:warning: This is pre-alpha software and not suitable for production apps yet.


### Description
This library hopes to simplify the process of adding Lightning via LDK to any React-Native app.

## Getting started

```bash
yarn add @synonymdev/react-native-ldk
#or
npm i -S @synonymdev/react-native-ldk
```

### iOS installation
```bash
cd ios && pod install && cd ../
```

### Android installation
1. Add the following line to `dependencies` in `/android/app/build.gradle`
    ```groovy
    dependencies {
      //...
      implementation files("../../node_modules/@synonymdev/react-native-ldk/android/libs/LDK-release.aar") // <- this
    }
    ```
2. Ensure `minSdkVersion` is set to at least `24` in `/android/build.gradle`

## Development
### Android
- Open `lib/android` in Android Studio
- To enable documentation for the LDK code, follow this guide: [How to attach JavaDoc to the library in Android Studio](https://medium.com/@mydogtom/tip-how-to-attach-javadoc-to-the-library-in-android-studio-5ff43c4303b3), ie.:
  1. Switch to `Project` view in the Project browser tool window
  2. Expand `External Libraries`
  3. Right click on `Gradle: ./libs/LDK-release.aar` then `Library Properties…`
  4. Tap the ➕ button and select the `./lib/android/libs/ldk-java-javadoc.jar` file
  5. In the popup that appears select `JavaDocs` and tap `OK` then `OK` again

### Version Bump
```sh
# apply your changes
cd example
yarn reinstall # bump versions package.json & podfile
cd ../
# copy version from `./lib/package.json` to `backup-server/package.json`

```
## Running example app
See also [`./example/README.md`](./example/README.md)
```bash
# Build dist files
git clone https://github.com/synonymdev/react-native-ldk.git
cd react-native-ldk/lib/ && yarn install && yarn build && cd ../

cd example/ && yarn install && yarn rn-setup

yarn ios
# or
yarn android
```

### Update config to match your local setup
In `constants.ts` update `peers.lnd` if you're using Polar locally.
### Example for Android
```ts
//  export const peers = {
// 	lnd: {
    pubKey:
      '_033f4d3032ce7f54224f4bd9747b50b7cd72074a859758e40e1ca46ffa79a34324_',
    address: '10.0.2.2',
    port: 9737,
// },
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

## Testing

Tests are implemented using [mocha-remote](https://github.com/kraenhansen/mocha-remote). To run tests at first you need to install docker and start tesing regtest enviroment using docker-compose:

```bash
cd example
docker-compose up
```

Then to run tests open two terminals and execute the following commands:

```bash
# Terminal 1
cd example
npm run start
```


```bash
# Terminal 2
cd example
npm run test:mocha
```

## How to test your code

Because it's a native module, you need to mock this package.

The package provides a default mock you may use in your \_\_mocks\_\_/@synonymdev/react-native-ldk.js or jest.setup.js.

```ts
import * as mockLDK from '@synonymdev/react-native-ldk/dist/mock';

jest.mock('@synonymdev/react-native-ldk', () => mockLDK);
```
