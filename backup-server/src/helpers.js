const lnService = require('ln-service');

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

//TODO if signing can be done without a node replace this
const LND_MACAROON = process.env.LND_MACAROON;
const LND_SOCKET = process.env.LND_SOCKET;

if (!LND_MACAROON || !LND_SOCKET) {
    console.error('LND_MACAROON or LND_SOCKET environment variable is not set');
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
    const {signature} = await lnService.signMessage({lnd,message});
    return signature;
}


exports.formatFileSize = formatFileSize;
exports.getNodePubKey = getNodePubKey;
exports.nodeSign = nodeSign;
