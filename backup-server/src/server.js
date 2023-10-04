const Fastify = require('fastify')
const { deriveNodeId, signMessage } = require("ln-verifymessagejs");
const crypto = require('crypto');

const Storage = require('./storage');
const { formatFileSize } = require('./helpers');

const storage = new Storage({
    type: 'local',
    directory: './local-storage',
    bucketName: 'ldk-backups'
});

const users = new Map(); // bearer -> {pubkey, expires}
const challenges = new Map(); // pubkey -> {challenge, expires}

const signedMessagePrefix = 'react-native-ldk backup server auth:';

let labels = [
    'ping',
    'channel_manager',
    'channel_monitor',
    'peers',
    'unconfirmed_transactions',
    'broadcasted_transactions',
    'payment_ids',
    'spendable_outputs',
    'payments_claimed',
    'payments_sent',
    'bolt11_invoices',
];
let networks = ['bitcoin', 'testnet', 'regtest', 'signet'];

const version = 'v1';

let signingKey;

const fastify = Fastify({
    logger: true
});

fastify.get(`/${version}/status`, async function handler (request, reply) {
    return { hello: 'world' };
});

fastify.addContentTypeParser('application/octet-stream', { parseAs: 'buffer' }, async (request, payload) => {
    if (payload.length === 0) {
        return null;
    }
    return payload;
});

const querystring = {
    type: 'object',
    properties: {
        network: { type: 'string', enum: networks },
        label: { type: 'string', enum: labels },
        channelId: { type: 'string'},
    },
    required: ['network', 'label'],
};

fastify.route({
    method: 'POST',
    url: `/${version}/auth/challenge`,
    handler: async (request, reply) => {
        const {body, headers} = request;
        const pubkey = headers['public-key'];
        const {timestamp, signature} = body;

        if (!pubkey || !timestamp || !signature) {
            fastify.log.error("Missing public key, timestamp or signature");
            reply.code(400);
            return {error: "Missing public key, timestamp or signature"};
        }

        //Verify timestamp was signed by pubkey
        const derivedNodeId = deriveNodeId(signature, `${signedMessagePrefix}${timestamp}`);
        if (derivedNodeId !== pubkey) {
            fastify.log.error(`Expected ${pubkey} but got ${derivedNodeId}`);
            fastify.log.error("Unauthorized or invalid signature");
            reply.code(401);
            return {error: "Unauthorized"};
        }

        //Challenges don't need to live long, follow-up response should always be near instant
        const challenge = crypto.randomBytes(32).toString('hex');
        challenges.set(pubkey, {challenge, expires: Date.now() + 60 * 1000});

        return {challenge};
    }
});

fastify.route({
    method: 'POST',
    url: `/${version}/auth/response`,
    handler: async (request, reply) => {
        const {body, headers} = request;
        const pubkey = headers['public-key'];
        const signature = body['signature'];

        if (!challenges.has(pubkey) || challenges.get(pubkey).expires < Date.now()) {
            fastify.log.error("Missing or expired challenge");
            reply.code(400);
            return {error: "Missing or expired challenge"};
        }

        if (!signature) {
            fastify.log.error("Missing signature");
            reply.code(400);
            return {error: "Missing signature"};
        }

        const challenge = challenges.get(pubkey).challenge;

        //verify signature was signed by provided pubkey
        const derivedNodeId = deriveNodeId(signature, `${signedMessagePrefix}${challenge}`);
        if (derivedNodeId !== pubkey) {
            fastify.log.error(`Expected ${pubkey} but got ${derivedNodeId}`);
            fastify.log.error("Unauthorized or invalid signature");
            reply.code(401);
            return {error: "Unauthorized"};
        }

        const bearer = crypto.randomBytes(32).toString('hex');

        //Valid for 5min, should only be used for doing a restore
        const expires = Date.now() + 5 * 60 * 1000;
        users.set(bearer, {pubkey, expires});

        return {bearer, expires};
    }
});

const authRetrieveCheckHandler = async (request, reply) => {
    const bearerToken = request.headers.authorization;

    if (!bearerToken || !users.has(bearerToken)) {
        fastify.log.error("Unauthorized or missing token");
        reply.code(401);
        return reply.send({error: "Unauthorized"});
    }

    const {expires} = users.get(bearerToken);
    //Check if expired
    if (expires < Date.now()) {
        fastify.log.error("Expired token");
        reply.code(401);
        reply.send({error: "Expired token"});
    }
}

