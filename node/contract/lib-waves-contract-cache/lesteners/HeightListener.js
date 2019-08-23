const axios = require('axios');

module.exports = class HeightListener {

    constructor(params = {}) {
        this.app = null;
        this.intervalSec = params.intervalSec || 1;
        this.heightsHandler = params.heightsHandler || null;

        this._lastHeight = null;
        this._next = this._next.bind(this);
    }

    /**
     * @returns {Promise<void>}
     */
    async start() {
        return this._next();
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

            this.heightsHandler && this.heightsHandler(height);
        }

        // Next tick
        setTimeout(this._next, this.intervalSec * 1000);
    }

};
