# react-native-ldk

:warning: This is pre-alpha software. Please use at your own risk.


### Description
This library hopes to simplify the process of adding Lightning via LDK to any React-Native app.

## Getting started

```bash
yarn add @synonymdev/react-native-ldk
#or
npm i -s @synonymdev/react-native-ldk
````

### iOS installation
```bash
cd ios && pod install && cd ../
````

## Running example app
```bash

#Build dist files
git clone https://github.com/synonymdev/react-native-ldk.git
yarn install && yarn build

cd example/
yarn install

yarn ios
#or
yarn android
```

## Usage
```javascript
import ldk from '@synonymdev/react-native-ldk';
```

```javascript
const res = await ldk.start();
if (res.isErr()) {
    //LDK failed to start
    console.error(res.error)
}

//Subscribe to LDK logs
const logListener = ldk.addLogListener((message) => {
    console.log(message);
});

//Unsubscribe if listening component is unmounted
ldk.removeLogListener(logListener);

```
