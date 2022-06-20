import './shim';
import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
	Button,
	Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { dummyRandomSeed, setItem, setupLdk, syncLdk } from './ldk';
import { connectToElectrum, subscribeToHeader } from './electrum';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';
import lm from '@synonymdev/react-native-ldk';

const App = () => {
	const [message, setMessage] = useState('...');

	useEffect(() => {
		(async (): Promise<void> => {
			// Connect to Electrum Server
			const electrumResponse = await connectToElectrum({});
			if (electrumResponse.isErr()) {
				setMessage(
					`Unable to connect to Electrum Server:\n ${electrumResponse.error.message}`,
				);
				return;
			}
			// Subscribe to new blocks and sync LDK accordingly.
			await subscribeToHeader({
				onReceive: async () => {
					const syncRes = await syncLdk();
					if (syncRes.isErr()) {
						setMessage(syncRes.error.message);
						return;
					}
					setMessage(syncRes.value);
				},
			});
			// Setup LDK
			const setupResponse = await setupLdk();
			if (setupResponse.isErr()) {
				setMessage(setupResponse.error.message);
				return;
			}
			setMessage(JSON.stringify(setupResponse.value));
		})();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={styles.container}>
				<Text>{message}</Text>
				<View>
					<Button
						title={'Create New Random Seed'}
						onPress={async () => {
							const seed = dummyRandomSeed();
							await setItem('ldkseed', seed);
							await setItem('LDKData', '');
							setMessage(`New seed created: ${seed}`);
						}}
					/>

					<Button
						title={'Sync LDK'}
						onPress={async () => {
							const syncRes = await syncLdk();
							if (syncRes.isErr()) {
								setMessage(syncRes.error.message);
								return;
							}
							setMessage(syncRes.value);
						}}
					/>

					<Button
						title={'List peers'}
						onPress={async () => {
							try {
								const listPeers = await ldk.listPeers();
								if (listPeers.isErr()) {
									setMessage(listPeers.error.message);
									return;
								}
								setMessage(JSON.stringify(listPeers.value));
							} catch (e) {
								setMessage(e.toString());
							}
						}}
					/>

					<Button
						title={'List channels'}
						onPress={async () => {
							try {
								const listChannels = await ldk.listChannels();
								if (listChannels.isErr()) {
									setMessage(listChannels.error.message);
									return;
								}
								const keys = Object.keys(listChannels);
								keys.sort();

								let msg = '';
								await Promise.all(
									listChannels.value.map(async (channel) => {
										const ordered = Object.keys(channel)
											.sort()
											.reduce((obj, key) => {
												obj[key] = channel[key];
												return obj;
											}, {});
										await Promise.all(
											Object.keys(ordered).map((key) => {
												msg += `${key}: ${ordered[key]}\n`;
											}),
										);
									}),
								);

								setMessage(msg);
							} catch (e) {
								setMessage(e.toString());
							}
						}}
					/>

					<Button
						title={'List watch transactions'}
						onPress={async () => {
							console.log(lm.watchTxs);
							setMessage(`Watch TXs: ${JSON.stringify(lm.watchTxs)}`);
						}}
					/>

					<Button
						title={'List watch outputs'}
						onPress={async () => {
							setMessage(`Watch Outputs: ${JSON.stringify(lm.watchOutputs)}`);
						}}
					/>

					<Button
						title={'Pay invoice'}
						onPress={async () => {
							const paymentRequest = await Clipboard.getString();
							const decode = await ldk.decode({ paymentRequest });
							if (decode.isErr()) {
								return setMessage(decode.error.message);
							}

							const { recover_payee_pub_key, amount_milli_satoshis } =
								decode.value;

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
											const pay = await ldk.pay({ paymentRequest });
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
								const createPaymentRequest = await ldk.createPaymentRequest({
									amountSats: 1000000,
									description: 'paymeplz',
								});

								if (createPaymentRequest.isErr()) {
									setMessage(createPaymentRequest.error.message);
									return;
								}

								const { to_str } = createPaymentRequest.value;
								console.log(to_str);
								Clipboard.setString(to_str);
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

							Clipboard.setString(nodeIdRes.value);
							console.log(nodeIdRes.value);

							setMessage(`Node ID: ${nodeIdRes.value}`);
						}}
					/>

					<Button
						title={'Show version'}
						onPress={async () => {
							const ldkVersion = await ldk.version();
							if (ldkVersion.isErr()) {
								return setMessage(ldkVersion.error.message);
							}

							setMessage(ldkVersion.value.ldk);
						}}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default App;
