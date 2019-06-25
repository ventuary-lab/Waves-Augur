import Enum from './Enum';

export default class SocialEnum extends Enum {

    static TWITTER = 'twitter';
    static FACEBOOK = 'facebook';
    static LINKEDIN = 'linkedin';
    static INSTAGRAM = 'instagram';
    static TELEGRAM = 'telegram';
    static WEBSITE = 'website';

    static getLabels() {
        return {
            [this.TWITTER]: __('Twitter'),
            [this.FACEBOOK]: __('Facebook'),
            [this.LINKEDIN]: __('Linkedin'),
            [this.INSTAGRAM]: __('Instagram'),
            [this.TELEGRAM]: __('Telegram'),
            [this.WEBSITE]: __('Your website'),
        };
    }

    static getCssClasses() {
        return {
            [this.TWITTER]: 'Icon Icon__twitter',
            [this.FACEBOOK]: 'Icon Icon__facebook',
            [this.LINKEDIN]: '',
            [this.INSTAGRAM]: 'Icon Icon__instagram',
            [this.TELEGRAM]: 'Icon Icon__telegram',
            [this.WEBSITE]: '',
        };
    }
}
