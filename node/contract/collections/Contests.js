import ContestStatusEnum from 'enums/ContestStatusEnum';

const moment = require('moment');
const _orderBy = require('lodash/orderBy');

const BaseCollection = require('../base/BaseCollection');
const contractConfig = require('../config/contract');
const ContestStatus = require('../enums/ContestStatus');
const ContestFilter = require('../enums/ContestFilter');

module.exports = class Contests extends BaseCollection {

    getKeys(id = '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})') {
        return [
            `contest_datajson_${id}`,
        ];
    }

    /**
     * @param {string} uid
     * @param {string|null} userAddress
     * @returns {Promise<*|[]|any[]>}
     */
    async getContest(uid, userAddress = null) {
        return await this.getItem(uid, userAddress);
    }

    /**
     * @param {string|null} filterName
     * @param {string|null} userAddress
     * @returns {Promise}
     */
    async getContests(filterName = null, userAddress = null) {
        let contests = await this.getItemsAll(userAddress);
        switch (filterName) {
            case ContestFilter.FEATURED:
                //TODO
                // contests = contests.filter(item => item.status === ProjectStatusEnum.CROWDFUND);
                // contests = _orderBy(contests, 'positiveBalance', 'desc');
                break;

            case ContestFilter.NEW:
                contests = contests.filter(item => item.status === ContestStatus.OPEN);
                break;

            case ContestFilter.FINISHED:
                contests = contests.filter(item => item.status === ContestStatus.COMPLETED);
                break;
        }

        contests = _orderBy(contests, 'createTime', 'asc');
        return contests;
    }

    async _prepareItem(id, item) {
        const data = item['contest_datajson_' + id];
        if (!data) {
            return null;
        }

        return {
            ...data,
            status: data.winner
                ? ContestStatus.COMPLETED
                : (data.expireImplementation > moment.utc().format('YYYY-MM-DD HH:mm:ss')
                    ? ContestStatus.OPEN
                    : ContestStatus.COMPLETED
                ),
        };
    }

    async _prepareItemForUser(id, item, user) {
        return {
            ...item,
            canEdit: user && user.address === contractConfig.adminAddress,
        };
    }

};
