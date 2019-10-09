import axios from 'axios';
import _get from 'lodash/get';
import _toInteger from 'lodash/toInteger';
import _orderBy from 'lodash/orderBy';
import _trim from 'lodash/trim';
import _sum from 'lodash/sum';
import _set from 'lodash/set';
import { setUser } from 'yii-steroids/actions/auth';
import { getUser } from 'yii-steroids/reducers/auth';
import * as wavesCrypto from '@waves/waves-crypto';
import queryString from 'query-string';

import { http, clientStorage, store } from 'components';
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
import { openModal } from 'yii-steroids/actions/modal';
import ContestStatusEnum from 'enums/ContestStatusEnum';

export default class DalComponent {
    constructor() {
        this.dAppNetwork = 'main';
        this.dApp = '3P8Fvy1yDwNHvVrabe4ek5b9dAwxFjDKV7R';
        this.adminAddress = '3P9NDxt9Y6ePfM9hkQysgSvbHJvihr56Z18';

        this.hoc = fetchHoc;
        this.hoc2 = require('./dal/apiHoc').default;

        this.transport = new WavesTransport(this);
        this.voteReveralMonitor = new VoteReveralMonitor(this);
        this.contract = {
            VOTERS: 3,
            QUORUM: 2,
            LISTINGFEE: 1, // LISTINGFEE = 300000000/100000000
            VOTEBET: 1, // VOTEBET = 10000000/100000000
            TIERS: [3, 10, 100, 300, 1000],
            MULTIPLIER: 150,
        };

        this._authInterval = null;
        this._authChecker = this._authChecker.bind(this);

        if (process.env.NODE_ENV !== 'production') {
            window.dal = this;
        }
    }

    isTestMode() {
        return this.dAppNetwork === 'test';
    }

    getVotePayment() {
        return 2 * this.contract.VOTEBET;
    }

    dateToHeight(date) {
        let days = -1 * Math.floor(moment().diff(date, 'days', true));
        if (this.isTestMode()) {
            // In test mode one block = 1 day
            // return days;
            return Math.round(days * 1440);
        } else {
            // One block = 2 minutes
            return Math.round(days * 1440);
        }
    }

    async isKeeperInstalled() {
        const keeper = await this.transport.getKeeper();
        return !!keeper;
    }

    async constructAccountInstance (accountForm, seed) {
        const isMainnet = !this.isTestMode();
        const network = isMainnet ? 'mainnet' : 'testnet';
        const { accountName } = accountForm;

        try {
            const url = this.transport.getNodeUrl() + '/addresses/balance/' + seed.address;
            const availableBalanceRes = await axios.get(url);
            const availableBalance = availableBalanceRes.data.balance;

            this.transport.noKeeper.seedPhrase = seed.phrase;

            return {
                name: accountName,
                publicKey: seed.keyPair.publicKey,
                address: seed.address,
                networkCode: isMainnet ? 'W' : 'T',
                network,
                type: 'seed',
                balance:{ 
                    available: availableBalance,
                    leasedOut: '0',
                    network
                }
            };
        } catch (err) {
            const account = this.getAccountFromLocalStorage();

            this.transport.noKeeper.seedPhrase = account.seed;

            return account;
        }
    }

    getAccountFromLocalStorage () { 
        try {
            const account = window.localStorage.getItem('dao_account');
            return JSON.parse(account);
        } catch (err) {
            return {};
        }
    }

    async getAccount() {
        const keeper = await this.transport.getKeeper();

        try {
            const userData = await keeper.publicState();
            this.transport.noKeeper.provided = false;

            return userData.account;
        } catch {
            this.transport.noKeeper.provided = true;

            return this.getAccountFromLocalStorage();
        }
    }

