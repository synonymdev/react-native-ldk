/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import E2eLdkTest from './E2eLdkTest';
import { name as appName } from './app.json';
import { INTEGRATION_TEST } from '@env';

if (INTEGRATION_TEST) {
	AppRegistry.registerComponent(appName, () => E2eLdkTest);
} else {
	AppRegistry.registerComponent(appName, () => App);
}
