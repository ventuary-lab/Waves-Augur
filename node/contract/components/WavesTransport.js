const _isString = require('lodash/isString');
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
        const response = await axios.get(`${this.nodeUrl}/addresses/data/${this.dApp}`);
        const nodeData = {};
        response.data.forEach(item => {
            nodeData[item.key] = convertValueToJs(item.value);
        });
        return nodeData;
    }

}

module.exports = WavesTransport;
