import { expect } from 'chai';
import { describe, it } from 'mocha';
import RNFS from 'react-native-fs';
import lm, { ENetworks, ldk } from '@synonymdev/react-native-ldk';

import { wipeLdkStorage } from './utils';

describe('Unit', function () {
	this.timeout(1 * 60 * 1000); // 1 minute
	before(async () => {
		const storageRes = await lm.setBaseStoragePath(
			`${RNFS.DocumentDirectoryPath}/ldk/`,
		);
		if (storageRes.isErr()) {
			throw storageRes.error;
		}
	});

	after(async () => {
		await ldk.stop();
	});

	beforeEach(async () => {
		console.info('beforeEach');
	});

	afterEach(async () => {
		await wipeLdkStorage();
	});

	it("can't start with empty config", async function () {
		const r = await ldk.restart();
		expect(r.isErr()).to.be.true;
	});

	it('can return version', async function () {
		const version = await ldk.version();
		if (version.isErr()) {
			throw version.error;
		}
		expect(version.value.c_bindings).to.be.a('string');
		expect(version.value.ldk).to.be.a('string');
	});

	it('can start', async function () {
		const account = {
			name: 'Mock',
			seed: '0000000000000000000000000000000000000000000000000000000000000000',
		};

		const lmStart = await lm.start({
			getBestBlock: async () => ({
				hash: '6993d7c36204c9f369a7d9d80590c4e2a86b9641c327fbc276a534797ca50a2f',
				height: 1,
				hex: '000000205d1f3ece3bcb0a3530adaae2e4aa47f8aad434db95c6cb6d09d5ac99e3f6df4f0a19fe968830a06dcc49c9cca4acc532226e4c30b741802420e0fdd2b092eccdbf95cb64ffff7f2000000000',
			}),
			account,
			getAddress: async () => ({
				address: 'bcrt1qtk89me2ae95dmlp3yfl4q9ynpux8mxjus4s872',
				publicKey:
					'0298720ece754e377af1b2716256e63c2e2427ff6ebdc66c2071c43ae80132ca32',
			}),
			getScriptPubKeyHistory: async () => [],
			getFees: () => {
				return Promise.resolve({
					nonAnchorChannelFee: 5,
					anchorChannelFee: 5,
					maxAllowedNonAnchorChannelRemoteFee: 5,
					channelCloseMinimum: 5,
					minAllowedAnchorChannelRemoteFee: 5,
					minAllowedNonAnchorChannelRemoteFee: 5,
					onChainSweep: 5,
				});
			},
			getTransactionData: async () => ({
				header: '',
				height: 0,
				transaction: '',
				vout: [],
			}),
			getTransactionPosition: async () => -1,
			broadcastTransaction: async () => '',
			network: ENetworks.regtest,
		});

		if (lmStart.isErr()) {
			throw lmStart.error;
		}

		const syncLdk = await lm.syncLdk();
		if (syncLdk.isErr()) {
			throw syncLdk.error;
		}

		const nodeId = await ldk.nodeId();
		if (nodeId.isErr()) {
			throw nodeId.error;
		}
		expect(nodeId.value).to.be.equal(
			'027f921585f2ac0c7c70e36110adecfd8fd14b8a99bfb3d000a283fcac358fce88',
		);

		expect(lm.getLdkPaymentsSent()).to.eventually.be.an('array').that.is.empty;
		expect(lm.getLdkPaymentsClaimed()).to.eventually.be.an('array').that.is
			.empty;

		const claimableBalances = await ldk.claimableBalances(false);
		if (claimableBalances.isErr()) {
			throw claimableBalances.error;
		}
		expect(claimableBalances.value).to.be.an('array').that.is.empty;

		const listPeers = await ldk.listPeers();
		if (listPeers.isErr()) {
			throw listPeers.error;
		}
		expect(listPeers.value).to.be.an('array').that.is.empty;

		const listChannels = await ldk.listChannels();
		if (listChannels.isErr()) {
			throw listChannels.error;
		}
		expect(listChannels.value).to.be.an('array').that.is.empty;

		await lm.rebroadcastAllKnownTransactions();

		const recoverOutputs = await lm.recoverOutputs();
		if (recoverOutputs.isErr()) {
			throw recoverOutputs.error;
		}
		expect(recoverOutputs.value).to.be.equal(
			'Attempting to spend 0 outputs from cache. No outputs to reconstruct as no cached transactions found.',
		);

		const pr = await lm.createAndStorePaymentRequest({
			amountSats: 100,
			description: 'ololo',
			expiryDeltaSeconds: 999999,
		});
		if (pr.isErr()) {
			throw pr.error;
		}
		expect(pr.value.amount_satoshis).to.be.equal(100);
		expect(pr.value.check_signature).to.be.true;
		expect(pr.value.currency).to.be.equal('Regtest');
		expect(pr.value.description).to.be.equal('ololo');
		expect(pr.value.expiry_time).to.be.equal(999999);
		expect(pr.value.features).to.be.equal('0003024100');
		expect(pr.value.is_expired).to.be.false;
		expect(pr.value.min_final_cltv_expiry).to.be.equal(24);
		expect(pr.value).include.all.keys(
			'duration_since_epoch',
			'payee_pub_key',
			'payment_hash',
			'payment_secret',
			'recover_payee_pub_key',
			'route_hints',
			'timestamp',
			'to_str',
		);

		const nodesRes = await ldk.networkGraphListNodeIds();
		if (nodesRes.isErr()) {
			throw nodesRes.error;
		}
		expect(nodesRes.value).to.be.an('array').that.is.empty;

		const backupResp = await lm.backupAccount({
			account,
			includeTransactionHistory: true,
		});
		if (backupResp.isErr()) {
			throw backupResp.error;
		}
		const br = backupResp.value;
		expect(br.account.name).to.be.equal(account.name);
		expect(br.account.seed).to.be.equal(account.seed);
		expect(br.data.channel_manager).to.be.a('string').that.is.not.empty;
		expect(br.data.channel_monitors).to.be.a('object').that.is.empty;
		expect(br.data.peers).to.be.a('array').that.is.empty;
		expect(br.data.unconfirmed_transactions).to.be.a('array').that.is.empty;
		expect(br.data.broadcasted_transactions).to.be.a('array').that.is.empty;
		expect(br.data.payment_ids).to.be.a('array').that.is.empty;
		expect(br.data.spendable_outputs).to.be.a('array').that.is.empty;
		expect(br.data.payments_claimed).to.be.a('array').that.is.empty;
		expect(br.data.payments_sent).to.be.a('array').that.is.empty;
		expect(br.data.bolt11_invoices).to.include(pr.value.to_str);
		expect(br.data.timestamp).to.be.a('number');
		expect(br.package_version).to.be.a('string');
		expect(br.network).to.be.equal('regtest');

		const restart = await ldk.restart();
		if (restart.isErr()) {
			throw restart.error;
		}
	});
});
