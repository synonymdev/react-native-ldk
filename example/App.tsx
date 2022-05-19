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
import lm from '@synonymdev/react-native-ldk';
import ldk from '@synonymdev/react-native-ldk/dist/ldk'; //For direct access to LDK functions

const testNodePubkey =
  '034ecfd567a64f06742ac300a2985676abc0b1dc6345904a08bb52d5418e685f79';
const testNodeAddress = '35.240.72.95';
const testNodePort = 9735;

const App = () => {
  const [message, setMessage] = useState('');

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text style={styles.title}>react-native-ldk</Text>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Text style={styles.message}>{message}</Text>

          <Button
            title={'Start'}
            onPress={async () => {
              setMessage('Starting LDK...');
              try {
                const res = await lm.start();

                if (res.isErr()) {
                  setMessage(res.error.message);
                  return;
                }

                setMessage(JSON.stringify(res.value));
              } catch (e) {
                setMessage(e.toString());
              }
            }}
          />

          <Button
            title={'Add peer'}
            onPress={async () => {
              setMessage('Adding peer...');
              try {
                const res = await ldk.addPeer({
                  pubKey:
                    '02b96088e17dd53a4297d0769e8166a64c25ff47b143cbd6615723cc2a49efbb65',
                  address: '127.0.0.1',
                  port: 9837,
                });

                if (res.isErr()) {
                  setMessage(res.error.message);
                  return;
                }

                setMessage(JSON.stringify(res.value));
              } catch (e) {
                setMessage(e.toString());
              }
            }}
          />

          <Button
            title={'List peers'}
            onPress={async () => {
              try {
                const res = await ldk.listPeers();

                if (res.isErr()) {
                  setMessage(res.error.message);
                  return;
                }

                setMessage(JSON.stringify(res.value));
              } catch (e) {
                setMessage(e.toString());
              }
            }}
          />

          <Button
            title={'List channels'}
            onPress={async () => {
              try {
                const res = await ldk.listChannels();

                if (res.isErr()) {
                  setMessage(res.error.message);
                  return;
                }

                let msg = '';
                res.value.forEach((channel) => {
                  Object.keys(channel).forEach((key) => {
                    // @ts-ignore
                    msg += `${key}: ${channel[key]}\n`;
                  });
                });

                setMessage(msg);
              } catch (e) {
                setMessage(e.toString());
              }
            }}
          />

          <Button
            title={'Show version'}
            onPress={async () => {
              const res = await ldk.version();
              if (res.isErr()) {
                return setMessage(res.error.message);
              }

              setMessage(res.value.ldk);
            }}
          />

          <Button
            title={'Get info'}
            onPress={async () => {
              const nodeIdRes = await ldk.nodeId();
              if (nodeIdRes.isErr()) {
                return setMessage(nodeIdRes.error.message);
              }

              console.log(nodeIdRes.value);

              setMessage(`Node ID: ${nodeIdRes.value}`);
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  message: {
    margin: 10,
    textAlign: 'center',
    color: 'green',
  },
});

export default App;
