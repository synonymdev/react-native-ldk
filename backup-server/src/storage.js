const path = require('path');
const {Storage: AbstractStorage} = require("@tweedegolf/storage-abstraction");

class Storage {
    constructor(options) {
        this.storage = new AbstractStorage(options);
    }

    getFilePath({pubkey, network, subdir, filename}) {
        let dir = path.join(pubkey + "/" + network);
        if (subdir) {
            dir = path.join(dir + "/" + subdir);
        }
        if (filename) {
            dir = path.join(dir + "/" + filename);
        }

        return dir;
    }

     async readFile(readableStream) {
        const chunks = [];

        return new Promise((resolve, reject) => {
            readableStream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            readableStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve(buffer);
            });

            readableStream.on('error', (error) => {
                reject(error);
            });
        });
    }

    async set({pubkey, network, subdir, key, value}) {
        const filePath = this.getFilePath({pubkey, network, subdir, filename: `${key}.bin`});
        await this.storage.addFileFromBuffer(value, filePath);
    }

    async get({pubkey, network, subdir, key}) {
        const filePath = this.getFilePath({pubkey, network, subdir, filename: `${key}.bin`});

        if (!(await this.storage.fileExists(filePath))) {
            return null;
        }

        const readableStream = await this.storage.getFileAsReadable(filePath);
        return this.readFile(readableStream);
    }

    async list({pubkey, network, subdir}) {
        const filePath = this.getFilePath({pubkey, network, subdir});

        //TODO must be a better way instead of iterating over all files
        let files = [];
        const list = await this.storage.listFiles();
        list.forEach((file) => {
            const [fileName] = file;
            if (fileName.startsWith(filePath) && fileName.endsWith('.bin')) {
                files.push(fileName.substring(fileName.lastIndexOf('/') + 1));
            }
        });

        return files;
    }
}

module.exports = Storage;
