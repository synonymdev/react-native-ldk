/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';

import lnd, {
  ENetworks,
  LndConf,
  TCurrentLndState,
} from 'react-native-lightning';

declare const global: {HermesInternal: null | {}};

const dummyPassword = 'shhhhhhh123';

const App = () => {
  const [message, setMessage] = useState('');
  const [lndState, setLndState] = useState<TCurrentLndState>('');
  const [walletExists, setWalletExists] = useState(false);
  const [seed, setSeed] = useState<string[]>([]);

  const emoji = (s: boolean) => (s ? '✅' : '❌');

  useEffect(() => {
    (async () => {
      const walletExistsRes = await lnd.walletExists(ENetworks.testnet);
      if (walletExistsRes.isOk()) {
        setWalletExists(walletExistsRes.value);
      }

      lnd.subscribeToCurrentState(setLndState);
    })();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Text style={styles.state}>
            LND running: {emoji(lndState.lndRunning)}
          </Text>
          <Text style={styles.state}>
            Wallet unlocked: {emoji(lndState.walletUnlocked)}
          </Text>
          <Text style={styles.state}>Ready: {emoji(lndState.grpcReady)}</Text>

          <Text>{message}</Text>
          <Text>{seed.join(' ')}</Text>

          <Button
            title={'Start LND'}
            onPress={async () => {
              setMessage('Starting LND...');

              const customFields = {};
              const lndConf = new LndConf(ENetworks.testnet, customFields);
              const res = await lnd.start(lndConf);

              if (res.isErr()) {
                console.error(res.error);
                return;
              }

              setMessage(JSON.stringify(res.value));
            }}
          />

          <Button
            title={'Generate seed'}
            onPress={async () => {
              const res = await lnd.genSeed();

              if (res.isErr()) {
                console.error(res.error);
                return;
              }

              if (res.isOk()) {
                setSeed(res.value);
              }
            }}
          />

          {walletExists ? (
            <Button
              title={'Unlock wallet'}
              onPress={async () => {
                const res = await lnd.unlockWallet(dummyPassword);

                if (res.isErr()) {
                  console.error(res.error);
                  return;
                }

                setMessage(JSON.stringify(res.value));
              }}
            />
          ) : (
            <Button
              title={'Create wallet'}
              onPress={async () => {
                const res = await lnd.createWallet(dummyPassword, seed);

                if (res.isErr()) {
                  console.error(res.error);
                  return;
                }

                setMessage(JSON.stringify(res.value));
              }}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
  },
  state: {
    textAlign: 'center',
  },
});

export default App;
