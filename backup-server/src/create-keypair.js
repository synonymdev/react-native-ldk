const { utils } = require("ln-verifymessagejs");

const {privateKey, publicKey} = utils.generateKeyPair(); // Generate a keypair or use your own private key.

console.log("\n****KEYPAIR******");
console.log(`SECRET_KEY=${privateKey.hex}`);
console.log(`PUBLIC_KEY=${publicKey.hex}`);
console.log("**********\n");
