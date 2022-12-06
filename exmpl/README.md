# react-native-ldk-example

### Description
This is an example project for [`react-native-ldk`](https://github.com/synonymdev/react-native-ldk).

### Getting started

#### 1. Clone & Install
```bash
git clone git@github.com:synonymdev/react-native-ldk.git && cd react-native-ldk/lib/ && yarn install && yarn build && cd ../exmpl && yarn install && yarn rn-setup
````
#### 2. Spin up [Polar](https://github.com/jamaljsr/polar) or a Lightning node of your choosing and connect an Electrum Server to it.
#### 3. Update the Lightning node and Electrum server info in `exmpl/utils/constants.ts`.
#### 4. Run iOS or Android
```bash
yarn ios
#or
yarn android
```
