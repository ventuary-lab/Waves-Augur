const axios = require('axios');

module.exports = class TransactionListener {

    constructor(params = {}) {
        this.app = null;
        this.intervalSec = params.intervalSec || 1;
        this.transactionsHandler = params.transactionsHandler || null;
        this.storage = null;

        this._lastTransactionId = null;
        this._next = this._next.bind(this);

        this.STORAGE_LAST_TRANSACTION_ID_KEY = '__lastTransactionId';
    }

    /**
     * @returns {Promise<void>}
     */
    async start() {
        let lastTransactionId = await this.storage.get(this.STORAGE_LAST_TRANSACTION_ID_KEY);
        this._lastTransactionId = lastTransactionId;

        this.app.logger.info('TransactionListener: Last transaction id: ' + (lastTransactionId || 'none (listen from end)'));

        // Get last transaction
        if (!lastTransactionId) {
            const transactions = await this._fetch();
            if (transactions.length > 0) {
                this._lastTransactionId = transactions[0].id;
                await this.storage.set(this.STORAGE_LAST_TRANSACTION_ID_KEY, this._lastTransactionId);
            }
        }

        // Start transactionListener
        this._next();

        return true;
    }

    /**
     * @returns {Promise<void>}
     * @private
     */
    async _next() {
        //this._lastTransactionId = '3Mgd7TwYEWp9jtygKwuNj1JP4PabpKYFsbpbdoc8hgWp'; // FOR DEBUG

        // Fetch transactions
        const transactions = await this._fetch(this._lastTransactionId);
        if (transactions.length > 0) {
            this._lastTransactionId = transactions[0].id;
            this.storage.set(this.STORAGE_LAST_TRANSACTION_ID_KEY, this._lastTransactionId);
        }

        // Trigger events with new transactions
        if (this.transactionsHandler) {
            const appTransactions = transactions.filter(item => item.dApp === this.app.dApp && item.call);
            if (appTransactions.length > 0) {
                this.transactionsHandler(transactions.reverse());
            }
        }

        // Next tick
        setTimeout(this._next, this.intervalSec * 1000);
    }

    /**
     * @param {string|null} lastTransactionId
     * @param {string|null} afterId
     * @param {number} pageSize
     * @returns {Promise<[]>}
     * @private
     */
    async _fetch(lastTransactionId = null, afterId = null, pageSize = 1) {
        // Remote request
        const query = afterId ? '?after=' + afterId : '';
        let response = null;
        try {
            response = await axios.get(`${this.app.nodeUrl}/transactions/address/${this.app.dApp}/limit/${pageSize}${query}`);
        } catch (e) {
            console.error(`TransactionListener Error on fetch transactions: ${String(e)}`);
            throw e;
        }

        // Get only new transactions
        let transactions = [];
        let isLastFined = false;
        for (let i = 0; i < response.data[0].length; i++) {
            if (lastTransactionId && response.data[0][i].id === lastTransactionId) {
                isLastFined = true;
                break;
            }

            transactions.push(response.data[0][i]);
        }

        //console.log(6264364, isLastFined, lastTransactionId, afterId, response.data[0].map(t => t.id));

        // Fetch next page
        if (lastTransactionId && !isLastFined && transactions.length > 0) {
            afterId = transactions[transactions.length - 1].id;
            transactions = transactions.concat(await this._fetch(lastTransactionId, afterId, 2));
        }

        return Promise.all(
            transactions.map(async transaction => {
                let result = null;
                try {
                    result = await axios.get(`${this.app.nodeUrl}/debug/stateChanges/info/${transaction.id}`);
                } catch (e) {
                    console.error(`TransactionListener Error on fetch transaction info: ${String(e)}`);
                    throw e;
                }

                transaction.info = result.data;
                return transaction;
            })
        );
    }

};
