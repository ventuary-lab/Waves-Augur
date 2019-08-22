const _isString = require('lodash/isString');
const _trim = require('lodash/trim');
const axios = require('axios');

const convertValueToJs = (value) => {
    return _isString(value) && ['{', '['].includes(value.substr(0, 1))
        ? JSON.parse(value)
        : value;
};

class WavesTransport {

    constructor(params) {
        this.dApp = params.dApp;
        this.nodeUrl = params.nodeUrl;
    }

    async fetchAll() {
        const response = await this._request(`${this.nodeUrl}/addresses/data/${this.dApp}`);
        const nodeData = {};
        response.data.forEach(item => {
            nodeData[item.key] = convertValueToJs(item.value);
        });
        return nodeData;
    }

    async fetchKeys(keys) {
        const regexp = new RegExp('^(' + keys.join('|') + ')$');
        const matches = encodeURIComponent(_trim(String(regexp), '/'));
        const response = await this._request(`${this.nodeUrl}/addresses/data/${this.dApp}?matches=${matches}`);

        const data = {};
        response.data.forEach(item => {
            data[item.key] = convertValueToJs(item.value);
        });
        return data;
    }

    async _request(url) {
        try {
            return await axios.get(url);
        } catch (e) {
            console.error(`WavesTransport Error, url "${url}": ${String(e)}`);
            throw e;
        }
    }

}

module.exports = WavesTransport;
