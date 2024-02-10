import React, { Component } from 'react';
import {
	Button,
	Platform,
	StyleSheet,
	Text,
	View,
	NativeModules,
} from 'react-native';
import { Client } from 'mocha-remote-client';
import { Runner } from 'mocha';

// Registering an error handler that always throw unhandled exceptions
// This is to enable the remote-mocha-cli to exit on uncaught errors
// const originalHandler = ErrorUtils.getGlobalHandler();
// ErrorUtils.setGlobalHandler((err, isFatal) => {
//   // Calling the original handler to show the error visually too
//   originalHandler(err, isFatal);
//   throw err;
// });

const engine = (global as any).HermesInternal ? 'hermes' : 'jsc';

class Tests extends Component {
	state = {
		status: 'disconnected',
		totalTests: 0,
		currentTest: '',
		currentTestIndex: 0,
		failures: 0,
		reason: '',
	};
	client?: Client;
	runner?: Runner;

	componentDidMount(): void {
		this.prepareTests();
	}

	componentWillUnmount(): void {
		if (this.client) {
			console.log('Disconnecting from the mocha-remote server');
			this.client.disconnect();
		}
	}

	render(): React.ReactNode {
		const { totalTests, currentTestIndex, status } = this.state;
		const progress = totalTests > 0 ? currentTestIndex / totalTests : 0;
		return (
			<View style={styles.container}>
				<Text style={styles.status}>{this.statusMessage}</Text>
				<Text style={styles.status}>
					progress:{' '}
					{progress === 1 || progress === 0 ? progress : progress.toFixed(2)}
				</Text>
				<Text style={styles.details}>{this.statusDetails}</Text>
				<Button
					title="Run tests natively"
					disabled={status === 'running'}
					onPress={this.handleRerunNative}
				/>
				<Button
					title="Abort running the tests"
					disabled={status !== 'running'}
					onPress={this.handleAbort}
				/>
			</View>
		);
	}

	handleRerunNative = (): void => {
		NativeModules.DevSettings.reload();
	};

	handleAbort = (): void => {
		if (this.runner) {
			this.runner.abort();
		}
	};

	get statusMessage(): string | null {
		if (this.state.status === 'disconnected') {
			return 'Disconnected from mocha-remote-server';
		} else if (this.state.status === 'waiting') {
			return 'Waiting for server to start tests';
		} else if (this.state.status === 'running') {
			return 'Running the tests';
		} else if (this.state.status === 'ended') {
			return 'The tests ended';
		} else {
			return null;
		}
	}

	get statusDetails(): string | null {
		const { status, currentTest, currentTestIndex, failures, reason } =
			this.state;
		if (status === 'running') {
			return currentTest;
		} else if (typeof reason === 'string') {
			return reason;
		} else if (typeof failures === 'number') {
			return `Ran ${currentTestIndex + 1} tests (${failures} failures)`;
		} else {
			return null;
		}
	}

	get statusColor(): string | undefined {
		const { status, failures } = this.state;
		if (status === 'ended') {
			return failures > 0 ? 'red' : 'green';
		} else {
			return undefined;
		}
	}

	prepareTests(): void {
		this.client = new Client({
			title: `React-Native on ${Platform.OS} (using ${engine})`,
			tests: (context): void => {
				/* eslint-env mocha */
				// Adding an async hook before each test to allow the UI to update
				beforeEach(function () {
					// WFT it doesn't work ?
					return new Promise((resolve) => setTimeout(resolve, 10));
				});
				// global.fs = require("react-native-fs");
				// global.path = require("path-browserify");
				global.environment = {
					// Default to the host machine when running on Android
					// realmBaseUrl: Platform.OS === "android" ? "http://10.0.2.2:9090" : undefined,
					...context,
					// reactNative: Platform.OS,
					// android: Platform.OS === "android",
					// ios: Platform.OS === "ios",
				};
				// Make the tests reinitializable, to allow test running on changes to the "realm" package
				// Probing the existance of `getModules` as this only exists in debug mode
				// if ("getModules" in require) {
				//   const modules = require.getModules();
				//   for (const [, m] of Object.entries(modules)) {
				//     if (m.verboseName.startsWith("../../tests/")) {
				//       m.isInitialized = false;
				//     }
				//   }
				// }
				// Require in the integration tests
				require('./tests');
			},
		});

		this.client
			// @ts-ignore
			.on('connected', () => {
				console.log('Connected to mocha-remote-server');
				this.setState({ status: 'waiting' });
			})
			// @ts-ignore
			.on('disconnected', ({ reason = 'No reason' }) => {
				console.error(`Disconnected: ${reason}`);
				this.setState({ status: 'disconnected', reason });
			})
			.on('running', (runner) => {
				// Store the active runner on the App
				this.runner = runner;
				// Check if the tests were loaded correctly
				if (runner.total > 0) {
					this.setState({
						status: 'running',
						failures: 0,
						currentTestIndex: 0,
						totalTests: runner.total,
					});
				} else {
					this.setState({
						status: 'ended',
						reason: 'No tests were loaded',
					});
				}

				runner.on('test', (test) => {
					// Compute the current test index - incrementing it if we're running
					// Set the state to update the UI
					this.setState({
						status: 'running',
						currentTest: test.fullTitle(),
						currentTestIndex: this.state.currentTestIndex + 1,
						totalTests: runner.total,
					});
				});

				runner.on('end', () => {
					this.setState({
						status: 'ended',
						failures: runner.failures,
					});
					delete this.client;
					delete this.runner;
				});
			});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	status: {
		fontSize: 20,
		margin: 10,
	},
	details: {
		fontSize: 14,
		padding: 10,
		width: '100%',
		textAlign: 'center',
		height: 100,
	},
});

export default Tests;
