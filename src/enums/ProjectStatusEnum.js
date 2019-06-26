import Enum from './Enum';

export default class SocialEnum extends Enum {

    static VOTING = 'voting';
    static CROWDFUND = 'crowdfund';
    static GRANT = 'grant';
    static CANCELLED = 'cancelled';

    static getLabels() {
        return {
            [this.VOTING]: __('Voting'),
            [this.CROWDFUND]: __('Crowdfund'),
            [this.GRANT]: __('Grant'),
            [this.CANCELLED]: __('Cancelled'),
        };
    }
}
