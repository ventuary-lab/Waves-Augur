module.exports = class ContestFilter {

    static FEATURED = 'featured';
    static NEW = 'new';
    static FINISHED = 'finished';

    static getKeys() {
        return [
            this.FEATURED,
            this.NEW,
            this.FINISHED,
        ];
    }

};
