export default class VoteReveralMonitor {

    static PING_SECOND = 2;
    static STORAGE_VOTE_REVERAL_KEY = 'vote_reveral';

    constructor(dal) {
        this.dal = dal;

        this._transactions = [];
        this._timer = null;

        this._check = this._check.bind(this);
    }

    start() {
        const clientStorage = require('components').clientStorage;
        this._transactions = JSON.parse(clientStorage.get(VoteReveralMonitor.STORAGE_VOTE_REVERAL_KEY) || '[]');

        this._check();
    }

    add(uid, tx) {
        this._transactions.push([uid, tx]);
        this._check();
    }

    _updateStorage() {
        const clientStorage = require('components').clientStorage;
        clientStorage.set(VoteReveralMonitor.STORAGE_VOTE_REVERAL_KEY, JSON.stringify(this._transactions));
    }

    async _fetchNCommits(transactions) {
        return Promise.all(transactions.map(async item => {
            item[2] = await this.dal.transport.nodeFetchKey('ncommits_' + item[0]);
            return item;
        }));
    }

    async _check() {
        await this._fetchNCommits(this._transactions);
        this._transactions = this._transactions.filter(item => {
            const transaction = item[1];
            const nCommits = item[2];
            if (nCommits >= 3) {
                this.dal.transport.broadcast(transaction);
                return false;
            }
            return true;
        });
        this._updateStorage();

        if (this._timer) {
            clearTimeout(this._timer);
        }
        if (this._transactions.length > 0) {
            this._timer = setTimeout(this._check, VoteReveralMonitor.PING_SECOND * 1000);
        }
    }
}
