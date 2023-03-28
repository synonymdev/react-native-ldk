import './shim';
import React, { ReactElement, useEffect, useState } from 'react';
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
import {
	backupAccount,
	importAccount,
	setupLdk,
	syncLdk,
	getAddressBalance,
	updateHeader,
} from './ldk';
import { connectToElectrum, subscribeToHeader } from './electrum';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';
import lm, {
	EEventTypes,
	TChannelManagerClaim,
	TChannelManagerPaymentPathFailed,
	TChannelManagerPaymentPathSuccessful,
	TChannelUpdate,
} from '@synonymdev/react-native-ldk';
import { peers } from './utils/constants';
import { createNewAccount, getAddress } from './utils/helpers';
import RNFS from 'react-native-fs';

let logSubscription: EmitterSubscription | undefined;
let paymentSubscription: EmitterSubscription | undefined;
let onChannelSubscription: EmitterSubscription | undefined;
let paymentFailedSubscription: EmitterSubscription | undefined;
let paymentPathSuccess: EmitterSubscription | undefined;
let backupSubscriptionId: string | undefined;

const App = (): ReactElement => {
	const [message, setMessage] = useState('...');
	const [nodeStarted, setNodeStarted] = useState(false);
	const [showLogs, setShowLogs] = useState(false);
	const [logContent, setLogContent] = useState('');

	useEffect(() => {
		//Restarting LDK on each code update causes constant errors.
		if (nodeStarted) {
			return;
		}

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
			const headerInfo = await subscribeToHeader({
				onReceive: async (): Promise<void> => {
					const syncRes = await syncLdk();
					if (syncRes.isErr()) {
						setMessage(syncRes.error.message);
						return;
					}
					setMessage(syncRes.value);
				},
			});
			if (headerInfo.isErr()) {
				setMessage(headerInfo.error.message);
				return;
			}
			await updateHeader({ header: headerInfo.value });
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
			// @ts-ignore
			logSubscription = ldk.onEvent(EEventTypes.ldk_log, (log: string) =>
				setLogContent((logs) => `${logs}${log}`),
			);
		}

		if (!paymentSubscription) {
			// @ts-ignore
			paymentSubscription = ldk.onEvent(
				EEventTypes.channel_manager_payment_claimed,
				(res: TChannelManagerClaim) => alert(`Received ${res.amount_sat} sats`),
			);
		}

		if (!paymentFailedSubscription) {
			// @ts-ignore
			paymentFailedSubscription = ldk.onEvent(
				EEventTypes.channel_manager_payment_path_failed,
				(res: TChannelManagerPaymentPathFailed) =>
					setMessage(
						`Payment path failed ${
							res.payment_failed_permanently ? 'permanently' : 'temporarily'
						}`,
					),
			);
		}

		if (!paymentPathSuccess) {
			// @ts-ignore
			paymentPathSuccess = ldk.onEvent(
				EEventTypes.channel_manager_payment_path_successful,
				(res: TChannelManagerPaymentPathSuccessful) =>
					setMessage(`Payment path success ${res.payment_id}`),
			);
		}

		if (!onChannelSubscription) {
			// @ts-ignore
			onChannelSubscription = ldk.onEvent(
				EEventTypes.new_channel,
				(res: TChannelUpdate) =>
					alert(
						`Channel received from ${res.counterparty_node_id} Channel ${res.channel_id}`,
					),
			);
		}

		if (!backupSubscriptionId) {
			backupSubscriptionId = lm.subscribeToBackups((backupRes) => {
				if (backupRes.isErr()) {
					return alert('Backup required but failed to export account');
				}

				console.log(
					`Backup updated for account ${backupRes.value.account.name}`,
				);
			});
		}

		return (): void => {
			logSubscription && logSubscription.remove();
			paymentSubscription && paymentSubscription.remove();
			paymentFailedSubscription && paymentFailedSubscription.remove();
			paymentPathSuccess && paymentPathSuccess.remove();
			onChannelSubscription && onChannelSubscription.remove();
			backupSubscriptionId && lm.unsubscribeFromBackups(backupSubscriptionId);
		};
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
						title={'E2E test'}
						testID="E2ETest"
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
						title={'Rebroadcast Known Transactions'}
						onPress={async (): Promise<void> => {
							try {
								const res = await lm.rebroadcastAllKnownTransactions();
								setMessage(JSON.stringify(res));
							} catch (e) {
								setMessage(e.toString());
							}
						}}
					/>
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
						title={'Get Node ID'}
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
						title={'Get Address Balance'}
						onPress={async (): Promise<void> => {
							setMessage('Getting Address Balance...');
							const address = await getAddress();
							const balance = await getAddressBalance(address);
							setMessage(`Balance: ${balance}`);
						}}
					/>

					<Button
						title={'Create invoice'}
						onPress={async (): Promise<void> => {
							const createInvoice = async (
								amountSats?: number,
							): Promise<void> => {
								try {
									const createPaymentRequest = await ldk.createPaymentRequest({
										amountSats,
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
							};

							const amountSats = 10000;
							Alert.alert('Create invoice', 'Specify amount?', [
								{
									text: 'Cancel',
									onPress: () => console.log('Cancel Pressed'),
									style: 'cancel',
								},
								{
									text: `${amountSats} sats`,
									onPress: async (): Promise<void> => createInvoice(amountSats),
								},
								{
									text: "Don't specify",
									onPress: async (): Promise<void> => createInvoice(),
								},
							]);
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

							const { amount_satoshis, description } = decode.value;

							const ownAmountSats = 1000;
							Alert.alert(
								amount_satoshis
									? `Pay ${amount_satoshis ?? 0}`
									: 'Zero sat invoice found',
								description,
								[
									{
										text: 'Cancel',
										onPress: () => console.log('Cancel Pressed'),
										style: 'cancel',
									},
									{
										text: 'Pay',
										onPress: async (): Promise<void> => {
											const pay = await lm.payWithTimeout({
												paymentRequest,
												amountSats: amount_satoshis ? undefined : ownAmountSats,
												timeout: 20000,
											});
											if (pay.isErr()) {
												return setMessage(pay.error.message);
											}

											setMessage(pay.value.payment_id);
										},
									},
								],
							);
						}}
					/>

					<Button
						title={'Build route and pay'}
						onPress={async (): Promise<void> => {
							const paymentRequest = await Clipboard.getString();
							const payRes = await ldk.payWithRoute({ paymentRequest });
							if (payRes.isErr()) {
								return setMessage(payRes.error.message);
							}

							setMessage(payRes.value);
						}}
					/>

					<Button
						title={'Get network graph nodes'}
						onPress={async (): Promise<void> => {
							const nodesRes = await ldk.networkGraphListNodeIds();
							if (nodesRes.isErr()) {
								return setMessage(nodesRes.error.message);
							}

							let msg = `Nodes (${nodesRes.value.length}): \n`;

							const nodes = await ldk.networkGraphNodes(nodesRes.value);
							if (nodes.isOk()) {
								nodes.value.forEach((node) => {
									const {
										id,
										shortChannelIds,
										lowest_inbound_channel_fees_base_sat,
										announcement_info_last_update,
									} = node;
									const time = new Date(announcement_info_last_update);

									msg += `\n\n${id}\nChannels: ${shortChannelIds.length}\n`;
									msg += `Lowest inbound fee: ${lowest_inbound_channel_fees_base_sat} sat\n`;
									msg += `Last announcement: ${time}`;
								});
							}

							setMessage(`${msg}`);
						}}
					/>

					<Button
						title={'Show claimable balances for closed/closing channels'}
						onPress={async (): Promise<void> => {
							const balances = await ldk.claimableBalances(true);
							if (balances.isErr()) {
								return setMessage(balances.error.message);
							}

							setMessage(JSON.stringify(balances.value));
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
							if (!lm.logFilePath) {
								return;
							}
							try {
								const content = await RNFS.readFile(lm.logFilePath, 'utf8');
								setLogContent(content);
								setShowLogs(true);
							} catch (e) {
								setMessage(JSON.stringify(e));
							}
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
							Clipboard.setString(JSON.stringify(backupResponse.value));
							setMessage(
								`Backup of the following account copied to clipboard:\n${JSON.stringify(
									backupResponse.value.account,
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
