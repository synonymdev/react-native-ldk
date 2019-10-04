import React, {memo} from "react";
import {StyleSheet, View, Text} from "react-native";

const _DataEntry = ({ title = "", value = ""} = {}) => {
	return (
		<View style={{ width: "100%" }}>
			<Text style={styles.title}>{title}:</Text>
			<Text style={styles.text}>{value}</Text>
			<View style={styles.lineSeparator} />
		</View>
	);
};
const styles = StyleSheet.create({
	title: {
		fontWeight: "bold",
		fontSize: 18,
		color: "#631e9a"
	},
	text: {
		fontSize: 18,
		color: "#631e9a"
	},
	lineSeparator: {
		marginVertical: 10,
		height: 1,
		width: "100%",
		backgroundColor: "#631e9a"
	}
});

//ComponentShouldNotUpdate
const DataEntry = memo(
	_DataEntry,
	(prevProps, nextProps) => {
		if (!prevProps || !nextProps) {
			return true;
		}
		return prevProps === nextProps;
	},
);

export default DataEntry;
