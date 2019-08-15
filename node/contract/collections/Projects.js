const _get = require('lodash/get');
const _set = require('lodash/set');
const _orderBy = require('lodash/orderBy');

const BaseCollection = require('../base/BaseCollection');
const contractConfig = require('../config/contract');
const ProjectStatus = require('../enums/ProjectStatus');
const ProjectVote = require('../enums/ProjectVote');
const UserRole = require('../enums/UserRole');
const ContestStatus = require('../enums/ContestStatus');
const ProjectFilter = require('../enums/ProjectFilter');

module.exports = class Projects extends BaseCollection {

    getKeys(id = '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})') {
        return [
            `author_${id}`,
            `datajson_${id}`,
            `status_${id}`,
            `positive_fund_${id}`,
            `negative_fund_${id}`,
            `cnt_yes_${id}`,
            `cnt_no_${id}`,
            `block_${id}`,
            `expiration_block_${id}`,
            `expiration_one_${id}`,
            `expiration_two_${id}`,
            `ncommits_${id}`,
            'height',
        ];
    }

    /**
     * @param {string} uid
     * @param {string|null} userAddress
     * @returns {Promise}
     */
    async getProject(uid, userAddress = null) {
        return await this.getItem(uid, userAddress);
    }

    /**
     * @param {string|null} filterName
     * @param {string|null} userAddress
     * @returns {Promise}
     */
    async getProjects(filterName = null, userAddress = null) {
        let projects = await this.getItemsAll(userAddress);
        switch (filterName) {
            case ProjectFilter.FEATURED:
                projects = projects.filter(item => item.status === ProjectStatus.CROWDFUND);
                projects = _orderBy(projects, 'positiveBalance', 'desc');
                break;

            case ProjectFilter.NEW:
                projects = projects.filter(item => item.status === ProjectStatus.CROWDFUND);
                projects = _orderBy(projects, 'createTime', 'asc');
                break;

            case ProjectFilter.FINISHED:
                projects = projects.filter(item => item.positiveBalance > 0 && [ProjectStatus.WAITING_GRANT, ProjectStatus.GRANT].includes(item.status));
                projects = _orderBy(projects, 'positiveBalance', 'desc');
                break;

            default:
                projects = _orderBy(projects, 'createTime', 'desc');
                break;
        }
        return projects;
    }

    /**
     * @param {string} address
     * @param {string|null} userAddress
     * @returns {Promise}
     */
    async getInboxProjects(address, userAddress = null) {
        const projects = await this.getProjects(null, address);
        return projects.filter(item => item.status === ProjectStatus.VOTING && !item.isImVoted && item.isVotingAvailable && item.author.address !== address);
    }

    /**
     * Return user projects (where user is owner)
     * @param {string} authorAddress
     * @param {string|null} userAddress
     * @returns {Promise}
     */
    async getAuthorProjects(authorAddress, userAddress = null) {
        const projects = await this.getProjects(userAddress);
        return projects.filter(item => item.author.address === authorAddress);
    }

    async _prepareItem(uid, item) {
        const data = item['datajson_' + uid];
        if (!data) {
            return null;
        }

        // TODO Legacy support
        if (!_get(data, 'socials.url_website') && data.presentationUrl) {
            _set(data, 'socials.url_website', data.presentationUrl);
        }

        const height = item.height;
        const contractStatus = item['status_' + uid];
        const positiveBalance = item['positive_fund_' + uid];
        const negativeBalance = item['negative_fund_' + uid];
        const votesFeaturedCount = item['cnt_yes_' + uid];
        const votesDelistedCount = item['cnt_no_' + uid];
        const authorAddress = item['author_' + uid];
        const nCommits = item['ncommits_' + uid];
        const blocks = {
            create: item['block_' + uid],
            votingEnd: item['expiration_block_' + uid],
            crowdfundEnd: item['expiration_one_' + uid],
            whaleEnd: item['expiration_two_' + uid],
        };
        const status = ProjectStatus.getStatus(contractStatus, blocks, height);

        return {
            ...data,
            uid,
            blocks,
            isVotingAvailable: status === ProjectStatus.VOTING && nCommits < contractConfig.variables.VOTERS,
            positiveBalance: (positiveBalance / Math.pow(10, 8)) || 0,
            negativeBalance: (negativeBalance / Math.pow(10, 8)) || 0,
            status,
            author: {
                address: authorAddress,
            },
            votesCount: {
                [ProjectVote.FEATURED]: votesFeaturedCount || 0,
                [ProjectVote.DELISTED]: votesDelistedCount || 0,
            },
        };
    }

    async _prepareItemForUser(uid, item, user) {
        item = {
            ...item,
            canEdit: false,
            canVote: false,
            canDonate: false,
            canWhale: false,
            canContestWinner: false,
            author: item.author.address
                ? await this.app.collections.users.getItem(item.author.address)
                : null,
        };

        const contest = item.contest
            ? await this.app.collections.contests.getItem(item.contest)
            : null;
        if (contest && contest.winner && contest.winner === item.uid) {
            item.contestWinner = true;
        }

        if (user) {
            if (item.author.address !== user.address) {
                if (user.role !== UserRole.WHALE) {
                    if (item.isVotingAvailable && !item.isImVoted) {
                        item.canVote = true;
                    }
                    if (item.status === ProjectStatus.CROWDFUND) {
                        item.canDonate = true;
                    }
                } else if (item.status === ProjectStatus.WAITING_GRANT) {
                    item.canWhale = true;
                }
            } else {
                item.canEdit = true;
            }

            if (user.role === UserRole.ADMIN) {
                if (contest && !contest.winner && contest.status !== ContestStatus.COMPLETED) {
                    item.canContestWinner = true;
                }
            }
        }

        return item;
    }

};
