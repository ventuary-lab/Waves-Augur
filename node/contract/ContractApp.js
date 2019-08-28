const WavesContractCache = require('./lib-waves-contract-cache/WavesContractCache');
const WebSocketServer = require('./components/WebSocketServer');

const {Projects, Users, Contests, ReviewDonations, ReviewVotings, ReviewWhales} = require('./collections');
const WavesTransport = require('./components/WavesTransport');

const REDIS_NAMESPACE = process.env.REDIS_NAMESPACE || 'alpha-ns_';
module.exports = class ContractApp {

    constructor(params = {}) {
        this.dApp = params.dApp;
        this.nodeUrl = params.nodeUrl;

        // Create transport
        this.transport = new WavesTransport({
            dApp: this.dApp,
            nodeUrl: this.nodeUrl,
        });

        this._onContractUpdate = this._onContractUpdate.bind(this);
        this._onCollectionUpdate = this._onCollectionUpdate.bind(this);

        // Create contract cache instance
        this.contractCache = new WavesContractCache({
            dApp: this.dApp,
            nodeUrl: this.nodeUrl,
            updateHandler: this._onContractUpdate,
            storage: {
                namespace: 'waves-' + REDIS_NAMESPACE + this.dApp,
                redis: process.env.REDIS_URL ? process.env.REDIS_URL : {
                    host: process.env.REDIS_HOST || '127.0.0.1',
                    port: process.env.REDIS_PORT || 6379,
                }
            },
            logger: {
                //level: 'debug',
            },
        });
        this.storage = this.contractCache.storage;
        this.logger = this.contractCache.logger;

        // Create collections
        this.collections = {
            projects: new Projects(),
            users: new Users(),
            contests: new Contests(),
            reviewDonations: new ReviewDonations(),
            reviewVotings: new ReviewVotings(),
            reviewWhales: new ReviewWhales(),
        };
        Object.keys(this.collections).forEach(name => {
            this.collections[name].name = name;
            this.collections[name].app = this;
            this.collections[name].transport = this.transport;
            this.collections[name].updateHandler = this._onCollectionUpdate;
        });

        // Create websocket server
        this._websocket = new WebSocketServer({
            httpServer: params.httpServer,
            logger: this.logger,
        });

        this._isSkipUpdates = false;
        this._isNowUpdated = false;
        this._isNeedUpdateAgain = false;
        this._regularCallTimeout = 2 * 1000;
    }

    async start() {
        this.initRegularUpdate();
        this._isSkipUpdates = true;
        await this.contractCache.start();
        await this._updateAll();
        this._isSkipUpdates = false;

        this._websocket.start();
    }

    async initRegularUpdate () {
        console.log('REGULAR UPDATE CALLED');
        await this._updateAll();

        setTimeout(
            () => {
                this.initRegularUpdate();
            },
            this._regularCallTimeout
        );
    }

    async _updateAll() {
        if (this._isNowUpdated) {
            this._isNeedUpdateAgain = true;
            return;
        }
        this._isNowUpdated = true;

        this.logger.info('Update all data in collections... ' + Object.keys(this.collections).join(', '));

        const nodeData = await this.transport.fetchAll();

        await Promise.all(
            Object.keys(this.collections).map(name => {
                return this.collections[name].updateAll(nodeData);
            })
        );

        this._isNowUpdated = false;
        if (this._isNeedUpdateAgain) {
            this._isNeedUpdateAgain = false;
            this._updateAll();
        }
    }

    _onContractUpdate(keys) {
        if (this._isSkipUpdates) {
            return;
        }

        if (keys.includes('height')) {
            this._updateAll();
        } else {
            Object.keys(this.collections).forEach(name => {
                this.collections[name].updateByKeys(keys);
            });
        }
    }

    _onCollectionUpdate(id, item, collection) {
        if (this._isSkipUpdates) {
            return;
        }

        this._websocket.push(JSON.stringify({
            stream: 'collections',
            data: {
                id,
                collection: collection.name,
                item,
            },
        }));
    }

};
