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
const testNodeAddress = '35.240.72.95:9735';

const App = () => {
  const [message, setMessage] = useState('');

  const startLdk = async (): Promise<void> => {
    setMessage('Starting LDK...');
    try {
      const res = await lm.start();

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
  },
});

export default App;
