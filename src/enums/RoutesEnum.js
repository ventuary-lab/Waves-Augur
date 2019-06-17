import Enum from './Enum';

export default class RoutesEnum extends Enum {

    static MAIN = 'main';
    static ABOUT = 'about';
    static FEED = 'feed';
    static COMMUNITY = 'community';
    static TEST = 'test';
    static CAMPAIGNS = 'campaigns';
    static PROFILE = 'profile';
    static INBOX = 'inbox';

    static getLabels() {
        return {
            [this.MAIN]: __('Main'),
            [this.ABOUT]: __('About'),
            [this.FEED]: __('Feed'),
            [this.COMMUNITY]: __('Community'),
            [this.CAMPAIGNS]: __('Campaigns'),
            [this.PROFILE]: __('My profile'),
            [this.INBOX]: __('Inbox'),
            [this.TEST]: __('Test'),
        };
    }
}
