const _orderBy = require('lodash/orderBy');

const BaseCollection = require('../base/BaseCollection');
const ReviewType = require('../enums/ReviewType');

module.exports = class ReviewWhales extends BaseCollection {

    getKeys(id = '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}_[A-Za-z0-9]{35})') {
        const uid = id.substr(0, 1) === '('
            ? id.replace('_[A-Za-z0-9]{35}', '')
            : id.split('_')[1];
        return [
            `review_${id}_whalereview`,
            `positive_fund_${uid}`,
        ];
    }

    async getWhales(userAddress = null) {
        let reviews = await this.getItemsAll(userAddress);
        reviews = _orderBy(reviews, 'review.createTime', 'desc');
        return reviews;
    }

    async getUserWhales(address, userAddress = null) {
        let reviews = await this.getItemsAll(userAddress);
        reviews = reviews.filter(review => review.user.address === address);
        reviews = _orderBy(reviews, 'review.createTime', 'desc');
        return reviews;
    }

    async _prepareItem(id, item) {
        const parts = id.split('_');
        const uid = parts[0];
        const address = parts[1];
        const review = item[`review_${uid}_${address}_whalereview`];
        if (!review) {
            return null;
        }

        const positiveBalance = item[`positive_fund_${uid}`];
        const whaleTierNumber = review.tier;

        return {
            review,
            reviewNumber: 1,
            amount: positiveBalance + ((positiveBalance / 100) * (whaleTierNumber * 10)),
            tierNumber: whaleTierNumber,
            type: ReviewType.WHALE,
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
