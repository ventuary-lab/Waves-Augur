import Enum from './Enum';

export default class SocialEnum extends Enum {

    static TWITTER = 'twitter';
    static FACEBOOK = 'facebook';
    static INSTAGRAM = 'instagram';
    static TELEGRAM = 'telegram';

    static getLabels() {
        return {
            [this.TWITTER]: __('twitter'),
            [this.FACEBOOK]: __('facebook'),
            [this.INSTAGRAM]: __('instagram'),
            [this.TELEGRAM]: __('telegram'),
        };
    }

    static getCssClasses() {
        return {
            [this.TWITTER]: 'Icon Icon__twitter',
            [this.FACEBOOK]: 'Icon Icon__facebook',
            [this.INSTAGRAM]: 'Icon Icon__instagram',
            [this.TELEGRAM]: 'Icon Icon__telegram',
        };
    }
}
