const _orderBy = require('lodash/orderBy');
const _trim = require('lodash/trim');
const _sum = require('lodash/sum');

const BaseCollection = require('../base/BaseCollection');
const contractConfig = require('../config/contract');
const UserRole = require('../enums/UserRole');

module.exports = class Users extends BaseCollection {

    getKeys(id = '([A-Za-z0-9]{35})') {
        return [
            `wl_sts_${id}`,
            `wl_ref_${id}`,
            `wl_bio_${id}`,
            `review_[\\w-]+_${id}_text_id:[0-9]+`,
            `review_[\\w-]+_${id}_tier_id:[0-9]+`,
        ];
    }

    /**
     * @param {string} address
     * @returns {Promise}
     */
    async getUser(address) {
        const user = await this.getItem(address);

        if (user) {
            return user;
        }

        //todo fix
        //anon mb?
        if (!user) {
            return  await this._prepareItem(address, {
                address: address,
                id: address
            });
        }
    }

    /**
     * @returns {Promise}
     */
    async getUsers() {
        let users = await this.getItemsAll();
        users = users.filter(user => user.profile && user.profile.name && ![UserRole.INVITED, UserRole.SPEND_INVITE].includes(user.role));
        users = _orderBy(users, 'activity', 'desc');
        return users;
    }

    /**
     * @param {string} address
     * @returns {Promise}
     */
    async getUserInvites(address) {
        let users = await this.getItemsAll();
        users = users.filter(user => user.invitedBy && user.invitedBy.address === address && user.role !== UserRole.SPEND_INVITE);
        users = _orderBy(users, 'createTime', 'desc');
        return users;
    }

    async _prepareItem(address, item) {
        const invitedByAddress = item['wl_ref_' + address];
        const profile = item['wl_bio_' + address] || {};
        const role = item['wl_sts_' + address];
        const specialRoles = {
            [this.app.dApp]: UserRole.GENESIS,
            [contractConfig.adminAddress]: UserRole.ADMIN,
        };

        // Get user activity
        const activities = Object.keys(item)
            .map(key => {
                const match = /review_([0-9a-z-]+)_([0-9a-z-]+)_text_id:([0-9]+)/i.exec(key);
                if (match) {
                    const uid = match[1];
                    const tierNumber = item[`review_${uid}_${address}_tier_id:${match[3]}`];
                    return tierNumber && contractConfig.variables.TIERS[tierNumber - 1];
                }
                return null;
            })
            .filter(Boolean);

        return {
            address: _trim(address),
            activity: _sum(activities) + 1,
            role: specialRoles[address] || role || UserRole.ANONYMOUS,
            invitedBy: invitedByAddress
                ? {address: invitedByAddress}
                : null,
            profile,
        };
    }

    async _postProcessItem(address, item) {
        return {
            ...item,
            invitedBy: item.invitedBy
                ? await this.app.collections.users.getItem(item.invitedBy.address)
                : null,
        };
    }

};
