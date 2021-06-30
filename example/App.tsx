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
import Clipboard from '@react-native-clipboard/clipboard';
import lnd, {
  ENetworks,
  LndConf,
  TCurrentLndState,
  ICachedNeutrinoDBDownloadState,
} from '@synonymdev/react-native-lightning';

import lndCache from '@synonymdev/react-native-lightning/dist/utils/neutrino-cache';

import {emoji} from './src/helpers';
import PSBT from './src/PSBT';
import Options from './src/Options';

declare const global: {HermesInternal: null | {}};

const dummyPassword = 'shhhhhhh123';
const testNodePubkey =
  '034ecfd567a64f06742ac300a2985676abc0b1dc6345904a08bb52d5418e685f79';
const testNodeAddress = '35.240.72.95:9735';

const network = ENetworks.testnet;

const App = () => {
  const [message, setMessage] = useState('');
  const [lndState, setLndState] = useState<TCurrentLndState>({
    lndRunning: false,
    walletUnlocked: false,
    grpcReady: false,
  });

  const [walletExists, setWalletExists] = useState(false);
  const [seed, setSeed] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const walletExistsRes = await lnd.walletExists(network);
      if (walletExistsRes.isOk()) {
        setWalletExists(walletExistsRes.value);
      }

      lnd.subscribeToCurrentState(setLndState);
    })();
  }, [lndState]);

  useEffect(() => {
    if (lndState.walletUnlocked) {
      lnd.subscribeToOnChainTransactions(
        (res) => {
          if (res.isErr()) {
            return console.error(res.error);
          }

          const {amount, numConfirmations} = res.value;
          if (amount < 0) {
            return;
          }
          setMessage(`On chain tx: ${amount} sats (${numConfirmations} confs)`);
        },
        () => {},
      );

      lnd.subscribeToBackups(
        (res) => {
          if (res.isErr()) {
            return console.error(res.error);
          }

          const backupBytes = res.value.multiChanBackup?.multiChanBackup;
          console.log(`Backup required (${backupBytes?.length} bytes)`);
        },
        () => {},
      );
    }
  }, [lndState]);

  const showUnlockButton =
    lndState.lndRunning && !lndState.walletUnlocked && walletExists;
  const showGenerateSeed =
    lndState.lndRunning && !lndState.walletUnlocked && !walletExists;
  const showCreateButton =
    lndState.lndRunning && !lndState.walletUnlocked && !walletExists;

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
          <Text style={styles.message}>{message}</Text>

          {lndState.lndRunning ? (
            <Button
              title={'Stop LND'}
              onPress={async () => {
                setMessage('Stopping LND...');
                const res = await lnd.stop();
                if (res.isErr()) {
                  setMessage(res.error.message);
                  console.error(res.error);
                  return;
                }

                setMessage(JSON.stringify(res.value));
              }}
            />
          ) : (
            <>
              <Button
                title={'Download cached headers then start LND'}
                onPress={async () => {
                  setMessage('Downloading cached headers...');
                  setMessage(JSON.stringify(lndCache));
                  lndCache.addStateListener(
                    (state: ICachedNeutrinoDBDownloadState) => {
                      setMessage(JSON.stringify(state));
                    },
                  );

                  await lndCache.downloadCache(ENetworks.testnet);
                  // await startLnd();
                }}
              />
              <Button
                title={'Start LND'}
                onPress={async () => {
                  setMessage('Starting LND...');

                  const customFields = {};
                  const lndConf = new LndConf(network, customFields);
                  const res = await lnd.start(lndConf);

                  if (res.isErr()) {
                    setMessage(res.error.message);
                    console.error(res.error);
                    return;
                  }

                  setMessage(JSON.stringify(res.value));
                }}
              />
            </>
          )}

          {showGenerateSeed ? (
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
                  Clipboard.setString(res.value.join(' '));
                  setMessage(res.value.join(' '));
                }
              }}
            />
          ) : null}

          {showUnlockButton ? (
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
          ) : null}

          {showCreateButton ? (
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
          ) : null}

          {lndState.walletUnlocked ? (
            <>
              <Options
                nodePubKey={testNodePubkey}
                nodeAddress={testNodeAddress}
              />
              <PSBT nodePubKey={testNodePubkey} />
            </>
          ) : null}
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
  message: {
    margin: 10,
    textAlign: 'center',
  },
});

export default App;
