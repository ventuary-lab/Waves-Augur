const crypto = require('crypto-browserify');
const Buffer = require('buffer').Buffer;
const scrypt = require('scryptsy');

class KeeperHandler {
    constructor () {
        this.algorithm = 'aes-192-ctr';

        this.initialVectorSize = Buffer.alloc(16, 0);

        this.encodingForHashed = 'hex';
        this.encodingForUnhashed = 'utf8';
    }

    async getEncryptedPass (password, salt = 'salt') {
        const { algorithm, encodingForHashed } = this;

        const iv = Buffer.alloc(16, 0);
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

    async getDecryptedPass (key, hash) {
        const { algorithm, encodingForUnhashed } = this;

        const iv = Buffer.alloc(16, 0);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        let decrypted = '';
        decipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString(encodingForUnhashed);
            }
        });

        decipher.write(hash, 'hex');
        decipher.end();

        return { decrypted };
    }
}

async function main () {
    const password = 'Lorem ipsum';
    const kHandler = new KeeperHandler();
    const salt = 'asdsfsdad3123vk)(#*$d';

    const { encrypted, key } = await kHandler.getEncryptedPass(password, salt);
    const { decrypted } = await kHandler.getDecryptedPass(key, encrypted);

    console.log({ encrypted, decrypted });
}

main();
