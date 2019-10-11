import React, {memo, useEffect, useState} from 'react';
import {
	StyleSheet,
	TextInput,
	View,
	ScrollView,
	InteractionManager,
	SafeAreaView,
	AppState
} from 'react-native';
import Button from "./src/components/Button";
import DataEntry from "./src/components/DataEntry";

const lnd = require('./lightning/lnd');
const {
	formatNumber,
	formatDate
} = require("./src/helpers");
const {
	payLightning,
	getAllInfo,
	getInfo,
	getAddress,
	addInvoice,
	getBackup,
	connectToPeer,
	getPeers,
	getWalletBalance,
	getChannelBalance,
	getTransactions,
	getInboundCapacity
} = require("./src/actions");

const infoShape = {
	alias: "",
	bestHeaderTimestamp: 0,
	blockHash: "",
	blockHeight: 0,
	chains: [],
	color: "#3399ff",
	identityPubkey: "",
	numActiveChannels: 0,
	numPeers: 0,
	syncedToChain: false,
	testnet: "",
	uris: [],
	version: ""
};

const channelBalanceShape = {
	balance: 0,
	pendingOpenBalance: 0
};

const walletBalanceShape = {
	totalBalance: 0,
	confirmedBalance: 0,
	unconfirmedBalance: 0
};

const START_LND = true;
this._updateDataInterval = {};

