import React, { useState } from 'react';
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

//const testNodePubkey = '034ecfd567a64f06742ac300a2985676abc0b1dc6345904a08bb52d5418e685f79';
//const testNodeAddress = '35.240.72.95';
//const testNodePort = 9735;

const App = () => {
	const [message, setMessage] = useState('');

	return (
		<>
			<Text>SUCCESS</Text>
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
