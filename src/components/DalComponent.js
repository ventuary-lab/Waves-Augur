import moment from 'moment';
import uuid from 'uuid/v4';
import _isInteger from 'lodash/isInteger';
import _isObject from 'lodash/isObject';
import _round from 'lodash/round';
import _toInteger from 'lodash/toInteger';
import {nodeInteraction} from '@waves/waves-transactions';

import UserRole from 'enums/UserRole';
import validate from 'shared/validate';
import {setUser} from 'yii-steroids/actions/auth';

export default class DalComponent {

    constructor() {
        this.nodeUrl = process.env.APP_NODE_URL || 'https://testnodes.wavesnodes.com';
        this.dApp = '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF'; // DApps id
    }

    static dateToHeight(date) {
        const mins = -1 * moment().diff(date) / 60000;
        return Math.round(mins / 2); // One block = 2 minutes
    }

    getKeeper() {
        const start = Date.now();
        const checker = resolve => {
            if (window.WavesKeeper && window.WavesKeeper.publicState) {
                resolve(window.WavesKeeper);
            } else if (Date.now() - start > 1000) {
                resolve(null);
            } else {
                setTimeout(() => checker(resolve), 100);
            }
        };
        return new Promise(checker);
    }

    async getActiveAddress() {
        const keeper = await this.getKeeper();
        const userData = await keeper.publicState();
        return userData.account.address;
    }

    async invite(data) {
        data = {
            address: '',
            name: '',
            message: null,
            isWhale: false,
            ...data,
        };

        try {
            await this._nodePublish('inviteuser', [
                data.address,
                data,
            ]);
        } catch (e) {
            if (e.message && e.data) {
                validate.error('address', e.data);
            } else {
                throw e;
            }
        }
    }

    async signup(data) {
        data = {
            name: '',
            avatar: null,
            title: null,
            tags: [],
            location: '',
            socials: {
                url_twitter: null,
                url_facebook: null,
                url_linkedin: null,
                url_instagram: null,
                url_telegram: null,
                url_website: null,
                ...data.socials,
            },
            ...data,
        };

        await this._nodePublish('signup', [data, '']);

        const store = require('components').store;
        store.dispatch(setUser(data));
    }

    async addItem(data) {
        data = {
            title: '',
            description: null,
            logoUrl: null,
            coverUrl: null,
            expireVoting: '', // YYYY-MM-DD
            expireCrowd: '', // YYYY-MM-DD
            expireWhale: '', // YYYY-MM-DD
            targetWaves: 0,
            tags: [],
            location: '',
            contents: {
                problem: '',
                solution: '',
                xFactor: '',
                mvp: '',
                largeScaleAdoption: '',
                impactOnUser: '',
                impactOnUserContext: '',
                impactOnUserSociety: '',
                codeValidation: '',
                legalArrangements: '',
                openSourceStrategy: '',
                interconnectedness: '',
                ...data.contents,
            },
            socials: {
                url_twitter: null,
                url_facebook: null,
                url_linkedin: null,
                url_instagram: null,
                url_telegram: null,
                url_website: null,
                ...data.socials,
            },
            ...data,
            uid: uuid(),
        };

        return this._nodePublish(
            'additem',
            [
                data.uid,
                DalComponent.dateToHeight(data.expireVoting),
                DalComponent.dateToHeight(data.expireCrowd),
                DalComponent.dateToHeight(data.expireWhale),
                data,
            ],
            [
                {
                    amount: 500000000 / 1000,
                    asset: null
                }
            ]
        );
    }

    async auth() {
        const keeper = await this.getKeeper();
        const userData = await keeper.publicState();
        const address = userData.account.address;

        let bio = null;
        let role = null;
        try {
            bio = await this._nodeFetch('wl_bio_' + address);
            role = await this._nodeFetch('wl_sts_' + address);
        } catch (e) {
            console.error(e);
        }

        // Genesis role by address
        if (address === this.dApp) {
            role = UserRole.GENESIS;
        }

        // Get invited info
        let invitedBy = null;
        try {
            const invitedByAddress = await this._nodeFetch('wl_ref_' + address);
            invitedBy = {
                address: invitedByAddress,
                ...(await this._nodeFetch('wl_bio_' + invitedByAddress))
            };
        } catch (e) {
            console.error(e);
        }

        return {
            address: address,
            name: userData.account.name,
            balance: _round(_toInteger(userData.account.balance.available) / Math.pow(10, 8), 2),
            role,
            invitedBy,
            ...bio,
        };
    }

    /**
     * @param key
     * @returns {Promise<null|string | number | boolean>}
     * @private
     */
    async _nodeFetch(key) {
        const result = await nodeInteraction.accountDataByKey(key, this.dApp, this.nodeUrl);
        if (result && result.value) {
            return ['{', '['].includes(result.value.substr(0, 1))
                ? JSON.parse(result.value)
                : result.value;
        }
        return null;
    }

    /**
     *
     * @param string method
     * @param array args
     * @param array payment
     * @returns {Promise<*>}
     * @private
     */
    async _nodePublish(method, args, payment = []) {
        const keeper = await this.getKeeper();
        const transaction = {
            type: 16,
            data: {
                fee: {
                    assetId: 'WAVES',
                    tokens: '0.009',
                },
                dApp: this.dApp,
                call: {
                    args: args.map(item => ({
                        type: _isInteger(item) ? 'integer' : 'string',
                        value: _isObject(item) ? JSON.stringify(item) : item,
                    })),
                    function: method
                },
                payment,
            }
        };

        if (process.env.NODE_ENV !== 'production') {
            console.log('Sent transaction:', transaction);
        }

        return keeper.signAndPublishTransaction(transaction);
    }


}
