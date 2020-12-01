/* Allows the conf to be kept in one place and passed to the native modules when lnd is started */

import { Networks } from './interfaces';

const regtestConfString =
  '[Application Options]\n' +
  'debuglevel=info\n' +
  'no-macaroons=false\n' +
  'nolisten=true\n' +
  '\n' +
  '[Routing]\n' +
  'routing.assumechanvalid=true\n' +
  '\n' +
  '[Bitcoin]\n' +
  'bitcoin.active=true\n' +
  'bitcoin.regtest=true\n' +
  'bitcoin.node=bitcoind\n' +
  '\n' +
  '[autopilot]\n' +
  'autopilot.active=false\n' +
  '\n' +
  '[watchtower]\n' +
  'watchtower.active=false\n' +
  '\n' +
  '[Bitcoind]\n' +
  'bitcoind.rpchost=localhost\n' +
  'bitcoind.rpcuser=polaruser\n' +
  'bitcoind.rpcpass=polarpass\n' +
  'bitcoind.zmqpubrawblock=tcp://10.0.0.100:28334\n' +
  'bitcoind.zmqpubrawtx=tcp://10.0.0.100:29335';

const testnetConfString =
  '[Application Options]\n' +
  'debuglevel=info\n' +
  'no-macaroons=1\n' +
  'maxbackoff=2s\n' +
  'nolisten=1\n' +
  '\n' +
  '[Routing]\n' +
  'routing.assumechanvalid=1\n' +
  '\n' +
  '[Bitcoin]\n' +
  'bitcoin.active=1\n' +
  'bitcoin.testnet=1\n' +
  'bitcoin.node=neutrino\n' +
  '\n' +
  '[Neutrino]\n' +
  'neutrino.addpeer=faucet.lightning.community\n' +
  'neutrino.feeurl=https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json\n' +
  '\n' +
  '[Autopilot]\n' +
  'autopilot.active=0\n' +
  'autopilot.private=0\n' +
  'autopilot.minconfs=0\n' +
  'autopilot.conftarget=30\n' +
  'autopilot.allocation=1.0\n' +
  'autopilot.heuristic=externalscore:0.95\n' +
  'autopilot.heuristic=preferential:0.05\n';

class LndConf {
  readonly network: Networks;

  constructor(network: Networks) {
    this.network = network;
  }

  // TODO allow the developer to override all other fields with their own

  build(): string {
    switch (this.network) {
      case Networks.regtest: {
        return regtestConfString;
      }
      case Networks.testnet: {
        return testnetConfString;
      }
      case Networks.mainnet: {
        throw new Error('Not implemented yet: Networks.mainnet case');
      }
    }
  }
}

export default LndConf;
