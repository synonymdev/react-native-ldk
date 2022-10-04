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

## Upgrading LDK
- Use latest LDK-release.aar from [ldk-garbagecollected](https://github.com/lightningdevkit/ldk-garbagecollected/releases) and place in `lib/android/libs`.
- Use latest LDKFramework.xcframework from [ldk-swift](https://github.com/lightningdevkit/ldk-swift/releases) and place in lib/ios.
  - To get `pod install` working you might have to open the `LDKFramework.xcframework` directory, delete non ios frameworks and remove all references to deleted frameworks inside `LDKFramework.xcframework/Info.plist`.
- Update Swift and Kotlin code if there are any breaking changes.
