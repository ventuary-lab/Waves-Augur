import Enum from './Enum';

export default class FeedTypeEnum extends Enum {

    static VOTE = 'vote';
    static DONATE = 'donate';
    static WHALE = 'whale';

    static getLabels() {
        return {
            [this.VOTE]: __('Voting'),
            [this.DONATE]: __('Crowdfunding'),
            [this.WHALE]: __('Grant'),
        };
    }

}
