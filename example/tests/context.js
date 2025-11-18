/* eslint-disable @typescript-eslint/explicit-function-return-type */
const fs = require('fs');
const run = require('child_process').execSync;

// Helper function to retry file reads
function readFileWithRetry(path, maxRetries = 30, delay = 1000) {
	for (let i = 0; i < maxRetries; i++) {
		try {
			return fs.readFileSync(path);
		} catch (err) {
			if (i === maxRetries - 1) {
				console.error(`Failed to read ${path} after ${maxRetries} attempts`);
				throw err;
			}
			console.error(`Attempt ${i + 1}/${maxRetries}: Waiting for ${path}...`);
			// Sleep synchronously (only works on Unix-like systems)
			run(`sleep ${delay / 1000}`);
		}
	}
}

// Helper function to retry docker commands
function runWithRetry(cmd, maxRetries = 30, delay = 1000) {
	for (let i = 0; i < maxRetries; i++) {
		try {
			return run(cmd, { encoding: 'utf8' });
		} catch (err) {
			if (i === maxRetries - 1) {
				console.error(
					`Failed to run command after ${maxRetries} attempts: ${cmd}`,
				);
				throw err;
			}
			console.error(
				`Attempt ${i + 1}/${maxRetries}: Command failed, retrying: ${cmd}`,
			);
			run(`sleep ${delay / 1000}`);
		}
	}
}

try {
	// Read lnd macaroon with retry
	console.log('Waiting for LND macaroon...');
	const lndmacaroon = readFileWithRetry('docker/lnd/admin.macaroon')
		.toString('hex')
		.toUpperCase();
	console.log('LND macaroon loaded successfully');

	// Run command to read clightning rune with retry
	console.log('Waiting for CLightning to be ready...');
	const clightning = runWithRetry(
		'cd docker; docker compose exec --user clightning clightning lightning-cli createrune --regtest',
	);
	const lcrune = JSON.parse(clightning).rune;
	console.log('CLightning rune generated successfully');

	const context = { lndmacaroon, lcrune };
	const encoded = Buffer.from(JSON.stringify(context)).toString('hex');
	console.log(encoded);
} catch (error) {
	console.error('Failed to prepare test context:', error.message);
	console.error(error.stack);
	process.exit(1);
}
