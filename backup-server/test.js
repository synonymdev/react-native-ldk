const lnService = require('ln-service');
const crypto = require("crypto");
const { deriveNodeId } = require("ln-verifymessagejs");

const signedMessagePrefix = 'react-native-ldk backup server auth:';

const LND_MACAROON = process.env.LND_MACAROON;
const LND_SOCKET = process.env.LND_SOCKET;
const SERVER_PUBKEY = process.env.SERVER_PUBKEY;

if (!LND_MACAROON || !LND_SOCKET || !SERVER_PUBKEY) {
    console.error('LND_MACAROON or LND_SOCKET or SERVER_PUBKEY environment variable is not set');
    process.exit(1);
}

const {lnd} = lnService.authenticatedLndGrpc({
    macaroon: LND_MACAROON,
    socket: LND_SOCKET,
});

const getNodePubKey = async () => {
    const {public_key} = await lnService.getWalletInfo({lnd});
    return public_key;
}

const nodeSign = async (message) => {
    const {signature} = await lnService.signMessage({lnd,message: `${signedMessagePrefix}${message}`});
    return signature;
}

const uploadBackup = async ({server, pubkey, content}) => {
    //Post bytes to server
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    const signedHash = await nodeSign(hash);

    //Hash of client pubkey + timestamp
    const clientChallenge = crypto.createHash('sha256').update(Buffer.from(pubkey + Date.now(), 'utf8')).digest('hex');

    const res = await fetch(`${server}/persist?network=regtest&label=ping`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Public-Key': pubkey,
            'Signed-Hash': signedHash,
            'Challenge': clientChallenge,
        },
        body: content
    });

    //Check status is 200
    if (res.status !== 200) {
        throw new Error(`Expected 200 but got ${res.status}`);
    }

    //Verify server signed challenge returned in body
    const body = await res.json();
    const serverSignature = body.signature;

    if (!serverSignature) {
        throw new Error('No signature found in response');
    }

    const derivedNodeId = deriveNodeId(serverSignature, `${signedMessagePrefix}${clientChallenge}`);
    if (derivedNodeId !== SERVER_PUBKEY) {
        throw new Error(`Derived node id ${derivedNodeId} does not match server pubkey ${SERVER_PUBKEY}`);
    }
}

const fetchChallenge = async ({server, pubkey}) => {
    const url = `${server}/auth/challenge`;
    const headers = {
        'Content-Type': 'application/json',
        'Public-Key': pubkey
    };

    const timestamp = Date.now();
    const payload = {
        timestamp,
        signature: await nodeSign(timestamp),
    }

    const res = await fetch(url, {headers, method: 'POST', body: JSON.stringify(payload)});
    const body = await res.json();
    if (!body.challenge) {
        console.log(JSON.stringify(body));
        throw new Error('No challenge found in response');
    }

    return body.challenge;
}

const fetchBearerToken = async ({server, pubkey, signature}) => {
    const url = `${server}/auth/response`;
    const headers = {
        'Content-Type': 'application/json',
        'Public-Key': pubkey,
    };

    const res = await fetch(url, {headers, method: 'POST', body: JSON.stringify({signature})});
    const body = await res.json();
    if (!body.bearer) {
        console.log(JSON.stringify(body))
        throw new Error('No bearer found in response');
    }

    return body.bearer;
}

const fetchBackupList = async ({server, bearer}) => {
    const url = `${server}/list?network=regtest`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': bearer,
    };

    const res = await fetch(url, {headers});
    const body = await res.json();
    if (!body.list || !body.channel_monitors) {
        console.log(JSON.stringify(body));
        throw new Error('No list or channel_monitors found in response');
    }

    return body;
}

const fetchBackupContent = async ({server, bearer}) => {
    const url = `${server}/retrieve?network=regtest&label=ping`;
    const headers = {
        'Content-Type': 'application/octet-stream',
        'Authorization': bearer,
    };

    const res = await fetch(url, {headers});
    const body = await res.arrayBuffer();
    if (!body) {
        console.log(JSON.stringify(body));
        throw new Error('No body found in response');
    }

    return body;
}

const server = 'http://0.0.0.0:3003/v1';

const test = async () => {
    const pubkey = await getNodePubKey();
    console.log('nodeID: ', pubkey);

    //Random content to store
    const testContent = 'test random content ' + Math.random().toString(36).substring(7); //On mobile this will be encrypted
    await uploadBackup({server, pubkey, content: Buffer.from(testContent, 'utf8')});

    //Now retrieve backup
    const challenge = await fetchChallenge({server, pubkey});
    console.log('challenge: ', challenge);
    const signature = await nodeSign(challenge);
    console.log('signature: ', signature);
    const bearer = await fetchBearerToken({server, pubkey, signature});
    console.log('bearer: ', bearer);
    const backupList = await fetchBackupList({server, bearer});
    console.log('backupList: ', backupList);
    const pingFilename = backupList.list.find((file) => file === 'ping.bin');
    if (!pingFilename) {
        throw new Error('ping.bin not found in backupList');
    }
    const backupBytes = await fetchBackupContent({server, bearer});
    const backupString = new TextDecoder().decode(backupBytes);
    if (backupString !== testContent) {
        throw new Error(`Expected backup content ${testContent} but got ${backupString}`);
    }
}

test()
    .then(() => {
        console.log("Test Success ✅");
    }).catch((error) => {
        console.error("Test fail ❌ ", error);
    });
