const crypto = require('crypto');

const HMAC_SECRET_KEY = process.env.FOR_HMAC_SECRET_KEY || '???';
console.log({ HMAC_SECRET_KEY });

class BasicRequestValidator {
    constructor () {
        this.HMAC_SECRET_KEY = HMAC_SECRET_KEY;
        this.hmac = crypto.createHmac('sha256', this.HMAC_SECRET_KEY);
    }

    isHmacPairEqual (inputKey) {
        const hmac = crypto.createHmac('sha256', inputKey);
        const inputDigest = hmac.digest('hex');
        const rootDigest = this.hmac.digest('hex');

        return inputDigest === rootDigest;
    }
}

module.exports = BasicRequestValidator;