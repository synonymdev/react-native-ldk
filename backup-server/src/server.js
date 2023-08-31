const Fastify = require('fastify')

const FancyStorage = require('./fancyStorage.js');
const { formatFileSize } = require('./helpers.js');

let storage = new FancyStorage(); //TODO actually make fancy

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

let userDB = {
    'token123': 'user1',
};

const version = 'v1';

const fastify = Fastify({
    logger: true
})

// Declare a route
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
    url: '/auth',
    handler: async (request, reply) => {
        // reply.send({signThis: "HEY"});
        return {signThis: "HEY"};
    }
});

const authCheckHandler = async (request, reply) => {
    const token = request.headers.authorization;

    if (!token || !userDB[token]) {
        reply.code(401).send("Unauthorized");
        fastify.log.error("Unauthorized or missing token");
    }
}

fastify.route({
    method: 'POST',
    url: `/${version}/persist`,
    schema: {
        querystring,
        response: {
            200: {
                type: 'string'
            }
        }
    },
    preHandler: authCheckHandler,
    handler: async (request, reply) => {
        const {body, query, headers} = request;

        const {label, channelId, network} = query;
        const token = headers.authorization;
        const userId = userDB[token];

        let key = label;
        let subdir = '';
        if (label === 'channel_monitor') {
            key = channelId;
            subdir = 'channel_monitors';
        }

        storage.set({userId, network, subdir, key, value: body});

        fastify.log.info(`Saved ${formatFileSize(body.length)} for ${label}`);

        return {success: true};
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
    preHandler: authCheckHandler,
    handler: async (request, reply) => {
        const {body, query, headers} = request;

        const {label, channelId, network} = query;
        const token = headers.authorization;
        const userId = userDB[token];

        let key = label;
        let subdir = '';
        if (label === 'channel_monitor') {
            key = channelId;
            subdir = 'channel_monitors';
        }

        const backup = storage.get({userId, network, subdir, key});
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
    preHandler: authCheckHandler,
    handler: async (request, reply) => {
        const {query, headers} = request;

        const {network} = query;
        const token = headers.authorization;
        const userId = userDB[token];

        const list = storage.list({userId, network});
        const channelMonitorList = storage.list({userId, network, subdir: 'channel_monitors'});

        const allFiles = {
            list,
            channel_monitors: channelMonitorList
        }

        return allFiles;
    }
});

module.exports = async (host, port) => {
    try {
        await fastify.listen({ port, host });
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}
