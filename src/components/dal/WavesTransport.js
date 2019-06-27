import {broadcast, nodeInteraction} from '@waves/waves-transactions';
import _isString from 'lodash/isString';
import _isInteger from 'lodash/isInteger';
import _isObject from 'lodash/isObject';
import _trim from 'lodash/trim';
import axios from 'axios';

const process400 = resp => resp.status === 400
    ? Promise.reject(Object.assign(new Error(), resp.data))
    : resp;
const validateStatus = status => status === 400 || status >= 200 && status < 300;

export default class WavesTransport {

    constructor(dal) {
        this.dal = dal;
        this.nodeUrl = process.env.APP_NODE_URL || 'https://testnodes.wavesnodes.com';
    }

    /**
     * Get WavesKeeper from window
     * @returns {Promise}
     */
    async getKeeper() {
        const start = Date.now();
        const checker = resolve => {
            if (window.WavesKeeper && window.WavesKeeper.publicState) {
                resolve(window.WavesKeeper);
            } else if (Date.now() - start > 1500) {
                resolve(null);
            } else {
                setTimeout(() => checker(resolve), 100);
            }
        };
        return new Promise(checker);
    }

    /**
     * Get node data by key
     * @param {string} key
     * @returns {Promise<null|string | number | boolean>}
     */
    async nodeFetchKey(key) {
        let result = null;
        try {
            result = await nodeInteraction.accountDataByKey(key, this.dal.dApp, this.nodeUrl);
        } catch (e) {
            console.error(e); // eslint-disable-line no-console
            return null;
        }

        if (result && result.value) {
            return _isString(result.value) && ['{', '['].includes(result.value.substr(0, 1))
                ? JSON.parse(result.value)
                : result.value;
        }
        return null;
    }

    async nodeFetchPattern(regexp) {
        const matches = encodeURIComponent(_trim(String(regexp), '/'));
        const data = await this._accountDataPattern(matches);
        const result = {};
        data.forEach(item => {
            result[item.key] = item.value;
        });
        return result;
    }

    /**
     *
     * @param {string} method
     * @param {array} args
     * @param {array} payment
     * @returns {Promise}
     */
    async nodePublish(method, args, payment) {
        const keeper = await this.getKeeper();
        return keeper.signAndPublishTransaction(this._buildTransaction(method, args, payment));
    }

    /**
     *
     * @param {string} method
     * @param {array} args
     * @param {array} payment
     * @returns {Promise}
     */
    async nodeSign(method, args, payment) {
        const keeper = await this.getKeeper();
        return keeper.signTransaction(this._buildTransaction(method, args, payment));
    }

    /**
     * @param {string|object} tx
     * @returns {Promise}
     */
    async broadcast(tx) {
        if (_isString(tx)) {
            tx = JSON.parse(tx);
        }
        return broadcast(tx, this.nodeUrl);
    }

    _buildTransaction(method, args, payment) {
        const transaction = {
            type: 16,
            data: {
                fee: {
                    assetId: 'WAVES',
                    tokens: '0.009',
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
            baseURL: this.nodeUrl,
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
