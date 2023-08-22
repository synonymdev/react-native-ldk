const fs = require('fs');
const path = require('path');

class FancyStorage {
    constructor() {
        this.storageDirectory = path.join(__dirname, 'local-storage');

        if (!fs.existsSync(this.storageDirectory)) {
            fs.mkdirSync(this.storageDirectory);
        }
    }

    userFilePath(userId, network, subdir = "") {
        const directoryPath = path.join(this.storageDirectory + "/" + userId + "/" + network + "/" + subdir);
        console.log(directoryPath);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        return directoryPath;
    }

    set({userId, network, subdir, key, value}) {
        const filePath = path.join(this.userFilePath(userId, network, subdir), `${key}.bin`);

        fs.writeFileSync(filePath, value);
    }

    get({userId, network, subdir, key}) {
        const filePath = path.join(this.userFilePath(userId, network, subdir), `${key}.bin`);

        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'binary');
        } else {
            return null;
        }
    }

    list({userId, network}) {
        const directoryPath = path.join(this.userFilePath(userId, network, subdir));

        return fs.readdirSync(directoryPath);
    }
}

module.exports = FancyStorage;