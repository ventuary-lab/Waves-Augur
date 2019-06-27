import _get from 'lodash/get';
import _round from 'lodash/round';
import _toInteger from 'lodash/toInteger';
import _orderBy from 'lodash/orderBy';
import {setUser} from 'yii-steroids/actions/auth';
import {getUser} from 'yii-steroids/reducers/auth';

import UserRole from 'enums/UserRole';
import validate from 'shared/validate';
import WavesTransport from './dal/WavesTransport';
import DalHelper from './dal/DalHelper';
import fetchHoc from './dal/fetchHoc';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

export default class DalComponent {

    constructor() {
        this.isTestMode = (process.env.APP_MODE || 'test') === 'test';
        this.dApp = '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF'; // DApps id
        this.hoc = fetchHoc;
        this.transport = new WavesTransport(this);

        this._authInterval = null;
        this._authChecker = this._authChecker.bind(this);

        if (this.isTestMode || process.env.NODE_ENV !== 'production') {
            window.dal = this;
        }
    }

    async isKeeperInstalled() {
        const keeper = await this.transport.getKeeper();
        return !!keeper;
    }

    /**
     * Auth current user and return it data
     * @returns {Promise}
     */
    async auth() {
        const keeper = await this.transport.getKeeper();
        const userData = await keeper.publicState();
        let user = await this.getUser(userData.account.address);
        user = {
            ...user,
            profile: {
                name: userData.account.name,
                ...user.profile,
            },
            balance: _round(_toInteger(userData.account.balance.available) / Math.pow(10, 8), 2),
        };

        if (this._authInterval) {
            clearInterval(this._authInterval);
        }
        this._authInterval = setInterval(this._authChecker, 1000);

        return user;
    }

