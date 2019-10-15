const crypto = require('crypto-browserify');
const Buffer = require('buffer').Buffer;
const scrypt = require('scryptsy');

class KeeperHandler {
    constructor () {
        this.algorithm = 'aes-192-ctr';

        this.initialVectorSize = 16; // in octets

        this.encodingForHashed = 'hex';
        this.encodingForUnhashed = 'utf8';
    }

    async getCipherKey (password) {
        // return await scrypt.async(password, salt, Math.pow(2, 10), 8, 1, 24);
    }

    async getEncryptedPass (password, salt = 'asdsfsdad3123vk)(#*$d') {
        const { algorithm, encodingForHashed, initialVectorSize } = this;

        const iv = Buffer.alloc(initialVectorSize, 0);
        const key = await scrypt.async(password, 'salt', Math.pow(2, 10), 8, 1, 24);

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = '';
        cipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipher.read())) {
                encrypted += chunk.toString(encodingForHashed);
            }
        });

        cipher.write(salt);
        cipher.end();
        // toString('hex')
        return {
            encrypted
        };
    }

    async getDecryptedPass (hash, password) {
        const { algorithm, encodingForHashed, encodingForUnhashed, initialVectorSize } = this;

        const iv = Buffer.alloc(initialVectorSize, 0);

        const key = await scrypt.async(password, 'salt', Math.pow(2, 10), 8, 1, 24);
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);

        let decrypted = '';
        decipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString(encodingForUnhashed);
            }
        });

        decipher.write(hash, encodingForHashed);
        decipher.end();

        return { decrypted };
    }
}

async function main () {
    const password = 'Lorem ipsum';
    const kHandler = new KeeperHandler();
    const seed = 'asdsfsdad3123vk)(#*$d';

    const { encrypted } = await kHandler.getEncryptedPass(password, seed);
    const { decrypted } = await kHandler.getDecryptedPass(encrypted, password);

    console.log({ encrypted, decrypted });
}

export default KeeperHandler;