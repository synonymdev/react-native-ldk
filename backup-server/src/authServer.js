const { SlashAuthServer} = require('@slashtags/slashauth')
const b4a = require('b4a')
const sodium = require('sodium-universal')

function createKeyPair (seed) {
    const publicKey = b4a.allocUnsafe(sodium.crypto_sign_PUBLICKEYBYTES)
    const secretKey = b4a.allocUnsafe(sodium.crypto_sign_SECRETKEYBYTES)

    if (seed) sodium.crypto_sign_seed_keypair(publicKey, secretKey, seed)
    else sodium.crypto_sign_keypair(publicKey, secretKey)

    return {
        publicKey,
        secretKey
    }
}

function createToken () {
    const token = b4a.allocUnsafe(sodium.crypto_sign_BYTES);
    sodium.randombytes_buf(token);

    return token.toString('hex');
}

const createAuthServer = async ({port, host, seed, magiclink}) => {
    const keypair = createKeyPair(Buffer.from(seed, 'hex'));

    console.log(`Auth server pub key: ${keypair.publicKey.toString('hex')}`);

    const authz = ({ publicKey, token }) => {
        return {
            status: 'not-supported',
            token: ''
        }
    }

    const server = new SlashAuthServer({
        authz,
        magiclink,
        keypair,
        port,
        host
    });

    await server.start();

    console.log(`Auth server started listening on ${host}:${port}`);

    return server;
}

exports.createAuthServer = createAuthServer;
exports.createToken = createToken;