    /**
     * Invite user
     * @param {object} data
     * @returns {Promise}
     */
    async invite(data) {
        data = {
            address: '',
            name: '',
            message: null,
            isWhale: false,
            ...data,
        };

        try {
            return await this.transport.nodePublish('inviteuser', [
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
        return null;
    }

    /**
     * Get user data by address
     * @param {string} address
     * @returns {Promise}
     */
    async getUser(address) {
        if (!address) {
            return null;
        }
        return {
            address: address,
            role: address === this.dApp
                ? UserRole.GENESIS
                : await this.transport.nodeFetchKey('wl_sts_' + address),
            invitedBy: await this.getUser(await this.transport.nodeFetchKey('wl_ref_' + address)),
            profile: {
                ...(await this.transport.nodeFetchKey('wl_bio_' + address)),
            },
        };
    }

    /**
     * Get all users (without guests/invited)
     * @returns {Promise}
     */
    async getUsers() {
        const data = await this.transport.nodeAllData();
        let users = await Promise.all(
            Object.keys(data)
                .filter(key => /^wl_sts_/.test(key) && data[key].value !== UserRole.INVITED)
                .map(key => this.getUser(key.replace(/^wl_sts_/, '')))
        );

        users = users.filter(user => !!user.profile.name);
        _orderBy(users, 'createTime', 'desc');

        return users;
    }

    /**
     * Create or update context user
     * @param {object} data
     * @returns {Promise}
     */
    async saveUser(data) {
        data = {
            name: '',
            avatar: null,
            title: null,
            tags: [],
            location: '',
            createTime: DalHelper.dateNow(),
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

        // Detect user exists
        const keeper = await this.transport.getKeeper();
        const userData = await keeper.publicState();
        const status = await this.transport.nodeFetchKey('wl_sts_' + userData.account.address);
        const method = !status ? 'signup' : 'userupdate';

        // Save
        const result = await this.transport.nodePublish(method, [data, '']);

        const store = require('components').store;
        store.dispatch(setUser(data));

        return result;
    }

    async getVotedProjects() {
        const projects = await this.getProjects();
        return projects;//.filter(item => item.status !== ProjectStatusEnum.VOTING);
    }

    async getProjects() {
        const data = await this.transport.nodeAllData();
        let projects = await Promise.all(
            Object.keys(data)
                .filter(key => /^author_/.test(key))
                .map(key => this.getProject(key.replace(/^author_/, '')))
        );

        _orderBy(projects, 'createTime', 'desc');

        return projects;
    }

    async getProject(uid) {
        const project = await this.transport.nodeFetchKey('datajson_' + uid);
        if (!project) {
            return null;
        }

        const status = await this.transport.nodeFetchKey('status_' + uid);
        const statusMap = {
            'new': ProjectStatusEnum.VOTING,
            'reveal': ProjectStatusEnum.VOTING,
            'commit': ProjectStatusEnum.VOTING,
            'delisted': ProjectStatusEnum.REJECTED,
            'buyout': ProjectStatusEnum.GRANT,
        };

        return {
            ...project,
            status: statusMap[status] || ProjectStatusEnum.getStatus(project),
            balance: (await this.transport.nodeFetchKey('bank_' + uid)) || 0,
            author: await this.getUser(await this.transport.nodeFetchKey('author_' + uid)),
            uid,
        };
    }

    /**
     * Create or update project
     * @param {object} data
     * @returns {Promise<*>}
     */
    async saveProject(data) {
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
            createTime: DalHelper.dateNow(),
            uid: DalHelper.generateUid(),
        };

        return this.transport.nodePublish(
            'additem',
            [
                data.uid,
                DalHelper.dateToHeight(data.expireVoting),
                DalHelper.dateToHeight(data.expireCrowd),
                DalHelper.dateToHeight(data.expireWhale),
                data,
            ],
            0.005
        );
    }

    /**
     * Vote to project
     * @param {string} uid
     * @param {string} vote
     * @param {string} comment
     * @returns {Promise<any>}
     */
    async voteProject(uid, vote, comment) {
        const hashes = {
            featured: '3GAzarVTT2Vt8WdCnJDZKny1grGwwuh76SeWpd4SKJxN', // это хэш от строки randomstring1delisted
            delisted: 'HXatbtd3THY6FURCGb7PPmogYbQM5ibifg9gtcnDmfAo',
        };
        const salts = {
            featured: 'randomstring2',
            delisted: 'randomstring1',
        };

        vote = 'featured'; // featured (yes) OR delisted (no)
        const hash = hashes[vote];
        const salt = salts[vote];

        // Sign transactions
        const txCommit= await this.transport.nodeSign('votecommit', [uid, hash], 0.003); // 2 x (VOTEBET = 150000000/1000)
        const txReveal = await this.transport.nodeSign('votereveal', [uid, vote, salt]);
        this.log('Signed vote tx:', {txCommit, txReveal});

        // Broadcast first
        await this.transport.broadcast(txCommit);

        // Wait and brodcast second
        // TODO Save in localstorage
        const checker = resolve => {
            const nCommits = this.transport.nodeFetchKey('ncommits_' + uid);
            this.log(`Wait broadcast vote tx, ncommits_${uid}:`, nCommits);

            if (nCommits >= 3) {
                resolve(this.transport.broadcast(txReveal));
            } else {
                setTimeout(() => checker(resolve), 1000);
            }
        };
        return new Promise(checker);
    }

    donateProject(uid, amount, comment) {

    }


    log() {
        if (this.isTestMode || process.env.NODE_ENV !== 'production') {
            console.log.apply(console, arguments); // eslint-disable-line no-console
        }
    }

    async _authChecker() {
        // Get prev address
        const store = require('components').store;
        const prevAddress = _get(getUser(store.getState()), 'address');

        // Get next address
        const keeper = await this.transport.getKeeper();
        const userData = await keeper.publicState();
        const nextAddress = userData.account.address;

        if (prevAddress !== nextAddress) {
            const user = await this.auth();
            store.dispatch(setUser(user));
        }
    }

}