const signedPersistCheckHandler = async (request, reply) => {
    const {body, headers} = request;

    const signedHash = headers['signed-hash'];
    const pubkey = headers['public-key'];
    const clientChallenge = headers['challenge'];

    if (!signedHash || !pubkey || !clientChallenge) {
        fastify.log.error("Missing signed hash, public key or challenge");
        reply.code(400);
        return reply.send({error: "Missing signed hash, public key or challenge"});
    }

    //hash encrypted payload
    const hash = crypto.createHash('sha256').update(body).digest('hex');

    //verify signature was signed by provided pubkey
    const derivedNodeId = deriveNodeId(signedHash, `${signedMessagePrefix}${hash}`);

    if (derivedNodeId !== pubkey) {
        fastify.log.error(`Expected ${pubkey} but got ${derivedNodeId}`);
        fastify.log.error("Unauthorized or invalid signature");
        reply.code(401);
        return reply.send({error: "Unauthorized"});
    }
}

fastify.route({
    method: 'POST',
    url: `/${version}/persist`,
    schema: {
        querystring,
        response: {
            200: {
                type: 'object',
                properties: {
                    success: {type: 'boolean'},
                    signature: {type: 'string'},
                }
            }
        }
    },
    preHandler: signedPersistCheckHandler,
    handler: async (request, reply) => {
        const {body, query, headers} = request;

        const {label, channelId, network} = query;
        const pubkey = headers['public-key'];
        const clientChallenge = headers['challenge'];

        let key = label;
        let subdir = '';
        if (label === 'channel_monitor') {
            key = channelId;
            subdir = 'channel_monitors';
        }

        await storage.set({pubkey, network, subdir, key, value: body});
        fastify.log.info(`Saved ${formatFileSize(body.length)} for ${label}`);

        //Sign client challenge
        const signature = await signMessage(`${signedMessagePrefix}${clientChallenge}`, signingKey);

        return {success: true, signature};
    }
});

fastify.route({
    method: 'GET',
    url: `/${version}/retrieve`,
    schema: {
        querystring,
        response: {
            200: {}
        }
    },
    preHandler: authRetrieveCheckHandler,
    handler: async (request, reply) => {
        const {body, query, headers} = request;

        const {label, channelId, network} = query;
        const bearerToken = headers.authorization;
        const {pubkey} = users.get(bearerToken);

        let key = label;
        let subdir = '';
        if (label === 'channel_monitor') {
            key = channelId;
            subdir = 'channel_monitors';
        }

        const backup = await storage.get({pubkey, network, subdir, key});
        if (!backup) {
            reply.code(404).send("Backup not found");
            return;
        }

        fastify.log.info(`Retrieved ${formatFileSize(backup.length)} for ${label}`);

        //Rather use raw response because not sure what fastify is adding, but it's breaking the binary data when payload is encrypted
        reply.raw.setHeader('Content-Length', backup.length);
        reply.raw.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        reply.raw.end(backup, 'binary');
    }
});

fastify.route({
    method: 'GET',
    url: `/${version}/list`,
    schema: {
        querystring: {
            type: 'object',
            properties: {
                network: { type: 'string', enum: networks },
            },
            required: ['network'],
        },
    },
    preHandler: authRetrieveCheckHandler,
    handler: async (request, reply) => {
        const {query, headers} = request;

        const {network} = query;
        const bearerToken = headers.authorization;
        const {pubkey} = users.get(bearerToken);

        const list = await storage.list({pubkey, network});
        const channelMonitorList = await storage.list({pubkey, network, subdir: 'channel_monitors'});

        const allFiles = {
            list,
            channel_monitors: channelMonitorList
        }

        return allFiles;
    }
});

module.exports = async ({host, port, keypair}) => {
    const {secretKey, publicKey} = keypair;
    signingKey = secretKey;

    try {
        fastify.log.info(`Server pubkey to be hard coded on the client: ${publicKey}`);
        await fastify.listen({ port, host });
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}
