const moment = require('moment');
const _orderBy = require('lodash/orderBy');

const BaseCollection = require('../base/BaseCollection');
// const contractConfig = require('../config/contract');
const ProjectStatusEnum = require('../enums/ProjectStatus');
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
     * @returns {Promise<*|[]|any[]>}
     */
    async getContest(uid) {
        return await this.getItem(uid);
    }

    /**
     * @param {string|null} filterName
     * @returns {Promise}
     */
    async getContests(filterName = null) {
        let contests = await this.getItemsAll();

        switch (filterName) {
            case ContestFilter.FEATURED:
                //TODO
                // contests = contests.filter(item => item.status === ProjectStatusEnum.CROWDFUND);
                // contests = _orderBy(contests, 'positiveBalance', 'desc');
                break;

            case ContestFilter.NEW:
                // contests = contests.filter(item => item.status === ContestStatus.OPEN);
                break;

            case ContestFilter.FINISHED:
                contests = contests.filter(item => item.status === ContestStatus.COMPLETED);
                break;
        }

        const order = [
            ContestFilter.NEW,
            ContestFilter.FEATURED
        ].includes(filterName) ? 'desc' : 'asc';

        contests = _orderBy(
            contests,
            'createTime',
            order
        );

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
                : (data.expireEntries > moment.utc().format('YYYY-MM-DD HH:mm:ss')
                    ? ContestStatus.OPEN
                    : ContestStatus.COMPLETED
                ),
        };
    }

    /*async _postProcessItem(id, item) {
        return {
            ...item,
            canEdit: user && user.address === contractConfig.adminAddress,
        };
    }*/

};
