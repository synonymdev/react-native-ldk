const start = require('./src/server');

const HOST = '0.0.0.0';
const PORT = 3003;
const AUTH_PORT = 3004;
const AUTH_SERVER_SEED = '09c2a8437fd9e6e2c7244a8f953270a168a428e903fdfb25b93ff2bec05353e0';

start({host: HOST, port: PORT, authPort: AUTH_PORT, seed: AUTH_SERVER_SEED}).then(() => {
    console.log("Server started");
}).catch((error) => {
    process.exit(1);
});
