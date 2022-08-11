import './shim';
import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {
	Alert,
	Button,
	EmitterSubscription,
	Modal,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { backupAccount, importAccount, setupLdk, syncLdk } from './ldk';
import { connectToElectrum, subscribeToHeader } from './electrum';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';
import lm, {EEventTypes} from '@synonymdev/react-native-ldk';
import { peers } from './utils/constants';
import { createNewAccount } from './utils/helpers';
import RNFS from 'react-native-fs';

let logSubscription: EmitterSubscription | undefined;

const App = (): ReactElement => {
	const [message, setMessage] = useState('...');
	const [nodeStarted, setNodeStarted] = useState(false);
	const [logFilePath, setLogFilePath] = useState('');
	const [showLogs, setShowLogs] = useState(false);
	const [logContent, setLogContent] = useState('');

	useEffect(() => {
		//Restarting LDK on each code update causes constant errors.
		if (nodeStarted) {
			return;
		}

		(async (): Promise<void> => {
			//Set only if you want logging to be saved to a file.
			const logPath = `${RNFS.DocumentDirectoryPath}/ldk-${Date.now()}.log`;
			await ldk.setLogFilePath(logPath);
			setLogFilePath(logPath);
			console.log(`LDK logs writing to ${logPath}`);

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

			setNodeStarted(true);
			setMessage(setupResponse.value);
		})();
	}, [nodeStarted]);

	useEffect(() => {
		if (!logSubscription) {
			logSubscription = ldk.onEvent(EEventTypes.ldk_log, (log: string) => setLogContent((logs => `${logs}${log}`)));
		}

		return (): void => logSubscription && logSubscription.remove();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={styles.scrollView}>
				<Text style={styles.text}>react-native-ldk</Text>
				<View style={styles.messageContainer}>
					<Text style={styles.text}>{message}</Text>
				</View>
				<View style={styles.container}>
					<Button
						title={'Create New Account'}
						onPress={async (): Promise<void> => {
							const newAccount = await createNewAccount();
							if (newAccount.isOk()) {
								await setupLdk();
								setMessage(`New account created: ${newAccount.value.seed}`);
							}
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
										const addPeer = await lm.addPeer({
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
						title={'Close channel'}
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

								const { channel_id, counterparty_node_id } =
									listChannels.value[0];

								const close = async (force: boolean): Promise<void> => {
									setMessage(`Closing ${channel_id}...`);

									const res = await ldk.closeChannel({
										channelId: channel_id,
										counterPartyNodeId: counterparty_node_id,
										force,
									});
									if (res.isErr()) {
										setMessage(res.error.message);
										return;
									}
									setMessage(res.value);
								};

								Alert.alert('Close channel', `Peer ${counterparty_node_id}`, [
									{
										text: 'Cancel',
										onPress: () => console.log('Cancel Pressed'),
										style: 'cancel',
									},
									{
										text: 'Close channel',
										onPress: async (): Promise<void> => close(false),
									},
									{
										text: 'Force close',
										onPress: async (): Promise<void> => close(true),
									},
								]);
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
									amountSats: 123400,
									description: 'paymeplz',
									expiryDeltaSeconds: 999999,
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

							const { recover_payee_pub_key, amount_satoshis } = decode.value;

							Alert.alert(
								`Pay ${amount_satoshis ?? 0}`,
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

					<Button
						title={'Show LDK logs'}
						onPress={async (): Promise<void> => {
							if (!logFilePath) {
								return;
							}
							try {
								const content = await RNFS.readFile(logFilePath, 'utf8');
								setLogContent(content);
								setShowLogs(true);
							} catch (e) {
								setMessage(JSON.stringify(e));
							}
						}}
					/>

					<Button
						title={'E2E test'}
						onPress={async (): Promise<void> => {
							//TODO add more functionality to test
							const ldkVersion = await ldk.version();
							if (ldkVersion.isErr()) {
								return setMessage(ldkVersion.error.message);
							}

							const nodeIdRes = await ldk.nodeId();
							if (nodeIdRes.isErr()) {
								return setMessage(nodeIdRes.error.message);
							}

							return setMessage('e2e success');
						}}
					/>

					<Button
						title={'Backup Current Account'}
						onPress={async (): Promise<void> => {
							const backupResponse = await backupAccount();
							if (backupResponse.isErr()) {
								setMessage(backupResponse.error.message);
								return;
							}
							console.log(backupResponse.value);
							Clipboard.setString(backupResponse.value);
							const account = JSON.parse(backupResponse.value).account;
							setMessage(
								`Backup of the following account copied to clipboard:\n${JSON.stringify(
									account,
								)}`,
							);
						}}
					/>
					<Button
						title={'Import Account From Clipboard'}
						onPress={async (): Promise<void> => {
							setMessage('Importing Account...');
							const clipboardBackup = await Clipboard.getString();
							const importResponse = await importAccount(clipboardBackup);
							if (importResponse.isErr()) {
								setMessage(importResponse.error.message);
								return;
							}
							const accountData = JSON.stringify(importResponse.value);
							setMessage(
								`Successfully imported the following account: ${accountData}`,
							);
						}}
					/>
				</View>
			</ScrollView>

			<Modal
				animationType="slide"
				visible={showLogs}
				onRequestClose={(): void => {
					setShowLogs(false);
				}}>
				<View style={styles.logModal}>
					<ScrollView>
						<Button title={'Close'} onPress={(): void => setShowLogs(false)} />
						<Text style={styles.modalText}>{logContent}</Text>
					</ScrollView>
				</View>
			</Modal>
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
	logModal: {
		paddingTop: 40,
		paddingHorizontal: 10,
		flex: 1,
		backgroundColor: 'black',
	},
	modalText: {
		color: 'green',
		fontSize: 10,
	},
});

export default App;
