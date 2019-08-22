import Enum from './Enum';
import moment from 'moment';

export default class ProjectStatusEnum extends Enum {

    //static NEW = 'new';
    //static REVEAL = 'reveal';
    //static COMMIT = 'commit';
    //static FEATURED = '';
    //static DELISTED = '';
    //static BUYOUT = '';

    static VOTING = 'voting';
    static CROWDFUND = 'crowdfund';
    static WAITING_GRANT = 'waiting_grant';
    static GRANT = 'grant';
    static REJECTED = 'rejected';

    static getLabels() {
        return {
            [this.VOTING]: __('Voting'),
            [this.CROWDFUND]: __('Crowdfunding'),
            [this.WAITING_GRANT]: __('Waiting grant'),
            [this.GRANT]: __('Grant'),
            [this.REJECTED]: __('Rejected'),
        };
    }

    /**
     * Contract statuses
     *   new               Новый
     *   voting_commit     Голосование
     *   voting_reveal     Набрано нужное количество голосов
     *   featured          Результат голосования - YES, начался краудфайдинг
     *   delisted          Результат голосования - NO, проект отменент
     *   cashout           Выплачены призы
     *   buyout            Выплачен грант
     *
     * @param {string} contractStatus
     * @param {number} blocks
     * @param {number} height
     * @returns {string}
     */
    static getStatus(contractStatus, blocks, height) {
        // Voting
        if (['new', 'voting_commit', 'voting_reveal'].includes(contractStatus)) {
            return height < blocks.votingEnd ? this.VOTING : this.REJECTED;
        }

        // Crowdfund
        if (contractStatus === 'delisted') {
            return this.REJECTED;
        }
        if (contractStatus === 'featured') {
            return height < blocks.crowdfundEnd ? this.CROWDFUND : this.WAITING_GRANT;
        }

        // Granted
        return contractStatus === 'buyout' ? this.GRANT : this.WAITING_GRANT;
    }

    static getDaysLeft(status, project) {
        const {expireVoting, expireCrowd, expireWhale} = project;

        if (status === this.VOTING) {
            return this.getDaysDiff(expireVoting);
        }

        if (status === this.CROWDFUND) {
            return this.getDaysDiff(expireCrowd);
        }

        if (status === this.WAITING_GRANT) {
            return this.getDaysDiff(expireWhale);
        }

        if (status === this.GRANT) {
            return null;
        }
    }

    static getDaysDiff(date) {
        if (moment(date).diff(moment().utc(), 'days') < 0) {
            return null;
        }

        return moment(date).diff(moment().utc(), 'days');
    }
}
