const axios = require('axios');

module.exports = class HeightListener {

    constructor(params = {}) {
        this.app = null;
        this.intervalSec = params.intervalSec || 1;
        this.heightsHandler = params.heightsHandler || null;
        this.storage = null;

        this._lastHeight = null;
        this._next = this._next.bind(this);

        this.STORAGE_LAST_HEIGHT_KEY = '__lastHeight';
    }

    /**
     * @returns {Promise<void>}
     */
    async start() {
        const height = await this.storage.get(this.STORAGE_LAST_HEIGHT_KEY);
        if (height) {
            this._lastHeight = parseInt(height);
        }

        this.app.logger.info('HeightListener: Last height: ' + (height || 'none'));

        this._next();

        return true;
    }

    getHeight() {
        return this._lastHeight;
    }

    /**
     * @returns {Promise<void>}
     * @private
     */
    async _next() {
        let response = null;
        try {
            response = await axios.get(`${this.app.nodeUrl}/blocks/height`);
        } catch (e) {
            console.error(`HeightListener Error on fetch height: ${String(e)}`);
            throw e;
        }
        const height = response.data.height;

        if (!this._lastHeight || this._lastHeight !== height) {
            this._lastHeight = height;
            this.storage.set(this.STORAGE_LAST_HEIGHT_KEY, this._lastHeight);

            this.heightsHandler && this.heightsHandler(height);
        }

        // Next tick
        setTimeout(this._next, this.intervalSec * 1000);
    }

};