const _Lightning = () => {
	const [appState, setAppState] = useState(AppState.currentState);
	const [lightningUri, setLightningUri] = useState("");
	const [invoiceAmount, setInvoiceAmount] = useState("");
	const [peer, setPeer] = useState("");
	const [info, setInfo] = useState(infoShape);
	const [channelBalance, setChannelBalance] = useState(channelBalanceShape);
	const [walletBalance, setWalletBalance] = useState(walletBalanceShape);
	const [inboundCapacity, setInboundCapacity] = useState(0);

	const updateInfo = () => {
		try {
			InteractionManager.runAfterInteractions(async () => {
				const getInfoResponse = await getInfo({ lnd, log: false });
				if (!getInfoResponse.error) setInfo(getInfoResponse.data);
			});
		} catch(e) {
			console.log(e);
		}
	};
	const updateWalletBalance = () => {
		try {
			InteractionManager.runAfterInteractions(async () => {
				const response = await getWalletBalance({ lnd, log: false });
				if (!response.error) setWalletBalance(response.data);
			});
		} catch (e) {
			console.log(e);
		}
	};
	const updateChannelBalance = () => {
		try {
			InteractionManager.runAfterInteractions(async () => {
				const response = await getChannelBalance({ lnd, log: false });
				if (!response.error) setChannelBalance(response.data);
			});
		} catch (e) {
			console.log(e);
		}
	};
	const updateInboundCapacity = () => {
		try {
			InteractionManager.runAfterInteractions(async () => {
				const response = await getInboundCapacity({ lnd, log: false });
				if (!response.error) setInboundCapacity(response.data);
			});
		} catch (e) {
			console.log(e);
		}
	};
	
	const updateData = async () => {
		return await Promise.all([
			updateInfo(),
			updateChannelBalance(),
			updateWalletBalance(),
			updateInboundCapacity()
		]);
	};
	
	const _handleAppStateChange = async (nextAppState) => {
		//Foreground -> Background
		if (nextAppState === "inactive" || nextAppState === "background") {
			clearInterval(this._updateDataInterval);
		}
		//Background -> Foreground
		if (nextAppState === "active") {
			try {componentDidMount();} catch (e) {}
		}
		if (appState !== nextAppState) setAppState(nextAppState);
	};
	const componentDidMount = async () => {
		try {
			//Start LND if enabled.
			if (START_LND) {
				await lnd.start();
				await updateData();
				//Update info every 20 seconds.
				clearInterval(this._updateDataInterval);
				this._updateDataInterval = setInterval(updateData, 5000);
				AppState.addEventListener("change", _handleAppStateChange);
			}
			console.log(`LND is ready? ${lnd.isReady}`);
		} catch (e) {
			console.log(e);
		}
	};
	const componentWillUnmount = () => {
		if (START_LND) {
			AppState.removeEventListener("change", _handleAppStateChange);
			clearInterval(this._updateDataInterval);
		}
	};
	
	useEffect(() => {
		componentDidMount();
		return () => {
			componentWillUnmount();
		};
	}, []);
	
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView style={styles.container}>
				
				<View style={styles.upperContent}>
					<DataEntry title="Status" value={info.syncedToChain ? "Synced To Chain" : "Syncing..."} />
					<DataEntry title="Block Height" value={`${info.blockHeight ? info.blockHeight : "..."}  ${info.bestHeaderTimestamp ? formatDate(info.bestHeaderTimestamp) : ""}`} />
					<DataEntry title="Active Channels" value={info.numActiveChannels ? info.numActiveChannels : "0"} />
					<DataEntry title="Channel Balance" value={`Balance: ${channelBalance.balance}\nPending Open Balance: ${channelBalance.pendingOpenBalance}`} />
					<DataEntry title="Inbound Capacity" value={inboundCapacity} />
					<DataEntry title="Wallet Balance" value={`Total Balance: ${walletBalance.totalBalance}\nConfirmed Balance: ${walletBalance.confirmedBalance}\nUnconfirmed Balance: ${walletBalance.unconfirmedBalance}`} />
					<DataEntry title="Alias" value={info.alias ? info.alias : "..."} />
					<DataEntry title="Peers" value={info.numPeers ? info.numPeers : "0"} />
					<DataEntry title="Testnet" value={info.testnet !== "" ? info.testnet ? "true" : "false" : "..."} />
					<DataEntry title="Version" value={info.version ? info.version : "..."} />
				</View>
				
				<View style={styles.lowerContent}>
					
					<TextInput
						placeholder="Lightning URI"
						style={styles.textInput}
						autoCapitalize="none"
						autoCompleteType="off"
						autoCorrect={false}
						onChangeText={(uri) => setLightningUri(uri)}
						value={lightningUri}
						multiline={true}
					/>
					<Button
						onPress={() => {
							const paymentResponse = payLightning({ lnd, uri: lightningUri });
							if (!paymentResponse.error) updateData();
						}}
						text="Pay With Lightning"
					/>
					<View style={styles.separator} />
					
					<TextInput
						placeholder="Invoice Amount (sats)"
						style={styles.textInput}
						autoCapitalize="none"
						autoCompleteType="off"
						autoCorrect={false}
						onChangeText={amount => {
							amount = formatNumber(amount);
							if (invoiceAmount !== amount) setInvoiceAmount(amount);
						}}
						value={invoiceAmount}
						multiline={false}
					/>
					<Button onPress={() => addInvoice({ lnd, amount: invoiceAmount })} text="Create Invoice" />
					<View style={styles.separator} />
					
					<TextInput
						placeholder="Connect to Peer"
						style={styles.textInput}
						autoCapitalize="none"
						autoCompleteType="off"
						autoCorrect={false}
						onChangeText={peer => setPeer(peer)}
						value={peer}
						multiline={true}
					/>
					<Button onPress={() => connectToPeer({ lnd, peer })} text="Connect to Peer" />
					<View style={styles.separator} />
					
					<Button onPress={() => getPeers({ lnd })} text="Get Peers" />
					<View style={styles.separator} />
					
					<Button onPress={() => getAddress({ lnd })} text="Get Address" />
					<View style={styles.separator} />
					
					<Button onPress={() => getInfo({ lnd })} text="Get Info" />
					<View style={styles.separator} />
					
					<Button onPress={() => getAllInfo({ lnd })} text="Get All Info" />
					<View style={styles.separator} />
					
					<Button onPress={() => getWalletBalance({ lnd })} text="Get Wallet Balance" />
					<View style={styles.separator} />
					
					<Button onPress={() => getChannelBalance({ lnd })} text="Get Channel Balance" />
					<View style={styles.separator} />
					
					<Button onPress={() => getTransactions({ lnd })} text="Get Transactions" />
					<View style={styles.separator} />
					
					<Button onPress={() => getInboundCapacity({ lnd })} text="Get Inbound Capacity" />
					<View style={styles.separator} />
					
					<Button onPress={() => getBackup({ lnd })} text="Get Backup" />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	upperContent: {
		alignItems: 'flex-start',
		justifyContent: 'center',
		backgroundColor: 'white',
		flex: 1,
		paddingVertical: 20,
		paddingHorizontal: 40
	},
	lowerContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		paddingVertical: 20
	},
	textInput: {
		width: '60%',
		minHeight: 0,
		maxHeight: 150,
		backgroundColor: 'white',
		borderRadius: 8,
		padding: 10,
		paddingTop: 11,
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#631e9a',
		fontWeight: 'bold',
		borderColor: "#631e9a",
		borderWidth: 1.75
	},
	separator: {
		marginVertical: 5
	}
});

//ComponentShouldNotUpdate
const Lightning = memo(
	_Lightning,
	(prevProps, nextProps) => {
		if (!prevProps || !nextProps) {
			return true;
		}
		return prevProps === nextProps;
	},
);

export default Lightning;