    /**
     * Auth current user and return it data
     * @returns {Promise}
     */
    async auth() {
        try {
            const account = await this.getAccount();

            let user = await this.getUser(account.address);
            user = {
                ...user,
                profile: {
                    name: account.name,
                    ...user.profile,
                },
            };

            if (this._authInterval) {
                clearInterval(this._authInterval);
            }

            this._authInterval = setInterval(this._authChecker, 1000);

            return user;
        } catch (e) {
            console.error(e); // eslint-disable-line no-console
            return null;
        }
    }

    async resolveInvitation() {
        const params = queryString.parse(location.search);

        if (params && params.invitation) {
            const user = await this.getUser(wavesCrypto.address(params.invitation));

            if (user.role === UserRole.INVITED) {
                return {
                    user,
                    hash2: wavesCrypto.address(params.invitation),
                };
            }
        }
        return null;
    }

    /**
     * Invite user
     * @param {object} data
     * @returns {Promise}
     */
    async invite(data) {
        const account = await this.getAccount();
        const salt = DalHelper.generateUid();
        const hash1 = wavesCrypto.address(salt + account.address);
        const hash2 = wavesCrypto.address(hash1);

        data = {
            name: '',
            message: null,
            ...data,
            isWhale: !!data.isWhale,
            address: hash2,
        };

        try {
            await this.transport.nodePublish('inviteuser', [
                data.address,
                data,
            ], null, false);
        } catch (e) {
            if (e.message && e.data) {
                validate.error('address', e.data);
            } else {
                throw e;
            }
        }

        return {
            url: location.origin + '?invitation=' + hash1,
        };
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

        const account = await this.getAccount();
        const balance = account.address === address
            ? Math.floor(_toInteger(account.balance.available) / Math.pow(10, 8))
            : null;

        const user = await http.get(`/api/v1/users/${address}`);
        return {
            balance,
            address: _trim(address),
            ...user,
            /*activity: await this.getUserActivity(address),
            role: address === this.dApp || address === this.adminAddress
                ? this.specialRoles[address]
                : await this.transport.nodeFetchKey('wl_sts_' + address) || UserRole.ANONYMOUS,
            invitedBy: await this.getUser(await this.transport.nodeFetchKey('wl_ref_' + address)),
            profile: {
                ...(await this.transport.nodeFetchKey('wl_bio_' + address)),
            },*/
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
                .filter(key =>  /^wl_sts_/.test(key))
                .map(key => this.getUser(key.replace(/^wl_sts_/, '')))
        );

        users = users.filter(user => !!user.profile.name && ![UserRole.INVITED, UserRole.SPEND_INVITE].includes(user.role));
        users = _orderBy(users, 'activity', 'desc');

        return users;
    }

    async getUserInvites(address) {
        const data = await this.transport.nodeAllData();
        let users = await Promise.all(
            Object.keys(data)
                .filter(key => /^wl_ref_/.test(key) && data[key] === address)
                .map(key => this.getUser(key.replace(/^wl_ref_/, '')))
        );

        users = users.filter(user => user.role !== UserRole.SPEND_INVITE);
        return users;
    }

    /**
     * Create or update context user
     * @param {object} profile
     * @param {string} hash2
     * @returns {Promise}
     */
    async saveUser(profile, hash2) {
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
        if (!profile.createTime) {
            profile.createTime = DalHelper.dateNow();
        }

        // Get address
        const account = await this.getAccount();
        const user = await this.getUser(account.address);

        this.transport.resetCache();

        // Save
        const type = profile.isWhale ? 'whale' : '';

        const result = hash2
            ? await this.transport.nodePublish('signupbylink', [hash2, profile, type])
            : await this.transport.nodePublish(user.role === UserRole.INVITED ? 'signup' : 'userupdate', [profile, type]);

        if (user.role === UserRole.INVITED) {
            user.role = UserRole.REGISTERED;
        }

        // Update in redux store
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
        const voteReveral = JSON.parse(clientStorage.get('vote_reveral') || [[]]);
        const store = require('components').store;
        const user = getUser(store.getState());

        const [
            data,
            contractStatus,
            positiveBalance,
            negativeBalance,
            votesFeaturedCount,
            votesDelistedCount,
            authorAddress,
            blockCreate,
            blockVotingEnd,
            blockCrowdfundEnd,
            blockWhaleEnd,
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
            'ncommits_' + uid
        ]);
        if (!data) {
            return null;
        }

