import _get from 'lodash/get';
import _toInteger from 'lodash/toInteger';
import _orderBy from 'lodash/orderBy';
import _trim from 'lodash/trim';
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
import {openModal} from 'yii-steroids/actions/modal';

export default class DalComponent {

    constructor() {
        this.isTestMode = (process.env.APP_MODE || 'test') === 'test';
        // this.dApp = '3N8Mm2G9ttNvpfuvbn5cqN1PKsMuEvzP29o'; // DApps id new
        this.dApp = '3NBB3iv7YDRsD8ZM2Pw2V5eTcsfqh3j2mvF'; // DApps id old
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

    getVotePayment() {
        return 2 * this.contract.VOTEBET;
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
        if (!keeper) {
            return {};
        }
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
            balance: Math.floor(_toInteger(account.balance.available) / Math.pow(10, 8)),
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
            ...data,
            isWhale: !!data.isWhale,
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

        // positive_fund_{uid}_{address}
        // negative_fund_{uid}_{address}

        return {
            address: _trim(address),
            activity: await this.getUserActivity(address),
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

    async getUserInvites(address) {
        const data = await this.transport.nodeAllData();
        return Promise.all(
            Object.keys(data)
                .filter(key => /^wl_ref_/.test(key) && data[key] === address)
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
        const type = profile.isWhale ? 'whale' : '';
        const result = await this.transport.nodePublish(method, [profile, type]);

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
        const account = await this.getAccount();
        const [
            data,
            internalStatus,
            positiveBalance,
            negativeBalance,
            votesFeaturedCount,
            votesDelistedCount,
            authorAddress,
            blockCreate,
            blockVotingEnd,
            blockCrowdfundEnd,
            blockWhaleEnd,
            myVote,
            nCommits,
        ] = await this.transport.nodeFetchKeys([
            'datajson_' + uid,
            'status_' + uid,
            'positive_fund_' + uid,
            'negative_fund_' + uid,
            'cnt_yes_' + uid,
            'cnt_no_' + uid,
            'author_' + uid,
            'block_' + uid,
            'expiration_block_' + uid,
            'expiration_one_' + uid,
            'expiration_two_' + uid,
            'commit_' + uid + '_' + account.address,
            'ncommits_' + uid
        ]);
        if (!data) {
            return null;
        }

        const height = await this.transport.nodeHeight();
        const statusMap = {
            'new': ProjectStatusEnum.VOTING,
            'reveal': ProjectStatusEnum.VOTING,
            'commit': ProjectStatusEnum.VOTING,
            //'featured': ProjectStatusEnum.CROWDFUND, // TODO Need wait status?
            'delisted': ProjectStatusEnum.REJECTED,
            'buyout': ProjectStatusEnum.GRANT,
        };
        const blocks = {
            create: blockCreate,
            votingEnd: blockVotingEnd,
            crowdfundEnd: blockCrowdfundEnd,
            whaleEnd: blockWhaleEnd,
        };
        const project = {
            ...data,
            uid,
            blocks,
            isVotingAvailable: false,
            canEdit: false,
            canVote: false,
            canDonate: false,
            canWhale: false,
            positiveBalance: positiveBalance || 0,
            negativeBalance: negativeBalance || 0,
            status: statusMap[internalStatus] || ProjectStatusEnum.getStatus(blocks, height),
            isImVoted: !!myVote,
            author: await this.getUser(authorAddress),
            votesCount: {
                [ProjectVoteEnum.FEATURED]: votesFeaturedCount || 0,
                [ProjectVoteEnum.DELISTED]: votesDelistedCount || 0,
            },
        };

        if (project.status === ProjectStatusEnum.VOTING && nCommits < this.contract.VOTERS) {
            project.isVotingAvailable = true;
        }
        if (account.address) {
            if (project.author.address !== account.address) {
                if (project.author.role !== UserRole.WHALE) {
                    if (project.isVotingAvailable && !project.isImVoted) {
                        project.canVote = true;
                    }
                    if (project.status === ProjectStatusEnum.CROWDFUND) {
                        project.canDonate = true;
                    }
                } else if (project.status === ProjectStatusEnum.WAITING_GRANT) {
                    project.canWhale = true;
                }
            } else {
                project.canEdit = true;
            }
        }

        return project;
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

        projects = projects.filter(item => /\w+-\w+-\w+-\w+-\w+/.test(item.uid));
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
    async getUserProjects(address) {
        const data = await this.transport.nodeAllData();
        return Promise.all(
            Object.keys(data)
                .filter(key => /^author_/.test(key) && data[key] === address)
                .map(key => this.getProject(key.replace(/^author_/, '')))
        );
    }

    async getUserVotings(address) {
        const data = await this.transport.nodeAllData();
        const result = await Promise.all(
            Object.keys(data)
                .map(async key => {
                    const match = /review_([0-9a-z-]+)_([0-9a-z-]+)_votereview/i.exec(key);
                    if (match && match[2] === address) {
                        const uid = match[1];
                        return {
                            review: data[key],
                            reviewNumber: 1,
                            type: FeedTypeEnum.VOTE,
                            vote: await this.transport.nodeFetchKey(`reveal_${uid}_${match[2]}`),
                            amount: this.getVotePayment(),
                            project: await this.getProject(uid),
                        };
                    }
                    return null;
                })
        );
        return _orderBy(result, 'review.createTime', 'desc').filter(Boolean);
    }

    async getUserDonations(address) {
        const data = await this.transport.nodeAllData();
        const result = await Promise.all(
            Object.keys(data)
                .map(async key => {
                    const match = /review_([0-9a-z-]+)_([0-9a-z-]+)_text_id:([0-9]+)/i.exec(key);
                    if (match && match[2] === address) {
                        const uid = match[1];
                        const mode = await this.transport.nodeFetchKey(`review_${uid}_${match[2]}_mode_id:${match[3]}`);
                        const tierNumber = await this.transport.nodeFetchKey(`review_${uid}_${match[2]}_tier_id:${match[3]}`);
                        return {
                            review: data[key],
                            reviewNumber: parseInt(match[3]),
                            type: FeedTypeEnum.DONATE,
                            vote: await this.transport.nodeFetchKey(`reveal_${uid}_${match[2]}`),
                            amount: (mode === 'negative' ? -1 : 1) * this.contract.TIERS[tierNumber - 1],
                            project: await this.getProject(uid),
                        };
                    }
                    return null;
                })
        );
        return _orderBy(result, 'review.createTime', 'desc').filter(Boolean);
    }

    async getUserActivity(address) {
        const userDonations = await this.getUserDonations(address);
        let activity = 1; // 1 point for registration

        if (!userDonations || !userDonations.length) {
            return activity;
        }

        userDonations.map(donate => activity = activity + Math.abs(donate.amount));
        return activity;
    }

    async getUserGrants(address) {
        const data = await this.transport.nodeAllData();
        const result = await Promise.all(
            Object.keys(data)
                .map(async key => {
                    const match = /review_([0-9a-z-]+)_([0-9a-z-]+)_whalereview/i.exec(key);
                    if (match && match[2] === address) {
                        const uid = match[1];
                        return {
                            review: data[key],
                            reviewNumber: 1,
                            type: FeedTypeEnum.WHALE,
                            project: await this.getProject(uid),
                        };
                    }
                    return null;
                })
        );
        return _orderBy(result, 'review.createTime', 'desc').filter(Boolean);
    }

    /**
     * Return project feed: votes and donations, sorted by time desc
     * @param {string} uid
     * @returns {Promise}
     */
    async getProjectFeed(uid) {
        const data = await this.transport.nodeAllData();

        const result = await Promise.all(
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
                                item.amount = this.getVotePayment();
                                break;

                            case 'text_id':
                                const mode = await this.transport.nodeFetchKey(`review_${uid}_${match[2]}_mode_id:${match[5]}`);
                                const tierNumber = await this.transport.nodeFetchKey(`review_${uid}_${match[2]}_tier_id:${match[5]}`);
                                item.type = FeedTypeEnum.DONATE;
                                item.amount = (mode === 'negative' ? -1 : 1) * this.contract.TIERS[tierNumber - 1];
                                item.reviewNumber = parseInt(match[5]);
                                break;

                            case 'whalereview':
                                item.type = FeedTypeEnum.WHALE;
                                break;

                            default:
                                return null;
                        }
                        return item;
                    }
                    return null;
                })
        );
        return _orderBy(result, 'review.createTime', 'desc').filter(Boolean);
    }

    /**
     * @returns {Promise}
     */
    async getProjectsDonations() {
        const data = await this.transport.nodeAllData();
        const result = await Promise.all(
            Object.keys(data)
                .map(async key => {
                    const match = /review_([0-9a-z-]+)_([0-9a-z-]+)_text_id:([0-9]+)/i.exec(key);
                    if (match) {
                        const uid = match[1];
                        const mode = await this.transport.nodeFetchKey(`review_${uid}_${match[2]}_mode_id:${match[3]}`);
                        const tierNumber = await this.transport.nodeFetchKey(`review_${uid}_${match[2]}_tier_id:${match[3]}`);
                        return {
                            review: data[key],
                            reviewNumber: parseInt(match[3]),
                            type: FeedTypeEnum.DONATE,
                            vote: await this.transport.nodeFetchKey(`reveal_${uid}_${match[2]}`),
                            amount: (mode === 'negative' ? -1 : 1) * this.contract.TIERS[tierNumber - 1],
                            project: await this.getProject(uid),
                            user: await this.getUser(match[2]),
                        };
                    }
                    return null;
                })
        );
        return _orderBy(result, 'review.createTime', 'desc').filter(Boolean);
    }

    /**
     * Create or update project
     * @param {object} data
     * @returns {Promise<*>}
     */
    async saveProject(data) {
        const isNew = !data.uid;

        data = {
            name: '',
            description: null,
            logoUrl: null,
            expireCrowd: '', // YYYY-MM-DD
            demoDay: '', // YYYY-MM-DD
            targetWaves: 0,
            tags: [],
            contents: {
                problem: '',
                solution: '',
                xFactor: '',
                whySmartContracts: '',
                newFeaturesOrMvp: '',
                marketStrategy: '',
                impactOnCommunity: '',
                currentStage: '',
                ...data.contents,
            },
            socials: {
                url_twitter: null,
                ...data.socials,
            },
            presentationUrl: null,
            uid: DalHelper.generateUid(),
            ...data,
        };

        data.expireVoting = moment.utc().add(2, 'hour').format('YYYY-MM-DD HH:mm:ss');
        data.expireCrowd = moment.utc(data.expireCrowd).format('YYYY-MM-DD 00:00:00');
        data.expireWhale = moment.utc(data.expireCrowd).add(5, 'day').format('YYYY-MM-DD 00:00:00');

        this.transport.resetCache();

        //const isNew = !(await this.transport.nodeFetchKey('author_' + data.uid));
        if (isNew) {
            data.createTime = DalHelper.dateNow();
            await this.transport.nodePublish(
                'additem',
                [
                    data.uid,
                    this.isTestMode ? 4 : this.dateToHeight(data.expireVoting),
                    this.dateToHeight(data.expireCrowd),
                    this.dateToHeight(data.expireWhale),
                    data,
                ],
                this.contract.LISTINGFEE
            );
        } else {
            await this.transport.nodePublish(
                'projupdate',
                [
                    data.uid,
                    data,
                ]
            );
        }

        return data;
    }

    /**
     * Vote to project
     * @param {string} uid
     * @param {string} vote Featured (yes) OR delisted (no)
     * @param {object} data
     * @returns {Promise<any>}
     */
    async voteProject(uid, vote, data = {}) {
        const salt = DalHelper.generateUid();
        const hash = wavesCrypto.base58encode(wavesCrypto.sha256(wavesCrypto.stringToUint8Array(vote + salt)));

        data.createTime = DalHelper.dateNow();

        // Sign transactions
        const txCommit = await this.transport.nodeSign('votecommit', [uid, hash], this.getVotePayment());
        const txReveal = await this.transport.nodeSign('votereveal', [uid, vote, salt, data]);
        this.log('Signed vote tx:', {txCommit, txReveal});

        // Broadcast first
        let result = null;
        try {
            result = await this.transport.broadcast(txCommit);

            // Wait and broadcast second
            this.voteReveralMonitor.add(uid, txReveal);
        } catch (e) {
            this.error(e);
        }

        return result;
    }

    /**
     *
     * @param {string} uid
     * @param {number} amount
     * @param {object} data
     * @returns {Promise}
     */
    async donateProject(uid, amount, data = {}) {
        const tier = Math.abs(amount);
        const mode = amount > 0 ? 'positive' : 'negative';
        const tierNumber = this.contract.TIERS.indexOf(tier) + 1;

        data.createTime = DalHelper.dateNow();

        let result = null;
        try {
            result = await this.transport.nodePublish('donate', [uid, tierNumber, mode, data], tier / Math.pow(10, 8));
        } catch (e) {
            this.error(e);
        }

        return result;
    }

    /**
     *
     * @param {string} uid
     * @param {number} tier
     * @param {object} data
     * @returns {Promise}
     */
    async whaleProject(uid, tier, data = {}) {
        const fund = await this.transport.nodeFetchKey('positive_fund_' + uid);
        const payment = fund * (this.contract.MULTIPLIER / 100);

        data.tier = tier;
        data.createTime = DalHelper.dateNow();

        let result = null;
        try {
            result = await this.transport.nodePublish('whale', [uid, data], payment);
        } catch (e) {
            this.error(e);
        }

        return result;
    }

    log() {
        if (this.isTestMode || process.env.NODE_ENV !== 'production') {
            console.log.apply(console, arguments); // eslint-disable-line no-console
        }
    }

    error(e) {
        console.error(e); // eslint-disable-line no-console

        const message = (e.data || e.message).replace(/(Error: )?Error while executing account-script:/, '');
        if (message) {
            const store = require('components').store;
            const MessageModal = require('modals/MessageModal').default;
            store.dispatch(openModal(MessageModal, {
                type: 'alert',
                color: 'danger',
                title: __('Error'),
                description: message,
            }));
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
