import LndConf from '../lnd.conf';
import { ENetworks } from '../types';

const customConfFields = {
	Bitcoind: { 'bitcoind.rpcpass': 'custom_password' },
	'New heading': { 'newheading.madeup': 1234, 'newheading.anothermadeup': false }
};

test('lndConf should contain custom field lines when built', () => {
	const lndConf = new LndConf(ENetworks.regtest, customConfFields);
	const confString = lndConf.build();

	expect(confString).toContain('\nbitcoind.rpcpass=custom_password\n');
	expect(confString).toContain('\nnewheading.madeup=1234\n');
	expect(confString).toContain('\nnewheading.madeup=1234\n');
	expect(confString).toContain('\nnewheading.anothermadeup=false\n');
});

test('should override custom field with one occurrence', () => {
	const lndConf = new LndConf(ENetworks.regtest, customConfFields);
	const confString = lndConf.build();
	expect((confString.match(/bitcoind.rpcpass/g) ?? []).length).toStrictEqual(1);
});