        // TODO Legacy
        if (!_get(data, 'socials.url_website') && data.presentationUrl) {
            _set(data, 'socials.url_website', data.presentationUrl);
        }

        const height = await this.transport.nodeHeight();
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
            canContestWinner: false,
            positiveBalance: (positiveBalance / Math.pow(10, 8)) || 0,
            negativeBalance: (negativeBalance / Math.pow(10, 8)) || 0,
            status: ProjectStatusEnum.getStatus(contractStatus, blocks, height),
            isImVoted: this.isImVoted(uid, _get(user, 'address'), voteReveral),
            author: await this.getUser(authorAddress),
            votesCount: {
                [ProjectVoteEnum.FEATURED]: votesFeaturedCount || 0,
                [ProjectVoteEnum.DELISTED]: votesDelistedCount || 0,
            },
        };

        const contest = project.contest ? await this.getContest(project.contest) : null;

        if (project.status === ProjectStatusEnum.VOTING && nCommits < this.contract.VOTERS) {
            project.isVotingAvailable = true;
        }

        if (contest && contest.winner && contest.winner === project.uid) {
            project.contestWinner = true;
        }

        if (_get(user, 'address')) {
            if (project.author.address !== user.address) {
                if (user.role !== UserRole.WHALE) {
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

            if (user.role === UserRole.ADMIN) {
                if (contest && !contest.winner && contest.status !== ContestStatusEnum.COMPLETED) {
                    project.canContestWinner = true;
                }
            }
        }

        return project;
    }

    /**
     * Return projects by current contest
     * @param {string} contestUid
     * @returns {Promise}
     */
    async getContestEntries(contestUid) {
        const projects = await this.getProjects();

        return projects.filter(project => project.contest && project.contest === contestUid);
    }

    /**
     * Return contest by uid
     * @param {string} uid
     * @returns {Promise}
     */
    async getContest(uid) {

        const store = require('components').store;
        const user = getUser(store.getState());

        const data = await this.transport.nodeFetchKey('contest_datajson_' + uid);
        if (!data) {
            return null;
        }

        const contest = {
            ...data,
            canEdit: false,
        };

        if (data.winner) {
            contest.status = ContestStatusEnum.COMPLETED;
        } else {
            contest.status = data.expireImplementation > DalHelper.dateNow()
                ? ContestStatusEnum.OPEN
                : ContestStatusEnum.COMPLETED;
        }

        if (_get(user, 'address') === this.adminAddress) {
            contest.canEdit = true;
        }

        return contest;
    }


    /**
     * Return all contests
     * @returns {Promise}
     */
    async getContests() {

        const data = await this.transport.nodeAllData();
        let contests = await Promise.all(
            Object.keys(data)
                .filter(key => /^contest_datajson_/.test(key))
                .map(key => this.getContest(key.replace(/^contest_datajson_/, '')))
        );

        contests = contests.filter(item => /\w+-\w+-\w+-\w+-\w+/.test(item.uid));

        return contests;
    }

    /**
     * Return add contestUid to project data
     * @param {string} contest
     * @param {string} projectUid
     * @returns {Promise}
     */
    async addContestToProject(contest, projectUid) {
        const projectData = await this.transport.nodeFetchKey('datajson_' + projectUid);

        const data = {
            ...projectData,
            contest: contest.uid,
        };

        await this.transport.nodePublish(
            'projupdate',
            [
                projectUid,
                data,
            ]
        );
    }

    /**
     * Return add contestUid to project data
     * @param {string} projectUid
     * @param {string} contestUid
     * @returns {Promise}
     */
    async chooseProjectAsContestWinner(projectUid, contestUid) {
        const contestData = await this.transport.nodeFetchKey('contest_datajson_' + contestUid);

        const data = {
            ...contestData,
            winner: projectUid,
        };

        await this.transport.nodePublish(
            'contestAddOrUpdate',
            [
                contestUid,
                data,
            ]
        );
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
     * Return user projects (where user is owner)
     * @param {string} address
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
                            user: await this.getUser(match[2]),
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
                            user: await this.getUser(match[2]),
                        };
                    }
                    return null;
                })
        );
        return _orderBy(result, 'review.createTime', 'desc').filter(Boolean);
    }

    async getUserActivity(address) {
        const data = await this.transport.nodeAllData();
        const result = await Promise.all(
            Object.keys(data)
                .map(async key => {
                    const match = /review_([0-9a-z-]+)_([0-9a-z-]+)_text_id:([0-9]+)/i.exec(key);
                    if (match && match[2] === address) {
                        const uid = match[1];
                        const tierNumber = await this.transport.nodeFetchKey(`review_${uid}_${match[2]}_tier_id:${match[3]}`);
                        return this.contract.TIERS[tierNumber - 1];
                    }
                })
                .filter(Boolean)
        );

        return _sum(result) ? _sum(result) + 1 : 1;
    }

    async getUserGrants(address) {
        const data = await this.transport.nodeAllData();
        const result = await Promise.all(
            Object.keys(data)
                .map(async key => {
                    const match = /review_([0-9a-z-]+)_([0-9a-z-]+)_whalereview/i.exec(key);
                    if (match && match[2] === address) {
                        const uid = match[1];
                        const positiveBalance = await this.transport.nodeFetchKey(`positive_fund_${uid}`);
                        const whaleTierNumber = data[key].tier;

                        return {
                            review: data[key],
                            reviewNumber: 1,
                            amount: positiveBalance + ((positiveBalance / 100) * (whaleTierNumber * 10)),
                            tierNumber: whaleTierNumber,
                            type: FeedTypeEnum.WHALE,
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
                                const positiveBalance = await this.transport.nodeFetchKey(`positive_fund_${uid}`);
                                const whaleTierNumber = data[key].tier;

                                item.amount = positiveBalance + ((positiveBalance / 100) * (whaleTierNumber * 10));
                                item.tierNumber = whaleTierNumber;
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
     * @param {object} contest
     * @returns {Promise<*>}
     */
    async saveProject(data, contest) {
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
                url_website: null,
                ...data.socials,
            },
            uid: DalHelper.generateUid(),
            ...data,
        };

        data.expireVoting = moment.utc().add(2, 'hour').format('YYYY-MM-DD HH:mm:ss');
        data.expireCrowd = moment.utc(data.expireCrowd).format('YYYY-MM-DD 00:00:00');
        data.expireWhale = moment.utc(data.expireCrowd).add(5, 'day').format('YYYY-MM-DD 00:00:00');
        data.demoDay = moment.utc(data.demoDay).format('YYYY-MM-DD 00:00:00');

        this.transport.resetCache();

        //const isNew = !(await this.transport.nodeFetchKey('author_' + data.uid));
        if (contest) {
            data.contest = contest.uid;
            data.coverUrl = contest.coverUrl;
            data.coverSmallUrl = contest.coverSmallUrl;
        }
        
        if (isNew) {
            data.createTime = DalHelper.dateNow();

            await this.transport.nodePublish(
                'additem',
                [
                    data.uid,
                    this.isTestMode() ? 8 : 60, //60 blocks = 2 hours,
                    this.dateToHeight(data.expireCrowd),
                    this.dateToHeight(data.expireWhale),
                    data,
                ],
                this.contract.LISTINGFEE
            );

            await this.notifyOnProjectCreate(data.uid);
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

    async notifyOnProjectCreate (uid) {
        let ms = 3000, times = 5;

        const checker = async () => {
            await axios.get(window.location.origin + `/api/v1/telegram-bot/projectCreateNotify/${uid}`);
        };

        const onPromise = async (resolve) => {
            if (times < 1) {
                resolve();
                return;
            };

            try {
                await checker();
                resolve();

            } catch (err) {
                times--;
                setTimeout(() => onPromise(resolve), ms);
            }
        };

        return new Promise(onPromise);
    }

    /**
     * Create or update contest
     * @param {object} data
     * @param {string} authorUid
     * @returns {Promise<*>}
     */
    async saveContest(data) {
        const store = require('components').store;
        const author = getUser(store.getState());
        const isNew = !data.uid;

        data = {
            name: '',
            description: null,
            logoUrl: null,
            coverUrl: null,
            coverSmallUrl: null,
            expireEntries: '', // YYYY-MM-DD
            expireImplementation: '', // YYYY-MM-DD
            rewardWaves: 0,
            tags: [],
            winner: null,
            contents: {
                appDescription: '',
                theme: '',
                screenDescription: '',
                platform: '',
                deliverables: '',
                links: '',
                ...data.contents,
            },
            socials: {
                url_twitter: null,
                url_website: null,
                ...data.socials,
            },
            uid: DalHelper.generateUid(),
            ...data,
        };

        data.expireEntries = moment.utc(data.expireEntries).format('YYYY-MM-DD 00:00:00');
        data.expireImplementation = moment.utc(data.expireImplementation).format('YYYY-MM-DD 00:00:00');
        data.authorAdress = author.address;

        this.transport.resetCache();

        if (isNew) {
            data.createTime = DalHelper.dateNow();
        }

        await this.transport.nodePublish(
            'contestAddOrUpdate',
            [
                data.uid,
                data,
            ]
        );

        return data;
    }

    /**
     * Vote to project
     * @param {string} uid
     * @param {string} address
     * @param {string} vote Featured (yes) OR delisted (no)
     * @param {object} data
     * @returns {Promise<any>}
     */
    async voteProject(uid, address, vote, data = {}) {
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
            this.voteReveralMonitor.add(uid, txReveal, address);
        } catch (e) {
            this.error(e);
        }

        this.transport.resetCache();

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
            result = await this.transport.nodePublish('donate', [uid, tierNumber, mode, data], tier);
        } catch (e) {
            this.error(e);
        }

        this.transport.resetCache();

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

        this.transport.resetCache();

        return result;
    }

    /**
     *
     * @param {string} uid
     * @param {object} data
     * @returns {Promise}
     */
    async reportProject(uid, data = {}) {

        data.createTime = DalHelper.dateNow();
        // const payment = this.contract.REPORT;

        let result = null;
        try {
            result = await this.transport.nodePublish('reportProject', [uid, data], null);
        } catch (e) {
            this.error(e);
        }

        this.transport.resetCache();

        return result;
    }

    log() {
        if (this.isTestMode() || process.env.NODE_ENV !== 'production') {
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

    isImVoted(uid, address, voteReveral) {
        let isImVoted = false;

        if (voteReveral && voteReveral.length > 0) {
            voteReveral.map(item => {

                if ((item[0] === uid) && (item[2] === address)) {
                    isImVoted = true;
                }
            });

            return isImVoted;
        }

        return false;
    }

    async _authChecker() {
        // Get prev address
        const store = require('components').store;
        const state = store.getState();
        const prevAddress = _get(getUser(store.getState()), 'address');

        if (!state.global.authCheckerEnabled) {
            return;
        }

        // Get next address
        const account = await this.getAccount();
        const nextAddress = account.address;

        if (prevAddress !== nextAddress) {
            const user = await this.auth();
            store.dispatch(setUser(user));
        }
    }

    async transferFunds(address, amount) {
        await this.transport.nodePublish('transfer', [address], amount);
    }

    async getIntenalDaoBalance (address) {
        const [balance] = await this.transport.nodeFetchKeys([
            'balance_' + address
        ]);
        return balance;
    }

    async withdrawInternalBalance (address) {
        await this.transport.nodePublish('withdraw', [address]);
    }
}
