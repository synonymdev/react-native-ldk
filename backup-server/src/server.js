const Fastify = require('fastify')

const FancyStorage = require('./fancyStorage.js');
const { formatFileSize } = require('./helpers.js');

let storage = new FancyStorage(); //TODO actually make fancy

let labels = ['channel-manager', 'channel-monitor'];
let networks = ['bitcoin', 'testnet', 'regtest', 'signet'];

let userDB = {
    'token123': 'user1',
};

const version = 'v1'; //TODO

const fastify = Fastify({
    logger: true
})

// Declare a route
fastify.get('/status', async function handler (request, reply) {
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
    url: '/persist',
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
        console.log("\n\n****persist handler*****\n\n");
        const {body, query, headers} = request;

        const {label, channelId, network} = query;
        const token = headers.authorization;
        const userId = userDB[token];

        let key = label;
        let subdir = '';
        if (label === 'channel-monitor') {
            key = channelId;
            subdir = 'channel-monitors';
        }

        storage.set({userId, network, subdir, key, value: body});

        fastify.log.info(`Saved ${formatFileSize(body.length)} for ${label}`);

        return {success: true};
    }
});

fastify.route({
    method: 'GET',
    url: '/retrieve',
    schema: {
        querystring,
        response: {
            200: {}
        }
    },
    preHandler: authCheckHandler,
    handler: async (request, reply) => {
        console.log("\n\n****retrieve handler*****\n\n");

        const {body, query, headers} = request;

        const {label, channelId, network} = query;
        const token = headers.authorization;
        const userId = userDB[token];

        let key = label;
        let subdir = '';
        if (label === 'channel-monitor') {
            key = channelId;
            subdir = 'channel-monitors';
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

module.exports = async (host, port) => {
    try {
        await fastify.listen({ port, host });
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}
