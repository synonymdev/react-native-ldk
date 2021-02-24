# react-native-lightning

:warning: This is pre-alpha software. Please use as your own risk.


### Description
This library hopes to simplify the process of adding Lightning via LND's Neutrino to any React-Native app.

## Getting started

```bash
yarn add react-native-lightning
cd ios && pod install && cd ../
````

#### or build and add from local repo

```bash
#Clone, install and build project
git clone https://github.com/synonymdev/react-native-lightning.git
cd react-native-lightning
yarn install && yarn build
cd ../

#Add to your app
yarn add ../react-native-lightning #Might need to adjust path if not cloned to same directory as app
cd ios && pod install && cd ../
````

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
    TCurrentLndState,
} from 'react-native-lightning';

const lndConf = new LndConf(ENetworks.regtest);
```

```javascript
const res = await lnd.start(lndConf);
if (res.isErr()) {
    //Lnd failed to start
    console.error(res.error)
}

//LND state changes
lnd.subscribeToCurrentState(({lndRunning, walletUnlocked, grpcReady}) => {
    console.log(`lndRunning: ${lndRunning}`);
    console.log(`walletUnlocked: ${walletUnlocked}`);
    console.log(`grpcReady: ${grpcReady}`);
});


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
