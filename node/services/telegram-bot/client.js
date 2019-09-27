const axios = require('axios');

const {
    TELEGRAM_API_URL,
    TELEGRAM_TOKEN
} = require('./constants');

class TelegramBotClient {
    constructor () {
        this.apiUrl = TELEGRAM_API_URL;
        this.botToken = TELEGRAM_TOKEN;
        this.apiRoute = this.constructLink(this.apiUrl, this.botToken);
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
            return {
                error: true,
                message: 'Error occured'
            };
        }
    }

    getRoutes () {
        return {
            '/api/v1/telegram-bot/getMe/': async () => {
                return this.getMe();
            }
        };
    }
}

module.exports = TelegramBotClient;