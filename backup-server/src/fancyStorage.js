const fs = require('fs');
const path = require('path');

class FancyStorage {
    constructor() {
        this.storageDirectory = path.join(__dirname, '../local-storage');

        if (!fs.existsSync(this.storageDirectory)) {
            fs.mkdirSync(this.storageDirectory);
        }
    }

    userFilePath(pubkey, network, subdir = "") {
        const directoryPath = path.join(this.storageDirectory + "/" + pubkey + "/" + network + "/" + subdir);
        console.log(directoryPath);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        return directoryPath;
    }

    set({pubkey, network, subdir, key, value}) {
        const filePath = path.join(this.userFilePath(pubkey, network, subdir), `${key}.bin`);

        fs.writeFileSync(filePath, value);
    }

    get({pubkey, network, subdir, key}) {
        const filePath = path.join(this.userFilePath(pubkey, network, subdir), `${key}.bin`);

        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'binary');
        } else {
            return null;
        }
    }

    list({pubkey, network, subdir}) {
        const directoryPath = path.join(this.userFilePath(pubkey, network, subdir));

        return fs.readdirSync(directoryPath).filter(file => file.endsWith('.bin'));
    }
}

module.exports = FancyStorage;
