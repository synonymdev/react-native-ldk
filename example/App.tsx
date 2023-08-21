import './shim';
import React, { ReactElement, useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, View } from 'react-native';

import Tests from './Tests';
import Dev from './Dev';
import { getItem, setItem } from './ldk';

const App = (): ReactElement => {
	const [tab, setTab] = useState('');

	useEffect(() => {
		getItem('tab').then((t) => {
			handleChangeTab(t || 'tests');
		});
	});

	const handleChangeTab = (t: string): void => {
		setTab(t);
		setItem('tab', t);
	};

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.row}>
				{['dev', 'tests'].map((t) => (
					<Button
						testID={t}
						key={t}
						title={t}
						onPress={(): void => handleChangeTab(t)}
					/>
				))}
			</View>

			{tab === 'dev' && <Dev />}
			{tab === 'tests' && <Tests />}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default App;
