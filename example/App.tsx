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
import ldk from '@synonymdev/react-native-ldk';
const testNodePubkey =
  '034ecfd567a64f06742ac300a2985676abc0b1dc6345904a08bb52d5418e685f79';
const testNodeAddress = '35.240.72.95:9735';

const App = () => {
  const [message, setMessage] = useState('');

  const startLdk = async (): Promise<void> => {
    setMessage('Starting LDK...');
    try {
      const res = await ldk.startChainMonitor();

      if (res.isErr()) {
        setMessage(res.error.message);
        console.error(res.error);
        return;
      }

      setMessage(JSON.stringify(res.value));
    } catch (e) {
      setMessage(e.toString());
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text style={styles.title}>react-native-ldk</Text>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Text style={styles.message}>{message}</Text>

          <Button title={'Start'} onPress={startLdk} />

          <Button
            title={'Version'}
            onPress={async () => {
              const res = await ldk.version();
              if (res.isOk()) {
                alert(res.value.c_bindings_get_compiled_version);
              }
            }}
          />

          <Button
            title={'initFeeEstimator'}
            onPress={async () => {
              const res = await ldk.initFeeEstimator({
                high: 1000,
                normal: 500,
                low: 100,
              });
              if (res.isOk()) {
                alert(res.value);
              }
            }}
          />

          <Button
            title={'updateFees'}
            onPress={async () => {
              const res = await ldk.updateFees({
                high: 1000,
                normal: 500,
                low: 100,
              });
              if (res.isOk()) {
                alert(res.value);
              }
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
  },
});

export default App;
