/*eslint-disable no-undef*/

// https://wix.github.io/Detox/docs/introduction/writing-first-test
describe('LDK integration test', () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	beforeEach(async () => {
		// await device.reloadReactNative();
	});

	it('should have heading', async () => {
		await expect(element(by.text('react-native-ldk'))).toBeVisible();
	});

	it('should show "Node running" after tapping start', async () => {
		// await element(by.id('start')).tap();
		await element(by.text('E2E test')).tap();
		await expect(element(by.text('SUCCESS'))).toBeVisible();
	});
});
