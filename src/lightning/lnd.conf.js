/* Allows the conf to be kept in one place and passed to the native modules when lnd is started */

//TODO maybe make this into a factory to allow the developer to override fields with their own

const confString = "[Application Options]\n" +
    "debuglevel=info\n" +
    "no-macaroons=1\n" +
    "maxbackoff=2s\n" +
    "nolisten=1\n" +
    "\n" +
    "[Routing]\n" +
    "routing.assumechanvalid=1\n" +
    "\n" +
    "[Bitcoin]\n" +
    "bitcoin.active=1\n" +
    "bitcoin.testnet=1\n" +
    "bitcoin.node=neutrino\n" +
    "\n" +
    "[Neutrino]\n" +
    "neutrino.addpeer=faucet.lightning.community\n" +
    "neutrino.feeurl=https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json\n" +
    "\n" +
    "[autopilot]\n" +
    "autopilot.active=0\n" +
    "autopilot.private=0\n" +
    "autopilot.minconfs=0\n" +
    "autopilot.conftarget=30\n" +
    "autopilot.allocation=1.0\n" +
    "autopilot.heuristic=externalscore:0.95\n" +
    "autopilot.heuristic=preferential:0.05\n";

export default confString;
