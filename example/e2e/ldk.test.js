describe('LDK integration test', () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
		await element(by.id('dev')).tap();
	});

	it('should show "Running LDK" after starting up', async () => {
		await waitFor(element(by.text('react-native-ldk')))
			.toBeVisible()
			.withTimeout(60000);

		await waitFor(element(by.text('Running LDK')))
			.toBeVisible()
			.withTimeout(60000);

		await element(by.id('E2ETest')).tap();

		await waitFor(element(by.text('e2e success')))
			.toBeVisible()
			.withTimeout(60000);
	});
});
