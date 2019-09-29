const axios = require('axios');

const {
    TELEGRAM_API_URL,
    TELEGRAM_TOKEN,
    TELEGRAM_CHAT_ID
} = require('./constants');

const DEFAULT_PHOTO_LINK = 'https://alpha-ventuary-dao.s3.amazonaws.com/uploads/cropped_96994c20-e146-11e9-b4b3-6dbd4331389b.jpeg';

class TelegramBotClient {
    constructor () {
        this.apiUrl = TELEGRAM_API_URL;
        this.botToken = TELEGRAM_TOKEN;
        this.chatId = TELEGRAM_CHAT_ID;
        this.apiRoute = this.constructLink(this.apiUrl, this.botToken);

        this.options = {
            sendPhoto: {
                chat_id: this.chatId,
                parse_mode: 'HTML'
            }
        };

        this.defaultMessages = {
            error: {
                error: true,
                message: 'Error occured'
            }
        };
    }

    constructLink (url, token) {
        return url + 'bot' + token;
    }

    async getMe () {
        const url = this.apiRoute + '/getMe';

        try {
            const response = await axios.get(url);
            const { data } = response;

            return data;
        } catch (err) {
            return this.defaultMessages.error;
        }
    }

    getTemplateLinkPrefix (request) {
        const { host } = request.headers;

        return host.includes('localhost') ? 'http://' + host : 'https://' + host;
    }

    async getNewProjectTemplate (request, project) {
        const {
            name,
            description,
            contest,
            expireCrowd,
            targetWaves,
            uid
        } = project;
        const { getTemplateLinkPrefix } = this;
        const getLinkTag = (name, url) => `<a href="${url}">${name}</a>`;
        const projectLink = `${getTemplateLinkPrefix(request)}/projects/${uid}`;
        let contestName, contestLink;
        if (contest) {
            contestLink = `${getTemplateLinkPrefix(request)}/api/v1/contests/${contest}`;
            
            try {
                const contestData = await axios.get(contestLink);
                contestName = contestData.data.name;
            } catch (err) {}
        };

        return [
            '\n',
            '🔹A new project has just been listed on the DAO! 🔹',
            '\n',
            `<b>Title:</b> ${getLinkTag(name, projectLink)}`,
            `<b>Description:</b> ${description}`,
            contest ? `<b>Contest: </b> ${getLinkTag(contestName, contestLink)}` : false,
            `<b>Crowdfunding ends:</b> ~${expireCrowd}`,
            `<b>Waves Target:</b> ${targetWaves}`,
            '\n',
            `Check out ${getLinkTag(name, projectLink)} now, donate, and earn a bonus of up to 150% of your donation if it receives a grant. To increase the chances of winning, write reviews and share!`,
        ].filter(Boolean).join('\n');
    }

    async sendProjectCreateMessage (request, project) {
        let { caption, logoUrl } = await this.getProjectCreateMessage(request, project);

        const url = this.apiRoute + '/sendPhoto';
        const options = {
            params: {
                ...this.options.sendPhoto,
                caption,
                photo: logoUrl || DEFAULT_PHOTO_LINK
            }
        };

        try {
            await axios.get(url, options);
            return {
                error: false,
                message: 'Successfuly sent telegram message'
            };
        } catch (err) {
            return {
                error: true,
                message: 'Message sending to telegram has failed'
            };
        }
    }

    async getProjectCreateMessage (request, project) {
        const { logoUrl } = project;
        const caption = await this.getNewProjectTemplate(request, project);

        return {
            caption,
            logoUrl
        };
    }

    getRoutes () {
        return {
            '/api/v1/telegram-bot/getMe/': async () => {
                return this.getMe();
            },
            '/api/v1/telegram-bot/projectCreateNotify/:uid/': async (request) => {
                try {
                    if (!request.params.uid) {
                        throw new Error();
                    }

                    const url = this.getTemplateLinkPrefix(request) + '/api/v1/projects/' + request.params.uid;
                    const project = await axios.get(url);

                    if (!project.data) {
                        throw new Error();
                    }

                    return this.sendProjectCreateMessage(request, project.data);
                } catch (err) {
                    return this.defaultMessages.error;
                }
            }
        };
    }
}

module.exports = TelegramBotClient;