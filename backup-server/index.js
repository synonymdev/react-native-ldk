const start = require('./src/server');

const HOST = '0.0.0.0';
const PORT = 3003;

start({host: HOST, port: PORT}).then(() => {
    console.log("Server started");
}).catch((error) => {
    process.exit(1);
});
