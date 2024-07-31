const fs = require('fs');
const run = require('child_process').execSync;

// read lnd macaroon
const lndmacaroon = fs
	.readFileSync('docker/lnd/admin.macaroon')
	.toString('hex')
	.toUpperCase();

// run command to read clightnng rune
const clightning = run(
	'cd docker; docker compose exec --user clightning clightning lightning-cli createrune --regtest',
);
const lcrune = JSON.parse(clightning).rune;

const context = { lndmacaroon, lcrune };
const encoded = Buffer.from(JSON.stringify(context)).toString('hex');
console.log(encoded);
