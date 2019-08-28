// This is class also used in nodejs application!

const {broadcast, nodeInteraction, invokeScript, waitForTx} = require('@waves/waves-transactions');
const _isString = require('lodash/isString');
const _isInteger = require('lodash/isInteger');
const _isObject = require('lodash/isObject');
const _trim = require('lodash/trim');
const _escapeRegExp = require('lodash/escapeRegExp');
const axios = require('axios');
const _isArray = require('lodash/isArray');

const process400 = resp => resp.status === 400
    ? Promise.reject(Object.assign(new Error(), resp.data))
    : resp;
const validateStatus = status => status === 400 || status >= 200 && status < 300;

export default class WavesTransport {

    constructor(dal) {
        this.dal = dal;
        this.fee = 0.009;
        this.isKeeperAvailable = null;
        this.start = Date.now();

        this._cacheData = null;
        this._cacheTimeout = null;
        this._cacheCallbacks = null;

        this._height = null;
        this._heightTimeout = null;
        this._heightCallbacks = null;
    }

    getNodeUrl() {
        return this.dal.dAppNetwork === 'main' ? 'https://nodes.wavesplatform.com' : 'https://testnodes.wavesnodes.com';
    }

    static convertValueToJs(value) {
        return _isString(value) && ['{', '['].includes(value.substr(0, 1))
            ? JSON.parse(value)
            : value;
    }

    /**
     * Get WavesKeeper from window
     * @returns {Promise}
     */
    async getKeeper() {
        const checker = resolve => {
            if (this.isKeeperAvailable === true || window.WavesKeeper && window.WavesKeeper.publicState) {
                this.isKeeperAvailable = true;
                resolve(window.WavesKeeper);

            } else if (this.isKeeperAvailable === false || Date.now() - this.start > 1500) {
                this.isKeeperAvailable = false;
                resolve(null);
            }
            else if (this.isKeeperAvailable === null) {
                setTimeout(() => checker(resolve), 100);
            }
        };
        return new Promise(checker);
    }

    async nodeHeight() {
        if (this._height) {
            return this._height;
        }

        // Multi request detector
        if (_isArray(this._heightCallbacks)) {
            return new Promise(resolve => {
                this._heightCallbacks.push(resolve);
            });
        }
        this._heightCallbacks = [];

        // Fetch data
        this._height = await nodeInteraction.currentHeight(this.getNodeUrl());

        // Invalidate cache after 30 sec
        if (this._heightTimeout) {
            clearTimeout(this._heightTimeout);
        }
        this._heightTimeout = setTimeout(() => this._height = null, 10000);

        // Call callbacks
        this._heightCallbacks.forEach(resolve => resolve(this._height));
        this._heightCallbacks = null;

        return this._height;
    }

    async nodeAllData() {
        if (this._cacheData) {
            return this._cacheData;
        }

        // Multi request detector
        if (_isArray(this._cacheCallbacks)) {
            return new Promise(resolve => {
                this._cacheCallbacks.push(resolve);
            });
        }
        this._cacheCallbacks = [];

        // Fetch data
        this._cacheData = {};
        const data = await nodeInteraction.accountData(this.dal.dApp, this.getNodeUrl());
        Object.keys(data).forEach(key => {
            this._cacheData[key] = WavesTransport.convertValueToJs(data[key].value);
        });

        // Invalidate cache after 30 sec
        if (this._cacheTimeout) {
            clearTimeout(this._cacheTimeout);
        }
        this._cacheTimeout = setTimeout(() => this.resetCache(), 30000);

        // Call callbacks
        this._cacheCallbacks.forEach(resolve => resolve(this._cacheData));
        this._cacheCallbacks = null;

        return this._cacheData;
    }

    /**
     * Get node data by key
     * @param {string} key
     * @returns {Promise<null|string | number | boolean>}
     */
    async nodeFetchKey(key) {
        let result = null;
        if (this._cacheData) {
            result = {
                key,
                value: this._cacheData[key],
            };
        } else {
            try {
                result = await nodeInteraction.accountDataByKey(key, this.dal.dApp, this.getNodeUrl());
            } catch (e) {
                console.warn(e); // eslint-disable-line no-console
                return null;
            }
        }

        return result ? WavesTransport.convertValueToJs(result.value) : null;
    }

