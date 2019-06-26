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
            [this.WEBSITE]: __('Website'),
        };
    }

    static getCssClasses() {
        return {
            [this.TWITTER]: 'Icon Icon__twitter',
            [this.FACEBOOK]: 'Icon Icon__facebook',
            [this.LINKEDIN]: 'Icon Icon__linkedin',
            [this.INSTAGRAM]: 'Icon Icon__instagram',
            [this.TELEGRAM]: 'Icon Icon__telegram',
            [this.WEBSITE]: 'Icon Icon__website',
        };
    }

    static getRegExps() {
        return {
            [this.TWITTER]: /(www\.)?twitter\.com\//,
            [this.FACEBOOK]: /(www\.)?facebook\.com\//,
            [this.LINKEDIN]: /(www\.)?linkedin\.com\//,
            [this.INSTAGRAM]: /(www\.)?instagram\.com\//,
            [this.TELEGRAM]: /(www\.)?tg\.me\//,
            [this.WEBSITE]: /[a-z]+\:\/\//,
            //[this.VK]: /(www\.)?vk\.com\//,
            //[this.YOUTUBE]: /(www\.)?youtube\.com\//,
            //[this.ODNOKLASSNIKI]: /(www\.)?ok\.ru\//,
        };
    }

    static getHosts() {
        return {
            [this.TWITTER]: 'twitter.com/',
            [this.FACEBOOK]: 'facebook.com/',
            [this.LINKEDIN]: 'linkedin.com/',
            [this.INSTAGRAM]: 'instagram.com/',
            [this.TELEGRAM]: 'tg.me/',
            //[this.VK]: 'www.vk.com/',
            //[this.YOUTUBE]: 'www.youtube.com/',
            //[this.ODNOKLASSNIKI]: 'ok.ru/',
        };
    }

    static formatLink(link, id) {
        const hostRegExp = this.getRegExps()[id];
        const isHostExist = hostRegExp ? hostRegExp.test(link) : true;

        const isProtocolExists = /[a-z]+\:\/\//.test(link);
        return isHostExist
            ? (!isProtocolExists ? 'https://' : '') + link
            : 'https://' + this.getHost(id) + link;
    }

    static getHost(id) {
        return this.getHosts()[id] || '';
    }

}
