const BaseStorage = require('./storage/BaseStorage');
const RedisStorage = require('./storage/RedisStorage');
const TransactionListener = require('./components/TransactionListener');
const ScriptParser = require('./components/ScriptParser');
const _isFunction = require('lodash/isFunction');

const NODE_URL = process.env.NODE_URL;
const DAPP = process.env.DAPP;

module.exports = class WavesContractCache {

    constructor(params) {
        params = params || {};

        this.nodeUrl = NODE_URL || params.nodeUrl || 'https://testnodes.wavesnodes.com';
        this.dApp =  DAPP || params.dApp || '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF';
        this.contractMethods = {};

        // Create storage
        this.storage = params.storage instanceof BaseStorage
            ? params.storage
            : new RedisStorage(params.storage);

        // Create listener
        this.listener = params.listener instanceof TransactionListener
            ? params.listener
            : new TransactionListener(params.listener);
        this.listener.app = this;
        this.listener.transactionsHandler = this._onTransactions.bind(this);

        // Create script parser
        this.scriptParser = params.scriptParser instanceof ScriptParser
            ? params.scriptParser
            : new ScriptParser(params.scriptParser);
        this.scriptParser.app = this;
    }

    async start() {
        this.scriptParser.start();
        //this.listener.start();
    }

    _onTransactions(transactions) {
        transactions.forEach(transaction => {
            if (transaction.dApp === this.listener.dApp && transaction.call) {
                const method = transaction.call.function;
                const args = transaction.call.args.map(item => item.value);
                const sender = transaction.sender;

                // TODO
                // Get keys
                const keysMatcher = this.contractMethods[method];
                if (keysMatcher) {
                    const keys = _isFunction(keysMatcher)
                        ? keysMatcher.apply(null, [sender].concat(args))
                        : keysMatcher;
                }
            }
        });
    }


};
