const redis = require('redis');
const _toArray = require('lodash/toArray');
const BaseStorage = require('./BaseStorage');

module.exports = class RedisStorage extends BaseStorage {

    constructor(params = {}) {
        super(params);

        // Create redis connection
        this._namespace = params.namespace || 'waves-contract-cache';
        this._redisClient = redis.createClient(params.redis || {});
    }

    get(key) {
        return this._call('get', key);
    }

    set(key, value) {
        return this._call('set', key, value);
    }

    hget(key, field) {
        return this._call('hget', key, field);
    }

    hgetall(key) {
        return this._call('hgetall', key);
    }

    hkeys(key) {
        return this._call('hkeys', key);
    }

    hset(key, field, value) {
        return this._call('hset', key, field, value);
    }

    _call() {
        const args = _toArray(arguments);
        const method = args.shift();

        // Add namespace
        args[0] = this._namespace + ':' + args[0];

        return new Promise((resolve, reject) => {
            const callback = (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            };

            this._redisClient[method].apply(this._redisClient, args.concat(callback));
        });
    }

};
