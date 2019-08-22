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
        this.transport = params.transport;
        this.name = params.name;
        this.updateHandler = params.updateHandler;

        this.STORAGE_KEY_PREFIX = 'collections:';
    }

    getKeys() {
        return [];
    }

    async _prepareItem(id, item) {
        return item;
    }

    async _postProcessItem(id, item) {
        return item;
    }

    async getItem(id) {
        let item = await this.app.storage.hget(this.STORAGE_KEY_PREFIX + this.name, id);
        if (!item) {
            return null;
        }

        item = JSON.parse(item);
        item.id = id;
        item = await this._postProcessItem(id, item);
        return item;
    }

    async getItemsAll() {
        const result = await this.app.storage.hgetall(this.STORAGE_KEY_PREFIX + this.name);
        if (!result) {
            return [];
        }

        return Promise.all(
            Object.keys(result).map(async id => {
                let item = JSON.parse(result[id]);
                item.id = id;
                item = await this._postProcessItem(id, item);
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
        const ids = [];
        this.getKeys().forEach(key => {
            const regexp = new RegExp(key);
            updatedKeys.forEach(updatedKey => {
                const match = regexp.exec(updatedKey);
                const id = match && match[1];
                if (id && !ids.includes(id)) {
                    ids.push(id);
                }
            });
        });
        if (ids.length > 0) {
            await this._updateNext(ids);
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
            const nextJson = JSON.stringify(item);
            if (this.updateHandler) {
                const prevJson = await this.app.storage.hget(this.STORAGE_KEY_PREFIX + this.name, id);
                if (!prevJson || prevJson !== nextJson) {
                    this.updateHandler(id, item, this);
                }
            }
            await this.app.storage.hset(this.STORAGE_KEY_PREFIX + this.name, id, nextJson);
        }
    }

    async _fetch(keys) {
        // Fetch data
        const data = await this.transport.fetchKeys(keys);

        // Append height, if need
        if (keys.includes('height')) {
            data.height = this.app.contractCache.heightListener.getHeight();
        }

        return data;
    }

};
