const { SlashAuthClient, crypto } = require('@slashtags/slashauth')

const serverPubKey = '3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29';

const getAuthToken = async (request, reply) => {
    // const res = await fetch('http://192.168.0.102:8000/auth', {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({}),
    // });
    //
    // //Read response as json
    // const json = await res.json();
    //
    // console.log(json);


    // create keyPair
    const keypair = crypto.createKeyPair()
    // console.log(keyPair.publicKey);
    // // use authServer's publicKey for pinning
    // const client = new SlashAuthClient({ keyPair, remotePublicKey: Buffer.from(serverPubKey, 'hex') })

    // const response = await client.authz(slashauthURL)
    // // { status: 'ok', token: 'Bearer 123' }
    //
    // const link = await client.magiclik(slashauthURL)
    // { status: 'ok', ml: 'https://www.example.com?q=foobar' }

    const client = new SlashAuthClient({
        keypair,
        serverPublicKey: Buffer.from(serverPubKey, 'hex')
    });

    const magicLinkUrl = "http://0.0.0.0:8000/v0.1/auth?token=Bearer%20123";
    const authzRes = await client.authz(magicLinkUrl)

    const magicLinkRes = await client.magiclink(magicLinkUrl)
}

getAuthToken().catch((error) => {
    console.log(error);
});
