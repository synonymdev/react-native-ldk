const start = require('./src/server');
require('dotenv').config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

if (!HOST || !PORT || !SECRET_KEY || !PUBLIC_KEY) {
    console.error('HOST, PORT, SECRET_KEY or PUBLIC_KEY environment variable is not set');
    process.exit(1);
}

start({host: HOST, port: PORT, keypair: {secretKey: SECRET_KEY, publicKey: PUBLIC_KEY}})
    .then(() => {
    console.log("Server started");
})
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
