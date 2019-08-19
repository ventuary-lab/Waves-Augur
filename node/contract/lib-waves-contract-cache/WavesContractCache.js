const BaseStorage = require('./storage/BaseStorage');
const RedisStorage = require('./storage/RedisStorage');
const TransactionListener = require('./lesteners/TransactionListener');
const HeightListener = require('./lesteners/HeightListener');
const _get = require('lodash/get');
const winston = require('winston');

const NODE_URL = process.env.NODE_URL;
const DAPP = process.env.DAPP;

module.exports = class WavesContractCache {

    constructor(params) {
        params = params || {};

        this.nodeUrl = NODE_URL || params.nodeUrl || 'https://testnodes.wavesnodes.com';
        this.dApp =  DAPP || params.dApp || '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF';
        this.updateHandler = params.updateHandler || null;
        this.contractMethods = {};

        // Create logger
        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(info => `${info.timestamp} ${info.level} ${info.message}`)
            ),
            transports: [
                new winston.transports.Console(),
            ],
            level: 'info',
            ...params.logger,
        });

        // Create storage
        this.storage = params.storage instanceof BaseStorage
            ? params.storage
            : new RedisStorage(params.storage);

        // Create transaction listener
        this.transactionListener = params.transactionListener instanceof TransactionListener
            ? params.transactionListener
            : new TransactionListener(params.transactionListener);
        this.transactionListener.app = this;
        this.transactionListener.storage = this.storage;
        this.transactionListener.transactionsHandler = this._onTransactions.bind(this);

        // Create height listener
        this.heightListener = params.heightListener instanceof HeightListener
            ? params.heightListener
            : new HeightListener(params.heightListener);
        this.heightListener.app = this;
        this.heightListener.storage = this.storage;
        this.heightListener.heightsHandler = this._onHeight.bind(this);
    }

    async start() {
        this.logger.info('Start listen income transactions and height updates... Node ' + this.nodeUrl + ', DApp ' + this.dApp);

        await this.heightListener.start();
        await this.transactionListener.start();
    }

    _onTransactions(transactions) {
        transactions.forEach(transaction => {
            const method = transaction.call.function;
            const args = transaction.call.args.map(item => item.value);
            const sender = transaction.sender;

            if (_get(transaction, 'info.stateChanges.data')) {
                const keys = transaction.info.stateChanges.data.map(item => item.key);
                if (keys.length > 0) {
                    this.logger.debug('Income transaction: ' + method + '(' + args.join(', ') + '), sender ' + sender + ', keys: ' + JSON.stringify(keys));

                    if (this.updateHandler) {
                        this.updateHandler(keys);
                    }
                }
            }
        });
    }

    _onHeight() {
        if (this.updateHandler) {
            this.logger.debug('Height updated: ' + this.heightListener.getHeight());
            this.updateHandler(['height']);
        }
    }

};
