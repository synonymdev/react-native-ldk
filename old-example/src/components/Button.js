import React, {memo} from "react";
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from "react-native";

const _Button = ({onPress = () => null, text = "", loading = false, style = {}} = {}) => {
	return (
		<TouchableOpacity activeOpacity={loading ? 1 : 0.6} onPress={loading ? null : onPress} style={[styles.button, style]}>
			<View style={styles.buttonContent}>
				{!loading && <Text style={styles.text}>
					{text}
				</Text>}
				{loading &&
				<ActivityIndicator size="small" color="#631e9a" />
				}
			</View>
		</TouchableOpacity>
	);
};
const styles = StyleSheet.create({
	button: {
		borderRadius: 20,
		minWidth: "40%",
		borderColor: "#631e9a",
		borderWidth: 1.75,
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 5
	},
	buttonContent: {
		paddingVertical: 5,
		paddingHorizontal: 8
	},
	text: {
		fontWeight: "bold",
		fontSize: 14,
		color: "#631e9a",
		alignSelf: "center",
	}
});

//ComponentShouldNotUpdate
const Button = memo(
	_Button,
	(prevProps, nextProps) => {
		if (!prevProps || !nextProps) {
			return true;
		}
		return prevProps === nextProps;
	},
);

export default Button;
