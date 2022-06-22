import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import ldk from '@synonymdev/react-native-ldk/dist/ldk';

const E2eLdkTest = () => {
	const [message, setMessage] = useState('');

	useEffect(() => {
		(async () => {
			try {
				const res = await ldk.version();

				if (res.isErr()) {
					//If res screen error message is shown test will fail
					return console.error(res.error.message);
				}

				//Below message needs to be displayed to stop test with success
				setMessage('SUCCESS');
			} catch (e) {
				console.error(e);
			}
		})();
	}, []);

	return (
		<SafeAreaView>
			<Text>react-native-ldk integration test</Text>
			<Text>{message}</Text>
		</SafeAreaView>
	);
};

export default E2eLdkTest;
