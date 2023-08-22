const http = require('http');
const url = require('url');
const FancyStorage = require('./fancyStorage.js');

let storage = new FancyStorage(); //TODO actually make fancy

let lables = ['channel-manager', 'channel-monitor'];
let networks = ['bitcoin', 'testnet', 'regtest', 'signet'];

let userId = 'user1'; //TODO add to auth link

const server = http.createServer((req, res) => {
    //TODO auth request

    if (req.method === 'POST' && req.url.startsWith('/persist')) {
        const urlParams = url.parse(req.url, true).query;
        
        try {
            validateParams(urlParams);
        } catch (error) {
            console.error(error);
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(error.message);
            return;
        }

        const network = urlParams.network;
        const label = urlParams.label;
        const channelId = urlParams.id;

        let body = Buffer.from([]);
   
        req.on('data', (chunk) => {
            body = Buffer.concat([body, chunk]);
        });

        req.on('end', () => {
            console.log('Received backup for: ' + label + ' with size: ' + formatFileSize(body.length));

            let key = label;
            let subdir = '';
            if (label == 'channel-monitor') {
                key = channelId;
                subdir = 'channel-monitors';
            }

            storage.set({userId, network, subdir, key, value: body});

            res.writeHead(200, { 'Content-Type': 'text/plain' }); 
            res.end('success');
        });

        return;
    }
    
    if (req.method === 'GET' && req.url.startsWith('/retrieve')) {
        const urlParams = url.parse(req.url, true).query;
       
        try {
            validateParams(urlParams);
        } catch (error) {
            console.error(error);
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(error.message);
            return;
        }

        const network = urlParams.network;
        const label = urlParams.label;
        const channelId = urlParams.id;

        let key = label;
        let subdir = '';
        if (label == 'channel-monitor') {
            key = channelId;
            subdir = 'channel-monitors';
        }

        const backup = storage.get({userId, network, key});
        if (!backup) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Backup not found');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        res.end(backup);
        return;
    }

    //TODO expose list channel monitors
    
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
    console.log('URL not allowed: ' + req.url);
});

server.listen(3003, () => {
  console.log('Server is running on port 3003');
});

function validateParams(params) {
    const network = params.network;
    const label = params.label;
    const channelId = params.id;
    const token = params.id; //TODO

    if (!network || !networks.includes(network)) {
        throw Error(`Network must be one of:  ${networks.join(', ')}`);
    }

    if (!label || !lables.includes(label)) {
        throw Error(`Label must be one of:  ${lables.join(', ')}`);
    }
    
    if (label === 'channel-monitor' && !channelId) {
        throw Error('Missing channel id parameter');
    }

    // if (!token) {
    //     throw Error('Missing token parameter');
    // }
}

function formatFileSize(bytes) {
    if (bytes < 1024) {
        return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}
