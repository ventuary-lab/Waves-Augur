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

    async getEncryptedPass (password, salt = 'salt') {
        const { algorithm, encodingForHashed, initialVectorSize } = this;

        const iv = Buffer.alloc(initialVectorSize, 0);
        const key = await scrypt.async(password, salt, Math.pow(2, 10), 8, 1, 24);

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = '';
        cipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipher.read())) {
                encrypted += chunk.toString(encodingForHashed);
            }
        });

        cipher.write(password);
        cipher.end();

        return {
            encrypted,
            key
        };
    }

    getDecryptedPass (key, hash) {
        const { algorithm, encodingForHashed, encodingForUnhashed, initialVectorSize } = this;

        const iv = Buffer.alloc(initialVectorSize, 0);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

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
    const salt = 'asdsfsdad3123vk)(#*$d';

    const { encrypted, key } = await kHandler.getEncryptedPass(password, salt);
    const { decrypted } = kHandler.getDecryptedPass(key, encrypted);

    console.log({ encrypted, decrypted });
}

export default KeeperHandler;