import './shim';
import React, { ReactElement, useEffect, useState } from 'react';
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
import { setItem, setupLdk, syncLdk } from './ldk';
import { connectToElectrum, subscribeToHeader } from './electrum';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';
import lm from '@synonymdev/react-native-ldk';
import { peers } from './utils/constants';
import { dummyRandomSeed, setSeed } from './utils/helpers';

const App = (): ReactElement => {
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
				onReceive: async (): Promise<void> => {
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
			setMessage(setupResponse.value);
		})();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={styles.scrollView}>
				<View style={styles.messageContainer}>
					<Text style={styles.text}>{message}</Text>
				</View>
				<View style={styles.container}>
					<Button
						title={'Create New Random Seed'}
						onPress={async (): Promise<void> => {
							const seed = dummyRandomSeed();
							await setSeed('ldkseed', seed);
							await setItem('LDKData', '');
							setMessage(`New seed created: ${seed}`);
						}}
					/>

					<Button
						title={'Sync LDK'}
						onPress={async (): Promise<void> => {
							const syncRes = await syncLdk();
							if (syncRes.isErr()) {
								setMessage(syncRes.error.message);
								return;
							}
							setMessage(syncRes.value);
						}}
					/>

					<Button
						title={'Add Peers'}
						onPress={async (): Promise<void> => {
							try {
								const peersRes = await Promise.all(
									Object.keys(peers).map(async (peer) => {
										const addPeer = await ldk.addPeer({
											...peers[peer],
											timeout: 5000,
										});
										if (addPeer.isErr()) {
											setMessage(addPeer.error.message);
											return;
										}
										return addPeer.value;
									}),
								);
								setMessage(JSON.stringify(peersRes));
							} catch (e) {
								setMessage(e.toString());
							}
						}}
					/>

					<Button
						title={'List peers'}
						onPress={async (): Promise<void> => {
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
						onPress={async (): Promise<void> => {
							try {
								const listChannels = await ldk.listChannels();
								if (listChannels.isErr()) {
									setMessage(listChannels.error.message);
									return;
								}
								if (listChannels.value.length < 1) {
									setMessage('No channels detected.');
									return;
								}

								let msg = '';
								// Sort Channels
								await Promise.all(
									listChannels.value.map(async (channel) => {
										const sorted = Object.keys(channel)
											.sort()
											.reduce((obj, key) => {
												obj[key] = channel[key];
												return obj;
											}, {});
										// Append channel info to msg.
										await Promise.all(
											Object.keys(sorted).map((key) => {
												msg += `${key}: ${sorted[key]}\n`;
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
						onPress={async (): Promise<void> => {
							console.log(lm.watchTxs);
							setMessage(`Watch TXs: ${JSON.stringify(lm.watchTxs)}`);
						}}
					/>

					<Button
						title={'List watch outputs'}
						onPress={async (): Promise<void> => {
							setMessage(`Watch Outputs: ${JSON.stringify(lm.watchOutputs)}`);
						}}
					/>

					<Button
						title={'Create invoice'}
						onPress={async (): Promise<void> => {
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
						title={'Pay invoice'}
						onPress={async (): Promise<void> => {
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
										onPress: async (): Promise<void> => {
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
						title={'Get info'}
						onPress={async (): Promise<void> => {
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
						onPress={async (): Promise<void> => {
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
		alignItems: 'center',
		justifyContent: 'center',
	},
	scrollView: {
		flex: 1,
	},
	messageContainer: {
		minHeight: 120,
		marginHorizontal: 20,
		justifyContent: 'center',
	},
	text: {
		textAlign: 'center',
	},
});

export default App;
