# react-native-lightning
This is my attempt at deconstructing what Lightning Labs has done with their Lightning App. My goal is to use this as a playground for learning and experimentation prior to implementing it into [Moonshine](https://github.com/coreyphillips/moonshine).

<p style="align-items: center">
  <img src="./src/assets/screenshots/screenshot1.png" width="33%" alt="Screenshot 1" />
  <img src="./src/assets/screenshots/screenshot2.png" width="33%" alt="Screenshot 2" />
</p>

### Installation
1. Generate the Lndmobile.aar & Lndmobile.framework files.
    - Option 1 - Generate them locally:
        - To generate these files, please follow the instructions detailed in the README of Lightning Lab's Lightning App [here.](https://github.com/lightninglabs/lightning-app/tree/master/mobile)
    - Option 2 - Download pre-generated files:
        - If you do not wish to generate these files locally you can download them [here](https://github.com/coreyphillips/moonshine/releases/tag/v0.2.0-2) instead. However, I highly recommend you opt for option 1.
2. Clone react-native-lightning and Install Dependencies:
   ```
    git clone https://github.com/coreyphillips/react-native-lightning
    cd react-native-lightning
    yarn install && cd ../../ && cd ios && pod install && cd ..
    ```
3. Add the Lndmobile.aar & Lndmobile.framework files to the project:
    - Add the Lndmobile.aar file to `react-native-lightning/android/Lndmobile`
    - Add the Lndmobile.framework file to `react-native-lightning/ios/lightning`

4. Start the project:
    - iOS: `react-native run-ios`
    - Android: `react-native run-android`
