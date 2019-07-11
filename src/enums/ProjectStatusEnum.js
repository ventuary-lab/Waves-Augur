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
            [this.CROWDFUND]: __('Crowdfund'),
            [this.WAITING_GRANT]: __('Waiting grant'),
            [this.GRANT]: __('Grant'),
            [this.REJECTED]: __('Rejected'),
        };
    }

    static getStatus(blocks, height) {
        if (height < blocks.votingEnd) {
            return this.VOTING;
        }
        if (height < blocks.crowdfundEnd) {
            return this.CROWDFUND;
        }
        if (height < blocks.whaleEnd) {
            //return this.WAITING_GRANT;
        }
        return this.WAITING_GRANT;
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
