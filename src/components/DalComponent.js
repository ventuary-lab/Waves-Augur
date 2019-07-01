import _get from 'lodash/get';
import _round from 'lodash/round';
import _toInteger from 'lodash/toInteger';
import _orderBy from 'lodash/orderBy';
import {setUser} from 'yii-steroids/actions/auth';
import {getUser} from 'yii-steroids/reducers/auth';
import * as wavesCrypto from '@waves/waves-crypto';

import UserRole from 'enums/UserRole';
import validate from 'shared/validate';
import WavesTransport from './dal/WavesTransport';
import DalHelper from './dal/DalHelper';
import fetchHoc from './dal/fetchHoc';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import moment from 'moment';
import FeedTypeEnum from 'enums/FeedTypeEnum';
import ProjectVoteEnum from 'enums/ProjectVoteEnum';
import VoteReveralMonitor from 'components/dal/VoteReveralMonitor';

export default class DalComponent {

    constructor() {
        this.isTestMode = (process.env.APP_MODE || 'test') === 'test';
        this.dApp = '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF'; // DApps id
        this.hoc = fetchHoc;
        this.transport = new WavesTransport(this);
        this.voteReveralMonitor = new VoteReveralMonitor(this);
        this.contract = {
            VOTERS: 3,
            QUORUM: 2,
            LISTINGFEE: 0.005, // LISTINGFEE = 500000000/1000
            VOTEBET: 0.0015, // VOTEBET = 150000000/1000
            TIERS: [10, 50, 250, 1250, 6250],
            MULTIPLIER: 150,
        };

        this._authInterval = null;
        this._authChecker = this._authChecker.bind(this);

        if (this.isTestMode || process.env.NODE_ENV !== 'production') {
            window.dal = this;
        }
    }

    dateToHeight(date) {
        let days = -1 * Math.floor(moment().diff(date, 'days', true));
        if (this.isTestMode) {
            // In test mode one block = 1 day
            return days;
        } else {
            // One block = 2 minutes
            return Math.round((days * 1440) / 2);
        }
    }

    async isKeeperInstalled() {
        const keeper = await this.transport.getKeeper();
        return !!keeper;
    }

    async getAccount() {
        const keeper = await this.transport.getKeeper();
        const userData = await keeper.publicState();
        return userData.account;
    }

    /**
     * Auth current user and return it data
     * @returns {Promise}
     */
    async auth() {
        const account = await this.getAccount();
        let user = await this.getUser(account.address);
        user = {
            ...user,
            profile: {
                name: account.name,
                ...user.profile,
            },
            balance: _round(_toInteger(account.balance.available) / Math.pow(10, 8), 2),
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
        users = _orderBy(users, 'createTime', 'desc');

        return users;
    }

    async getInvitedUsers() {
        const account = await this.getAccount();
        const data = await this.transport.nodeAllData();
        return Promise.all(
            Object.keys(data)
                .filter(key => /^wl_ref_/.test(key) && data[key].value === account.address)
                .map(key => this.getUser(key.replace(/^wl_ref_/, '')))
        );
    }

    /**
     * Create or update context user
     * @param {object} profile
     * @returns {Promise}
     */
    async saveUser(profile) {
        profile = {
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
                ...profile.socials,
            },
            ...profile,
        };

        // Get address
        const account = await this.getAccount();
        const user = await this.getUser(account.address);

        // Detect user exists
        const isNew = !(await this.transport.nodeFetchKey('wl_sts_' + account.address));
        const method = isNew ? 'signup' : 'userupdate';
        if (isNew) {
            profile.createTime = DalHelper.dateNow();
        }

        this.transport.resetCache();

        // Save
        const result = await this.transport.nodePublish(method, [profile, '']);

        if (user.role === UserRole.INVITED) {
            user.role = UserRole.REGISTERED;
        }

        // Update in redux store
        const store = require('components').store;
        store.dispatch(setUser({
            ...user,
            profile: {
                ...(user && user.profile),
                ...profile,
            },
        }));

        return result;
    }