    /**
     * Get node data by multiple keys
     * @param {string[]} keys
     * @returns {Promise<null|string | number | boolean>}
     */
    async nodeFetchKeys(keys) {
        const regexpKeys = keys.map(key => _escapeRegExp(key));
        const regexp = new RegExp('^(' + regexpKeys.join('|') + ')$');
        const data = await this.nodeFetchPattern(regexp);

        return keys.map(key => data[key] || null);
    }

    async nodeFetchPattern(regexp) {
        if (this._cacheData) {
            const data = {};
            Object.keys(this._cacheData)
                .filter(key => regexp.test(key))
                .forEach(key => {
                    data[key] = this._cacheData[key];
                });
            return data;
        }

        const matches = encodeURIComponent(_trim(String(regexp), '/'));
        const result = await this._accountDataPattern(matches);
        const data = {};
        result.forEach(item => {
            data[item.key] = WavesTransport.convertValueToJs(item.value);
        });
        return data;
    }

    /**
     *
     * @param {string} method
     * @param {array} args
     * @param {number} payment
     * @param {boolean} waitTx
     * @returns {Promise}
     */
    async nodePublish(method, args, payment, waitTx = true) {
        const keeper = await this.getKeeper();
        const result = await keeper.signAndPublishTransaction(this._buildTransaction(method, args, payment));
        if (result) {
            if (!waitTx) {
                return result;
            }

            const tx = JSON.parse(result);
            this.dal.log(`Transaction ${tx.id} is published via keeper`);

            return waitForTx(tx.id, {
                apiBase: this.getNodeUrl()
            }).then(() => result);
        }
        return result;

    }

    /**
     *
     * @param {string} method
     * @param {array} args
     * @param {number} payment
     * @returns {Promise}
     */
    async nodeSign(method, args, payment) {
        const keeper = await this.getKeeper();
        return keeper.signTransaction(this._buildTransaction(method, args, payment));
    }

    /**
     *
     * @param {string} method
     * @param {array} args
     * @param {number} payment
     * @param {string} seed
     * @returns {Promise}
     */
    async nodePublishBySeed(method, args, payment, seed) {
        return invokeScript({
            dApp: this.dal.dApp,
            call: this._buildTransaction(method, args, payment).call,
        }, seed);
    }

    /**
     * @param {string|object} tx
     * @returns {Promise}
     */
    async broadcast(tx) {
        if (_isString(tx)) {
            tx = JSON.parse(tx);
        }

        let result = null;
        try {
            result = await broadcast(tx, this.getNodeUrl());
        } catch (e) {
            this.dal.error(e);
        }
        return result;
    }

    resetCache() {
        this._cacheData = null;
    }

    _buildTransaction(method, args, payment) {
        const transaction = {
            type: 16,
            data: {
                fee: {
                    assetId: 'WAVES',
                    tokens: String(this.fee),
                },
                dApp: this.dal.dApp,
                call: {
                    args: args.map(item => ({
                        type: _isInteger(item) ? 'integer' : 'string',
                        value: _isObject(item) ? JSON.stringify(item) : item,
                    })),
                    function: method
                },
                payment: !payment ? [] : [
                    {
                        assetId: 'WAVES',
                        tokens: String(payment),
                    }
                ],
            },
        };

        if (process.env.NODE_ENV !== 'production') {
            console.log('Transaction:', transaction); // eslint-disable-line no-console
        }

        return transaction;
    }

    async _accountDataPattern(matches) {
        return await axios.get(`addresses/data/${this.dal.dApp}?matches=${matches}`, {
            baseURL: this.getNodeUrl(),
            validateStatus
        })
            .then(process400)
            .then(x => x.data);
    }

    async _checkNetwork() {
        const keeper = await this.getKeeper();
        try {
            const data = await keeper.publicState();
            if (data && 'T' !== data.network.code) {
                throw new Error('Change network');
            }
        } catch (e) {
            throw e;
        }
    }

}
