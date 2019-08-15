const WavesContractCache = require('./lib-waves-contract-cache/WavesContractCache');

const contractConfig = require('./config/contract');
const {Projects, Users, Contests, ReviewDonations, ReviewVotings, ReviewWhales} = require('./collections');
const WavesTransport = require('./components/WavesTransport');

module.exports = class ContractApp {

    constructor(params = {}) {
        this.dApp = params.dApp;
        this.nodeUrl = params.nodeUrl;

        // Create transport
        this.transport = new WavesTransport({
            dApp: this.dApp,
            nodeUrl: this.nodeUrl,
        });

        this._onUpdate = this._onUpdate.bind(this);

        // Create contract cache instance
        this.contractCache = new WavesContractCache({
            dApp: this.dApp,
            nodeUrl: this.nodeUrl,
            contractMethods: contractConfig.methods,
            updateHandler: this._onUpdate,
            storage: {
                redis: {
                    host: process.env.REDIS_HOST || '127.0.0.1',
                    port: process.env.REDIS_PORT || 6379,
                }
            },
            logger: {
                level: 'debug',
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
        });
    }

    async start() {
        await this.contractCache.start();

        this.logger.info('Update all data in collections... ' + Object.keys(this.collections).join(', '));

        const nodeData = await this.transport.fetchAll();
        Object.keys(this.collections).forEach(name => {
            this.collections[name].updateAll(nodeData);
        });
    }

    _onUpdate(keys) {
        Object.keys(this.collections).forEach(name => {
            this.collections[name].updateByKeys(keys);
        });
    }

};
