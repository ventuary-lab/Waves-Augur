const _orderBy = require('lodash/orderBy');

const contractConfig = require('../config/contract');
const BaseCollection = require('../base/BaseCollection');
const ReviewType = require('../enums/ReviewType');

module.exports = class ReviewVotings extends BaseCollection {

    getKeys(id = '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}_[A-Za-z0-9]{35})') {
        return [
            `review_${id}_votereview`,
            `reveal_${id}`,
        ];
    }

    async getVotings(userAddress = null) {
        let reviews = await this.getItemsAll(userAddress);
        reviews = _orderBy(reviews, 'review.createTime', 'desc');
        return reviews;
    }

    async getUserVotings(address, userAddress = null) {
        let reviews = await this.getItemsAll(userAddress);
        reviews = reviews.filter(review => review.user.address === address);
        reviews = _orderBy(reviews, 'review.createTime', 'desc');
        return reviews;
    }

    async _prepareItem(id, item) {
        const parts = id.split('_');
        const uid = parts[0];
        const address = parts[1];
        const review = item[`review_${uid}_${address}_votereview`];
        const reveal = item[`reveal_${uid}_${address}`];

        return {
            review,
            reviewNumber: 1,
            type: ReviewType.VOTE,
            vote: reveal,
            amount: 2 * contractConfig.variables.VOTEBET,
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
