// https://wix.github.io/Detox/docs/introduction/writing-first-test
describe('LDK integration test', () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	beforeEach(async () => {
		// await device.reloadReactNative();
	});

	it('should have heading', async () => {
		await waitFor(element(by.text('react-native-ldk')))
			.toBeVisible()
			.withTimeout(2000);
	});

	it('should show "Running LDK" after starting up', async () => {
		// await element(by.id('start')).tap();
		await waitFor(element(by.text('Running LDK')))
			.toBeVisible()
			.withTimeout(2000);

		await element(by.text('E2E test')).tap();

		await waitFor(element(by.text('e2e success')))
			.toBeVisible()
			.withTimeout(2000);
	});
});
