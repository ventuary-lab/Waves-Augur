const axios = require('axios');
const _trim = require('lodash/trim');
const _isString = require('lodash/isString');

const convertValueToJs = value => {
    return _isString(value) && ['{', '['].includes(value.substr(0, 1))
        ? JSON.parse(value)
        : value;
};

module.exports = class BaseCollection {

    constructor(params = {}) {
        this.app = params.app;
        this.name = params.name;

        this.STORAGE_KEY_PREFIX = 'collections:';
    }

    getKeys() {
        return [];
    }

    async _prepareItem(id, item) {
        return item;
    }

    async _prepareItemForUser(id, item, user) {
        return item;
    }

    async getItem(id, userAddress) {
        let item = await this.app.storage.hget(this.STORAGE_KEY_PREFIX + this.name, id);
        if (!item) {
            return null;
        }

        item = JSON.parse(item);
        if (userAddress || userAddress === null) {
            const user = userAddress ? this.app.collections.users.getItem(userAddress) : null;
            item = await this._prepareItemForUser(id, item, user);
        }
        return item;
    }

    async getItemsAll(userAddress) {
        const user = userAddress ? this.app.collections.users.getItem(userAddress) : null;
        const result = await this.app.storage.hgetall(this.STORAGE_KEY_PREFIX + this.name);
        if (!result) {
            return [];
        }

        return Promise.all(
            Object.keys(result).map(async id => {
                let item = JSON.parse(result[id]);
                if (userAddress || userAddress === null) {
                    item = await this._prepareItemForUser(id, item, user);
                }
                return item;
            })
        );
    }

    async updateAll(nodeData) {
        this.app.logger.debug('Update all items of ' + this.name + ' collection... ');

        // Get ids
        const ids = [];
        const idRegexp = new RegExp(this.getKeys()[0]);
        Object.keys(nodeData)
            .forEach(nodeKey => {
                const match = idRegexp.exec(nodeKey);
                if (match && match[1]) {
                    ids.push(match[1]);
                }
            });

        const data = {};
        ids.forEach(id => {
            data[id] = {};
            this.getKeys(id).forEach(key => {
                const keyRegexp = new RegExp(key);
                Object.keys(nodeData)
                    .forEach(nodeKey => {
                        const match = keyRegexp.exec(nodeKey);
                        if (match) {
                            data[id][nodeKey] = nodeData[nodeKey];
                        }
                    });
            });
        });

        await this._updateNext(Object.keys(data), data);
    }

    async updateByKeys(updatedKeys) {
        // Find primary key value, true = all
        let id = null;
        this.getKeys().forEach(key => {
            if (!id) {
                const regexp = new RegExp(key);
                const match = updatedKeys.find(key => regexp.exec(key));
                if (match) {
                    id = match[1] || true;
                }
            }
        });
        if (!id) {
            return;
        }

        if (id === true) {
            const ids = await this.app.storage.hkeys(this.STORAGE_KEY_PREFIX + this.name);
            await this._updateNext(ids);
        } else {
            await this._updateItem(id);
        }
    }

    async _updateNext(ids, data = {}, index = 0) {
        if (ids[index]) {
            await this._updateItem(ids[index], data[ids[index]]);
            this._updateNext(ids, data, index + 1);
        }
    }

    /**
     * @param {string} id
     * @param {object} data
     * @returns {Promise}
     * @private
     */
    async _updateItem(id, data = null) {
        this.app.logger.debug('Update item of ' + this.name + ' collection... ' + id);

        // Fetch data, if not set
        data = data || await this._fetch(this.getKeys(id));

        const item = await this._prepareItem(id, data);
        if (item) {
            await this.app.storage.hset(this.STORAGE_KEY_PREFIX + this.name, id, JSON.stringify(item));
        }
    }

    async _fetch(keys) {
        // Fetch data
        const regexp = new RegExp('^(' + keys.join('|') + ')$');
        const matches = encodeURIComponent(_trim(String(regexp), '/'));
        const response = await axios.get(`${this.app.nodeUrl}/addresses/data/${this.app.dApp}?matches=${matches}`);
        const data = {};
        response.data.forEach(item => {
            data[item.key] = convertValueToJs(item.value);
        });

        // Append height, if need
        if (keys.includes('height')) {
            data.height = this.app.contractCache.heightListener.getHeight();
        }

        return data;
    }

};
