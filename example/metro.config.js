const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
	resolver: {
		extraNodeModules: {
			stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
			buffer: path.resolve(__dirname, 'node_modules/buffer/'),
			assert: path.resolve(__dirname, 'node_modules/assert/'),
			events: path.resolve(__dirname, 'node_modules/events/'),
			crypto: path.resolve(__dirname, 'node_modules/crypto-browserify/'),
			vm: path.resolve(__dirname, 'node_modules/vm-browserify/'),
			process: path.resolve(__dirname, 'node_modules/process/'),
		},
	},
};

module.exports = mergeConfig(defaultConfig, config);
