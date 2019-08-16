import Enum from './Enum';
import moment from 'moment';
import ProjectReportEnum from './ProjectReportEnum';

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
    static MODERATION = 'moderation';

    static getLabels() {
        return {
            [this.VOTING]: __('Voting'),
            [this.CROWDFUND]: __('Crowdfund'),
            [this.WAITING_GRANT]: __('Waiting grant'),
            [this.GRANT]: __('Grant'),
            [this.REJECTED]: __('Rejected'),
            [this.MODERATION]: __('Moderation'),
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
    static getStatus(contractStatus, blocks, height, lastReports) {

        // Has reports
        if (lastReports && lastReports.length > 0) {

            const positive = lastReports.filter(item => item.report.direction === ProjectReportEnum.POSITIVE);
            const negative = lastReports.filter(item => item.report.direction === ProjectReportEnum.NEGATIVE);

            if ((negative && negative.length === 1) && (positive && positive.length <= 1)) {
                return this.MODERATION;
            }
        }


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
