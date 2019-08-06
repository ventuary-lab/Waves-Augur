const redis = require('redis');
const BaseStorage = require('./BaseStorage');

module.exports = class RedisStorage extends BaseStorage {

    constructor(params = {}) {
        super(params);

        // Create redis connection
        this._namespace = params.namespace || 'waves-contract-cache';
        this._redisClient = redis.createClient(params.redis || {});
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this._redisClient.get(this._namespace + ':' + key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply || null);
                }
            });
        });
    }

    set(key, value) {
        return new Promise((resolve, reject) => {
            this._redisClient.set(this._namespace + ':' + key, value, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

};
