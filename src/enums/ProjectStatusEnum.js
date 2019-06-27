import Enum from './Enum';
import moment from 'moment';

export default class ProfileStatusEnum extends Enum {

    static VOTING = 'voting';
    static CROWDFUND = 'crowdfund';
    static WAITING_GRANT = 'waiting_grant';
    static GRANT = 'grant';
    static CANCELLED = 'cancelled';

    static getLabels() {
        return {
            [this.VOTING]: __('Voting'),
            [this.CROWDFUND]: __('Crowdfund'),
            [this.WAITING_GRANT]: __('Waiting grant'),
            [this.GRANT]: __('Grant'),
            [this.CANCELLED]: __('Cancelled'),
        };
    }

    static getStatus(project) {
        if (moment() < moment(project.expireVoting)) {
            return this.VOTING;
        }

        if (moment(project.expireVoting) < moment() < moment(project.expireCrowd)) {
            return this.CROWDFUND;
        }

        if (moment(project.expireCrowd) < moment() < moment(project.expireWhale)) {
            return this.WAITING_GRANT;
        }

        if (moment(project.expireWhale) < moment()) {
            return this.GRANT;
        }
    }

    static getDaysLeft(status, project) {
        if (status === this.VOTING) {
            return moment(project.expireVoting).diff(moment(), 'days');
        }

        if (status === this.CROWDFUND) {
            return moment(project.expireCrowd).diff(moment(), 'days');
        }

        if (status === this.WAITING_GRANT) {
            return moment(project.expireWhale).diff(moment(), 'days');
        }

        if (status === this.GRANT) {
            return null;
        }
    }
}
