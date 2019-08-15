const _orderBy = require('lodash/orderBy');

const BaseCollection = require('../base/BaseCollection');
const ReviewType = require('../enums/ReviewType');
const contractConfig = require('../config/contract');

module.exports = class ReviewDonations extends BaseCollection {

    getKeys(id = '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}_[A-Za-z0-9]{35}_text_id:[0-9]+)') {
        const revealId = id.substr(0, 1) === '('
            ? id.replace('_text_id:[0-9]+', '')
            : id.replace(/_text_id:[0-9]+$/, '');
        return [
            `review_${id}`,
            `review_${id.replace('_text_id', '_mode_id')}`,
            `review_${id.replace('_text_id', '_tier_id')}`,
            `reveal_${revealId}`,
        ];
    }

    /**
     *
     * @param {string} address
     * @param {string|null} userAddress
     * @returns {Promise<*|[]|any[]>}
     */
    async getUserDonations(address, userAddress = null) {
        let reviews = await this.getItemsAll(userAddress);
        reviews = reviews.filter(review => review.user.address === address);
        reviews = _orderBy(reviews, 'review.createTime', 'desc');
        return reviews;
    }

    /**
     * @param {string|null} userAddress
     * @returns {Promise}
     */
    async getDonations(userAddress = null) {
        let reviews = await this.getItemsAll(userAddress);
        reviews = _orderBy(reviews, 'review.createTime', 'desc');
        return reviews;
    }

    async _prepareItem(id, item) {
        const parts = id.split('_');
        const uid = parts[0];
        const address = parts[1];
        const reviewNumber = parseInt(parts[3].replace('id:', ''));
        const review = item[`review_${uid}_${address}_text_id:${reviewNumber}`];
        const mode = item[`review_${uid}_${address}_mode_id:${reviewNumber}`];
        const tierNumber = item[`review_${uid}_${address}_tier_id:${reviewNumber}`];

        return {
            review,
            reviewNumber,
            type: ReviewType.DONATE,
            vote: item[`reveal_${uid}_${address}`],
            amount: (mode === 'negative' ? -1 : 1) * contractConfig.variables.TIERS[tierNumber - 1],
        };
    }

    async _prepareItemForUser(id, item, user) {
        const parts = id.split('_');
        const uid = parts[0];
        const address = parts[1];

        return {
            ...item,
            project: await this.app.collections.projects.getItem(uid),
            user: await this.app.collections.users.getItem(address),
        };
    }

};
