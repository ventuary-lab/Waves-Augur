
const TELEGRAM_API_URL = process.env.TELEGRAM_API_URL || 'https://api.telegram.org/';
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '777';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@testdaonotifications';

module.exports = {
    TELEGRAM_API_URL,
    TELEGRAM_TOKEN,
    TELEGRAM_CHAT_ID
}