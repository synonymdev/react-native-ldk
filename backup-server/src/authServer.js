const { crypto, SlashAuthServer} = require('@slashtags/slashauth')

const testToken = 'Bearer 123';

const testAuthServer = async () => {
    const staticTestSeed = Buffer.alloc(32);
    const keypair = crypto.createKeyPair(staticTestSeed)

    const hexPubKey = keypair.publicKey.toString('hex');

    console.log(hexPubKey);

    const authz = ({ publicKey, token, signature }) => {
        // NOTE: by the moment this method will be called signature will alreayd be verified
        return {
            status: 'ok',
            token: testToken
        }
    }

    const magiclink = (publicKey) => {
        // NOTE: by the moment this method will be called signature will already be verified
        return {
            status: 'ok',
            ml: 'http://localhost:8000/v0.1/users/123'
        }
    }

    const server = new SlashAuthServer({
        authz,
        magiclink,
        keypair,
        port: 8000,
        host: '0.0.0.0'
        // sv - object with sign(data, secretKey) and verify(signature, data, publicKey) methods
        // storage - storage for <pK>: <nonce> pairs with methods (default Map)
        //    - async set(publicKey, token)
        //    - async get(publicKey)
        //    - async delete(publicKey)
        // port - to run server on (default 8000)
        // host - to run server on (default localhost)
        // route - route for auth (default auth)
        // version - version of auth (default v0.1)
    });

    await server.start();

    const slashauthURL = server.formatUrl(testToken)

    console.log(slashauthURL);
}

testAuthServer();
