# react-native-lightning

:warning: This is pre-alpha software. Please use at your own risk.


### Description
This library hopes to simplify the process of adding Lightning via LND's Neutrino to any React-Native app.

## Getting started

```bash
yarn add @synonymdev/react-native-lightning
#or
npm i -s @synonymdev/react-native-lightning
````

### iOS installation
```bash
cd ios && pod install && cd ../
````

### Android installation

open `android/app/build.gradle` and add the below line to `dependencies`

`implementation files("../../node_modules/@synonymdev/react-native-lightning/android/libs/Lndmobile.aar")`

## Running example app
```bash

#Build dist files
git clone https://github.com/synonymdev/react-native-lightning.git
yarn install && yarn build

cd example/
yarn install

yarn ios
#or
yarn android
```

## Usage
```javascript
import lnd, {
    ENetworks,
    LndConf,
	ss_lnrpc
} from '@synonymdev/react-native-lightning';

const lndConf = new LndConf(ENetworks.regtest);
```

```javascript
const res = await lnd.start(lndConf);
if (res.isErr()) {
    //Lnd failed to start
    console.error(res.error)
}

//LND state changes
lnd.stateService.subscribeToStateChanges(
	(res: Result<ss_lnrpc.WalletState>) => {
		if (res.isOk()) {
			setLndState(res.value);
		}
	},
	() => {
        //Subscription has ended
    },
);


//Subscribe to LND logs
const logListener = lnd.addLogListener((message) => {
    console.log(message);
});

//Unsubscribe if listening component is unmounted
lnd.removeLogListener(logListener);

//All function results can be checked with res.isOk() or res.isErr()
const res = await lnd.getInfo();
if (res.isErr()) {
    console.log(res.error.message);
}

if (res.isOk()) {
    console.log(res.value);
}

//Use subscribeToOnChainTransactions/subscribeToInvoices for real time transaction updates
lnd.subscribeToOnChainTransactions(
    (res) => {
        if (res.isOk()) {
            const { amount, blockHeight, numConfirmations } = res.value;
            
            alert(`Received ${amount} sats on chain in block ${blockHeight}`)
        }
    },
    (res) => {
        //If this fails ever then we need to subscribe again
        console.error(res);
    },
);


```

### Using neutrino headers cache
Initial neutrino sync times can take a while for first time users. This is a trusted setup that allows the app to download a cached pre-synced archive of the neutrino headers. This speeds up the time it takes for LND to become usable as syncing doesn't need to start from scratch.
```bash
#Add these dependencies to your app
yarn add react-native-fs react-native-zip-archive  
#or
npm i react-native-fs react-native-zip-archive -S 

cd ios && pod install && cd ../
````

Using it:

```javascript
import lndCache from '@synonymdev/react-native-lightning/dist/utils/neutrino-cache';
```

```javascript
lndCache.addStateListener(
    (state: ICachedNeutrinoDBDownloadState) => {
      setMessage(JSON.stringify(state));
    },
);

await lndCache.downloadCache(ENetworks.testnet);
await startLnd();
```
