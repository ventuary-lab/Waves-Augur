import Enum from './Enum';

export default class LanguageEnum extends Enum {

    static RU = 'ru';
    static EN = 'en';
    static PT = 'pt';

    static getKeys() {
        return [
            this.RU,
            this.EN,
            this.PT,
        ];
    }

}
