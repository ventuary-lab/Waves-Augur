const { constructGtag } = require('../../../add-gtag');

class RedirectController {
    static socials = [
        { href: 'https://twitter.com/VentuaryDAO', alt: 'Twitter' },
        { href: 'https://www.linkedin.com/company/ventuary/', alt: 'LinkedIn' },
        { href: 'https://t.me/ventuary_dao', alt: 'Telegram' },
        { href: 'https://www.facebook.com/VentuaryDAO', alt: 'Facebook' },
        { href: 'https://medium.com/@VentuaryDAO', alt: 'Medium' },
        { href: 'https://www.youtube.com/channel/UCOTTc5eiq7nAYF47kDD3Rdg', alt: 'YouTube' },
        { href: 'https://www.reddit.com/user/Ventuary-DAO', alt: 'Reddit' },
        { href: 'https://discord.gg/CbHBfC9', alt: 'Discord' }
    ];

    static handleRedirectByRequest (request, response) {
        const { target } = request.params;

        const targetIndex = this.socials.findIndex(
            item => item.alt.toLowerCase() === target.toLowerCase()
        );

        if (targetIndex === -1) {
            response.redirect('/');
            return;
        };

        response.redirect(this.socials[targetIndex].href);
    }
}

module.exports = RedirectController;