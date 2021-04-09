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
  Alert,
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
  lnrpc,
  TCurrentLndState,
} from 'react-native-lightning';

declare const global: {HermesInternal: null | {}};

const dummyPassword = 'shhhhhhh123';
const testNodePubkey =
  '034ecfd567a64f06742ac300a2985676abc0b1dc6345904a08bb52d5418e685f79';
const testNodeAddress = '35.240.72.95:9735';

const App = () => {
  const [message, setMessage] = useState('');
  const [lndState, setLndState] = useState<TCurrentLndState>({
    lndRunning: false,
    walletUnlocked: false,
    grpcReady: false,
  });

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

          const backupBytes = res.value.multiChanBackup.multiChanBackup;
          console.log('Backup required');
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
          <Text style={{margin: 10, textAlign: 'center'}}>{message}</Text>

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
            <Button
              title={'Start LND'}
              onPress={async () => {
                setMessage('Starting LND...');

                const customFields = {};
                const lndConf = new LndConf(ENetworks.testnet, customFields);
                const res = await lnd.start(lndConf);

                if (res.isErr()) {
                  setMessage(res.error.message);
                  console.error(res.error);
                  return;
                }

                setMessage(JSON.stringify(res.value));
              }}
            />
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

          {lndState.grpcReady ? (
            <>
              <Button
                title={'Get info'}
                onPress={async () => {
                  const res = await lnd.getInfo();

                  if (res.isErr()) {
                    console.error(res.error);
                    return;
                  }

                  const {
                    identityPubkey,
                    syncedToChain,
                    blockHeight,
                    numPeers,
                    numActiveChannels,
                    version,
                    alias,
                  } = res.value;
                  let info = `Pubkey: ${identityPubkey}\n\n`;
                  info += `Alias: ${alias}\n\n`;
                  info += `Synced: ${emoji(syncedToChain)}\n\n`;
                  info += `BlockHeight: ${blockHeight}\n\n`;
                  info += `NumPeers: ${numPeers}\n\n`;
                  info += `NumActiveChannels: ${numActiveChannels}\n\n`;
                  info += `Version: ${version}`;

                  setMessage(info);
                }}
              />
              <Button
                title={'Get on chain balance'}
                onPress={async () => {
                  const res = await lnd.getWalletBalance();

                  if (res.isErr()) {
                    console.error(res.error);
                    return;
                  }

                  setMessage(
                    `Total balance: ${res.value.totalBalance}\nConfirmed balance: ${res.value.confirmedBalance}\nUnconfirmed balance: ${res.value.unconfirmedBalance}\n`,
                  );
                }}
              />
              <Button
                title={'Get channel balance'}
                onPress={async () => {
                  const res = await lnd.getChannelBalance();

                  if (res.isErr()) {
                    console.error(res.error);
                    return;
                  }

                  setMessage(
                    `Pending open balance: ${res.value.pendingOpenBalance}\nLocal balance: ${res.value.localBalance?.sat}\nRemote balance: ${res.value?.remoteBalance.sat}\n`,
                  );
                }}
              />
              <Button
                title={'Copy address to clipboard'}
                onPress={async () => {
                  const res = await lnd.getAddress();

                  if (res.isErr()) {
                    console.error(res.error);
                    return;
                  }

                  Clipboard.setString(res.value.address);
                  setMessage(`Copied: ${res.value.address}`);
                }}
              />
              <Button
                title={'Open channel'}
                onPress={async () => {
                  setMessage('Connecting to peer...');

                  const connectRes = await lnd.connectPeer(
                    testNodePubkey,
                    testNodeAddress,
                  );

                  if (
                    connectRes.isErr() &&
                    connectRes.error.message.indexOf(
                      'already connected to peer',
                    ) < 0
                  ) {
                    console.error(connectRes.error);
                    return;
                  }

                  setMessage('Opening channel...');

                  const balanceRes = await lnd.getWalletBalance();
                  if (balanceRes.isErr()) {
                    setMessage(balanceRes.error.message);
                    return;
                  }

                  let value = Number(balanceRes.value.confirmedBalance);
                  const maxChannel = 0.16 * 100000000;
                  if (value > maxChannel) {
                    value = maxChannel;
                  }

                  value -= 50000;

                  setMessage('Opening channel...');

                  const openRes = await lnd.openChannel(value, testNodePubkey);
                  if (openRes.isErr()) {
                    setMessage(openRes.error.message);
                    return;
                  }
                }}
              />

              <Button
                title={'List channels'}
                onPress={async () => {
                  const res = await lnd.listChannels();

                  if (res.isErr()) {
                    console.error(res.error);
                    return;
                  }

                  let list = '';
                  res.value.channels.forEach((channel: lnrpc.IChannel) => {
                    list += `Remote pubkey: ${channel.remotePubkey}\n`;
                    list += `Capacity: ${channel.capacity}\n`;
                    list += `Local balance: ${channel.localBalance}\n`;
                    list += `Remote balance: ${channel.remoteBalance}\n`;
                    list += `Active: ${emoji(channel.active || false)}\n`;

                    list += '\n\n';
                  });

                  setMessage(list || 'No channels');
                }}
              />

              <Button
                title={'Paste invoice from clipboard'}
                onPress={async () => {
                  const invoice = await Clipboard.getString();
                  if (!invoice) {
                    setMessage('Clipboard empty');
                  }

                  const decodeRes = await lnd.decodeInvoice(invoice);

                  if (decodeRes.isErr()) {
                    setMessage(decodeRes.error.message);
                    return;
                  }

                  const {numSatoshis, description} = decodeRes.value;

                  Alert.alert(
                    `Pay ${numSatoshis} sats?`,
                    description,
                    [
                      {
                        text: 'Cancel',
                        onPress: (): void => {},
                        style: 'cancel',
                      },
                      {
                        text: 'Pay',
                        onPress: async (): Promise<void> => {
                          setMessage('Paying...');
                          const payRes = await lnd.payInvoice(invoice);
                          if (payRes.isErr()) {
                            setMessage(payRes.error.message);
                            return;
                          }

                          setMessage(payRes.value.paymentError || 'Paid');
                        },
                      },
                    ],
                    {cancelable: true},
                  );
                }}
              />

              <Button
                title={'Create invoice and copy to clipboard'}
                onPress={async () => {
                  const res = await lnd.createInvoice(
                    5000,
                    `Test invoice ${new Date().getTime()}`,
                  );

                  if (res.isErr()) {
                    console.error(res.error);
                    return;
                  }

                  Clipboard.setString(res.value.paymentRequest);
                  setMessage(res.value.paymentRequest);
                }}
              />

              <Button
                title={'Export backup and verify it'}
                onPress={async () => {
                  const res = await lnd.exportAllChannelBackups();

                  if (res.isErr()) {
                    console.error(res.error);
                    return;
                  }

                  const verifyRes = await lnd.verifyMultiChannelBackup(
                    res.value.multiChanBackup.multiChanBackup,
                  );

                  if (verifyRes.isErr()) {
                    setMessage(verifyRes.error.message);
                    return;
                  }

                  setMessage(`Backup verification: ${emoji(verifyRes.value)}`);
                }}
              />
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
});

export default App;
