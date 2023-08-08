const http = require('http');
const url = require('url');

let fancyStorage = {}; //TODO actually make fancy

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url.startsWith('/persist')) {
        const urlParams = url.parse(req.url, true).query;
        const label = urlParams.label;

        if (!label) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Label is required');
            return;
        }

        let body = Buffer.from([]);
   
        req.on('data', (chunk) => {
            body = Buffer.concat([body, chunk]);
        });

        req.on('end', () => {
            console.log('Received backup for: ' + label + ' with size: ' + formatFileSize(body.length));

            fancyStorage[label] = body;

            res.writeHead(200, { 'Content-Type': 'text/plain' }); 
            res.end('success');
            return;
        });
    } else if (req.method === 'GET' && req.url.startsWith('/retrieve')) {
        const urlParams = url.parse(req.url, true).query;
        const label = urlParams.label;

        const backup = fancyStorage[label];
        if (!backup) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Backup not found');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        res.end(backup);
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method not allowed');
        console.log('Url not allowed: ' + req.url);
        return;
    }
});

server.listen(3003, () => {
  console.log('Server is running on port 3003');
});

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