    /**
     * Return project by uid
     * @param {string} uid
     * @returns {Promise}
     */
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
            positiveBalance: (await this.transport.nodeFetchKey('positive_fund_' + uid)) || 0,
            negativeBalance: (await this.transport.nodeFetchKey('negative_fund_' + uid)) || 0,
            votesCount: {
                [ProjectVoteEnum.FEATURED]: (await this.transport.nodeFetchKey('cnt_yes_' + uid)) || 0,
                [ProjectVoteEnum.DELISTED]: (await this.transport.nodeFetchKey('cnt_no_' + uid)) || 0,
            },
            author: await this.getUser(await this.transport.nodeFetchKey('author_' + uid)),
            uid,
        };
    }

    /**
     * Return all projects
     * @returns {Promise}
     */
    async getProjects() {
        const data = await this.transport.nodeAllData();
        let projects = await Promise.all(
            Object.keys(data)
                .filter(key => /^author_/.test(key))
                .map(key => this.getProject(key.replace(/^author_/, '')))
        );

        projects = _orderBy(projects, 'createTime', 'desc');

        return projects;
    }

    /**
     * Return projects with status CROWDFUND and next
     * @returns {Promise}
     */
    async getVotedProjects() {
        const projects = await this.getProjects();
        return projects.filter(item => item.status !== ProjectStatusEnum.VOTING);
    }

    /**
     * Return user projects (where user is owner)
     * @returns {Promise}
     */
    async getMyProjects() {
        const account = await this.getAccount();
        const data = await this.transport.nodeAllData();
        return Promise.all(
            Object.keys(data)
                .filter(key => /^author_/.test(key) && data[key].value === account.address)
                .map(key => this.getProject(key.replace(/^author_/, '')))
        );
    }

    /**
     * Return project feed: votes and donations, sorted by time desc
     * @param {string} uid
     * @returns {Promise}
     */
    async getProjectFeed(uid) {
        const account = await this.getAccount();
        const data = await this.transport.nodeAllData();

        return Promise.all(
            Object.keys(data)
                .map(async key => {
                    const match = /review_([0-9a-z-]+)_([0-9a-z-]+)_([0-9a-z_]+)(:([0-9]+))?/i.exec(key);
                    if (match && match[1] === uid) {
                        const item = {
                            user: await this.getUser(match[2]),
                            review: data[key],
                            reviewNumber: 1,
                        };
                        switch (match[3]) {
                            case 'votereview':
                                item.type = FeedTypeEnum.VOTE;
                                item.vote = await this.transport.nodeFetchKey(`reveal_${uid}_${match[2]}`);
                                break;

                            case 'text_id':
                                const mode = await this.transport.nodeFetchKey(`review_${uid}_${match[2]}_mode_id:${match[5]}`);
                                const tier = await this.transport.nodeFetchKey(`review_${uid}_${match[2]}_tier_id:${match[5]}`);
                                item.type = FeedTypeEnum.DONATE;
                                item.amount = (mode === 'negative' ? -1 : 1) * tier;
                                item.reviewNumber = parseInt(match[5]);
                                break;

                            case 'whalereview':
                                item.type = FeedTypeEnum.WHALE;
                                break;
                        }
                        return item;
                    }
                    return null;
                })
                .filter(key => /^author_/.test(key) && data[key].value === account.address)
                .map(key => this.getProject(key.replace(/^author_/, '')))
        );
    }

    /**
     * Create or update project
     * @param {object} data
     * @returns {Promise<*>}
     */
    async saveProject(data) {
        data = {
            name: '',
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
            uid: DalHelper.generateUid(),
            ...data,
        };

        this.transport.resetCache();

        const isNew = !(await this.transport.nodeFetchKey('author_' + data.uid));
        if (isNew) {
            data.createTime = DalHelper.dateNow();
            return this.transport.nodePublish(
                'additem',
                [
                    data.uid,
                    this.dateToHeight(data.expireVoting),
                    this.dateToHeight(data.expireCrowd),
                    this.dateToHeight(data.expireWhale),
                    data,
                ],
                this.contract.LISTINGFEE
            );
        } else {
            return this.transport.nodePublish(
                'projupdate',
                [
                    data.uid,
                    data,
                ]
            );
        }
    }

    /**
     * Vote to project
     * @param {string} uid
     * @param {string} vote Featured (yes) OR delisted (no)
     * @param {object} data
     * @returns {Promise<any>}
     */
    async voteProject(uid, vote, data) {
        const salt = DalHelper.generateUid();
        const hash = wavesCrypto.base58encode(wavesCrypto.sha256(wavesCrypto.stringToUint8Array(vote + salt)));

        data.createTime = DalHelper.dateNow();

        // Sign transactions
        const txCommit= await this.transport.nodeSign('votecommit', [uid, hash], 2 * this.contract.VOTEBET);
        const txReveal = await this.transport.nodeSign('votereveal', [uid, vote, salt, data]);
        this.log('Signed vote tx:', {txCommit, txReveal});

        // Broadcast first
        let result = null;
        try {
            result = await this.transport.broadcast(txCommit);
        } catch (e) {
            if (e.message && e.data) {
                alert(e.data);
            } else {
                throw e;
            }
        }

        // Wait and broadcast second
        this.voteReveralMonitor.add(uid, txReveal);

        return result;
    }

    donateProject(uid, amount, data) {
        const tier = Math.abs(amount);
        const mode = amount > 0 ? 'positive' : 'negative';

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
        const account = await this.getAccount();
        const nextAddress = account.address;

        if (prevAddress !== nextAddress) {
            const user = await this.auth();
            store.dispatch(setUser(user));
        }
    }

}
