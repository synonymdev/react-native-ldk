const { SlashAuthServer} = require('@slashtags/slashauth')
const b4a = require('b4a')
const sodium = require('sodium-universal')

const fancyUserDB = new Map(); //TODO actually make fancy

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
    const token = b4a.allocUnsafe(sodium.crypto_sign_BYTES)
    sodium.randombytes_buf(token)

    return token.toString('hex')
}

const createAuthServer = async ({port, host, seed}) => {
    console.log(fancyUserDB);

    const keypair = createKeyPair(Buffer.from(seed, 'hex'));

    console.log(`Auth server pub key: ${keypair.publicKey.toString('hex')}`);

    const authz = ({ publicKey, token: sessionToken }) => {
        console.log('\n**authz**')
        console.log(publicKey)
        console.log(sessionToken) //TODO do I need this?
        console.log('****\n')

        const bearerToken = createToken();

        // fancyUserDB.set(sessionToken, publicKey); //User has new session
        // fancySessionsDB.set(bearerToken, sessionToken); //Bearer token lookup for auth validation

        fancyUserDB.set(bearerToken, publicKey); //User has new session
        return {
            status: 'ok',
            token: bearerToken
        }
    }

    const magiclink = ({ publicKey }) => {
        return {
            status: 'ok',
            ml: 'http://localhost:8000/v0.1/users/123' //Unused for now
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
exports.createSessionToken = createToken;
exports.fancyUserDB = fancyUserDB;
