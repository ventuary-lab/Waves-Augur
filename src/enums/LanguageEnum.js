import Enum from 'yii-steroids/base/Enum';

export default class LanguageEnum extends Enum {

    static RU = 'ru';
    static EN = 'en';
    static ES = 'es';

    static getKeys() {
        return [
            this.RU,
            this.EN,
            this.ES,
        ];
    }

}
