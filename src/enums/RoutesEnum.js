import Enum from './Enum';

export default class RoutesEnum extends Enum {

    static MAIN = 'main';
    static ABOUT = 'about';
    static FEED = 'feed';
    static COMMUNITY = 'community';
    static TEST = 'test';
    static CAMPAIGNS = 'campaigns';
    static PROFILE = 'profile';
    static PROFILE_INBOX = 'profile_inbox';
    static PROFILE_DONATION = 'profile_donation';
    static PROFILE_PROJECTS = 'profile_projects';
    static PROFILE_VOTING = 'profile_voting';
    static PROFILE_INVITED = 'profile_invited';


    static getLabels() {
        return {
            [this.MAIN]: __('Main'),
            [this.ABOUT]: __('About'),
            [this.FEED]: __('Feed'),
            [this.COMMUNITY]: __('Community'),
            [this.CAMPAIGNS]: __('Campaigns'),
            [this.TEST]: __('Test'),
            [this.PROFILE]: __('My profile'),
            [this.PROFILE_INBOX]: __('Inbox'),
            [this.PROFILE_DONATION]: __('Donation'),
            [this.PROFILE_PROJECTS]: __('Projects'),
            [this.PROFILE_VOTING]: __('Voting'),
            [this.PROFILE_INVITED]: __('Invited Users'),
        };
    }
}
