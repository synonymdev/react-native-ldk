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
            title={'Pay invoice'}
            onPress={async () => {
              const paymentRequest =
                'lnbcrt100u1p3gw4lmpp5g8nn2m856gwmc2rxlsgacw9746tyrzz5nh8svq6s6usmqqwdkn9qdp92phkcctjypykuan0d93k2grxdaezqcmpwfhkcxqyjw5qcqp2sp5csqwsteyyfeg6l0pfa6x6cwh88aklqzy0g7s5ndrg55h5fanwajq9qy9qsqtvfuzpl3w00tfvfgwt0waxsl9fe4z6eu4cwttulx5c5p5fl442vynngr9w0un3janvcr68a3vtlyn3js0j332wzdry5wneat6f2365gp6xstn6';
              const res = await ldk.decode({paymentRequest});
              if (res.isErr()) {
                return setMessage(res.error.message);
              }

              const {recover_payee_pub_key, amount_milli_satoshis} = res.value;

              Alert.alert(
                `Pay ${amount_milli_satoshis ?? 0}`,
                `To pubkey: ${recover_payee_pub_key}`,
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Pay',
                    onPress: async () => {
                      const pay = await ldk.pay({paymentRequest});
                      if (pay.isErr()) {
                        return setMessage(pay.error.message);
                      }

                      setMessage(pay.value);
                    },
                  },
                ],
              );
            }}
          />

          <Button
            title={'Create invoice'}
            onPress={async () => {
              try {
                const res = await ldk.createPaymentRequest({
                  amountSats: 1234,
                  description: 'paymeplz',
                });

                if (res.isErr()) {
                  setMessage(res.error.message);
                  return;
                }

                const {to_str} = res.value;

                setMessage(to_str);
              } catch (e) {
                setMessage(e.toString());
              }
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
