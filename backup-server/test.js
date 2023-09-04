const { SlashAuthClient } = require('@slashtags/slashauth-client')
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

const getBearerAuthToken = async ({backupServer, seed}) => {
    const res = await fetch(`${backupServer}/auth`)
    const body = await res.json()
    if (!body.slashauth) {
        console.log(body);
        throw new Error('No slashauth found in response')
    }

    const slashauthURL = body.slashauth;

    console.log(slashauthURL);

    const seedBuffer = Buffer.from(seed, 'hex')
    const keypair = createKeyPair(seedBuffer)

    // use authServer's publicKey for pinning
    const client = new SlashAuthClient({ keypair })

    // const {status, token} = await client.authz(slashauthURL)
    const { status, bearer } = await client.magiclink(slashauthURL);

    if (status !== 'ok') {
        throw new Error('Authz failed')
    }

   console.log("Using bearer token: " + bearer);

   return bearer;
}

const testBackup = async (bearerToken) => {
    //Post bytes to server
    const testContent = 'test random content' + Math.random().toString(36).substring(7);

    const backupRes = await fetch(`${backupServer}/persist?network=regtest&label=ping`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': bearerToken
        },
        body: Buffer.from(testContent, 'utf8')
    });

    if (backupRes.status !== 200) {
        throw new Error(`Backup failed: ${backupRes.status}`);
    }

    //Fetch bytes from backup server and check them
    const backupFetchRes = await fetch(`${backupServer}/retrieve?network=regtest&label=ping`, {
        method: 'GET',
        headers: {
            'Authorization': bearerToken
        }
    });

    if (backupFetchRes.status !== 200) {
        throw new Error(`Backup fetch failed: ${backupFetchRes.status}`);
    }

    const backupFetchBody = await backupFetchRes.arrayBuffer();
    const content = Buffer.from(backupFetchBody).toString('utf8');
    if (content !== testContent) {
        throw new Error(`Backup fetch content invalid: ${backupFetchBody}`);
    }

    console.log("Backup persisted and fetched successfully ✅");
}

const clientSeed = '5a9b34dc1975419e85b9b3924e31485f1ba1095be7fc596dedee8a6ee5748dec';
const backupServer = 'http://0.0.0.0:3003/v1';

getBearerAuthToken({backupServer, seed: clientSeed})
    .then((bearerToken) => {
        testBackup(bearerToken)
            .catch((error) => {
                console.log(error);
            });
    })
        .catch((error) => {
        console.log(error);
    });
