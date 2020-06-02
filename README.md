# react-native-lightning

### Installation
1. `yarn install react-native-lightning`

2. Add the following to the postinstall script in yourproject/package.json:
    - `(cd node_modules/rn-lnd && yarn install && ./node_modules/.bin/rn-nodeify --install buffer,stream,assert,events,crypto,vm,process --hack)`
 
3. Copy react-native-lightning/src/lnd.config to the following. (Note: Create the directories if they do not exist):
     - Android - `android/app/source/main/assets/lnd.config`
     - iOS - `ios/lightning/lnd.config`
     
4. Copy necessary files over for Android & iOS respectively:
    - Android - Copy LndNativeModule.java & LndNativePackage.java to:
            - `android/app/source/main/java/com/yourproject/`
    - iOS - Copy LndReactModule.h & LndReactModule.m to:
            - `ios/lightning/`
     
5. Generate the Lndmobile.aar & Lndmobile.framework files.
    - Option 1 - Generate them locally using lnd v0.10:
        - To generate these files, please follow the instructions detailed in the README of Lightning Lab's Lightning App [here.](https://github.com/lightninglabs/lightning-app/tree/master/mobile)
    - Option 2 - Download pre-generated files:
        - If you do not wish to generate these files locally you can download them [here](https://github.com/coreyphillips/react-native-lightning/releases/tag/v0.1) instead. However, I highly recommend you opt for option 1.

6. Add the Lndmobile.aar & Lndmobile.framework files to the project:
    - Add the Lndmobile.aar file to `android/Lndmobile`
    - Add the Lndmobile.framework file to `ios/lightning`

7. Add `packages.add(new LndNativePackage());` to "getPackages" in MainApplication.java just above `return packages`"

4. Start the project:
    - iOS: `react-native run-ios`
    - Android: `react-native run-android`
