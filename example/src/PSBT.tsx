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
import {Button, StyleSheet, Text} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import lnd from '@synonymdev/react-native-lightning';

const closeAddress = 'bcrt1qll79gp5avu90rhg4x67yh6avsej9tcpeg5j0kw';

const PSBT = ({nodePubKey}: {nodePubKey: string}) => {
  const [streamMessage, setStreamMessage] = useState('');
  const [message, setMessage] = useState('');
  const [pendingChanId, setPendingChanId] = useState(new Uint8Array(0));

  return (
    <>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.streamMessage}>{streamMessage}</Text>
      <Button
        title={'Open channel stream'}
        onPress={async () => {
          setMessage('Opening...');

          const channelId = lnd.openChannelStream(
            1234567,
            nodePubKey,
            closeAddress,
            (res) => {
              if (res.isErr()) {
                return setStreamMessage(`Stream error: ${res.error.message}`);
              }

              setStreamMessage('STREAM UPDATE: ' + JSON.stringify(res.value));

              const {psbtFund} = res.value;

              console.log(JSON.stringify(res.value));

              const amt = Number(psbtFund?.fundingAmount ?? 1);
              const btc = amt / 100000000;

              const bitcoindCLI = `bitcoin-cli walletcreatefundedpsbt [] '[{"${res.value.psbtFund?.fundingAddress}":${btc}}]'`;
              //const lndCLI = `lncli wallet psbt fund --outputs='{"${res.value.psbtFund?.fundingAddress}":${amt}}'`;

              Clipboard.setString(bitcoindCLI);
            },
            () => {
              setStreamMessage('Channel funded.');
            },
          );

          setPendingChanId(channelId);
        }}
      />

      {pendingChanId ? (
        <>
          <Button
            title={'Verify (Paste PSBT)'}
            onPress={async () => {
              const psbt = await Clipboard.getString();

              const res = await lnd.fundingStateStep(
                pendingChanId,
                psbt,
                'verify',
              );

              if (res.isErr()) {
                setMessage(`Verify step error: ${res.error.message}`);
                return;
              }

              setMessage(JSON.stringify(res.value));
            }}
          />

          <Button
            title={'Finalize (Paste PSBT)'}
            onPress={async () => {
              const psbt = await Clipboard.getString();

              const res = await lnd.fundingStateStep(
                pendingChanId,
                psbt,
                'finalize',
              );

              if (res.isErr()) {
                setMessage(`Verify step error: ${res.error.message}`);
                return;
              }

              setMessage(JSON.stringify(res.value));
            }}
          />

          <Button
            title={'Cancel PSBT channel funding'}
            onPress={async () => {
              const res = await lnd.fundingStateStep(
                pendingChanId,
                '',
                'cancel',
              );

              if (res.isErr()) {
                setMessage(`Cancel error: ${res.error.message}`);
                return;
              }

              setPendingChanId(new Uint8Array());

              setMessage('Cancel success');
            }}
          />
        </>
      ) : null}
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

export default PSBT;
