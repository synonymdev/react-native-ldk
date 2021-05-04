/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import lnd, {lnrpc} from '@synonymdev/react-native-lightning';
import {emoji} from './helpers';

const Options = ({
  nodePubKey,
  nodeAddress,
}: {
  nodePubKey: string;
  nodeAddress: string;
}) => {
  const [message, setMessage] = useState('');

  return (
    <>
      <Text style={styles.message}>{message}</Text>
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
            `Pending open balance: ${res.value.pendingOpenBalance}\nLocal balance: ${res.value.localBalance?.sat}\nRemote balance: ${res.value.remoteBalance?.sat}\n`,
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
        title={'Connect to peer'}
        onPress={async () => {
          setMessage('Connecting to peer...');

          const connectRes = await lnd.connectPeer(nodePubKey, nodeAddress);

          if (connectRes.isErr()) {
            console.error(connectRes.error);
            setMessage(connectRes.error.message);
            return;
          }

          setMessage('Connected to peer');
        }}
      />

      <Button
        title={'Open channel'}
        onPress={async () => {
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

          const openRes = await lnd.openChannel(value, nodePubKey);
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

          const verifyRes = await lnd.verifyMultiChannelBackup(res.value);

          if (verifyRes.isErr()) {
            setMessage(verifyRes.error.message);
            return;
          }

          setMessage(`Backup verification: ${emoji(verifyRes.value)}`);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  streamMessage: {
    margin: 10,
    textAlign: 'center',
    color: 'blue',
  },
  message: {
    margin: 10,
    textAlign: 'center',
    color: 'green',
  },
});

export default Options;
