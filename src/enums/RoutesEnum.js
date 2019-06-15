import Enum from 'yii-steroids/base/Enum';

export default class RoutesEnum extends Enum {

    static MAIN = 'main';
    static ABOUT = 'about';
    static NEWS = 'news';
    static COMMUNITY = 'community';

    static getLabels() {
        return {
            [this.MAIN]: __('Главная'),
            [this.ABOUT]: __('О проекте'),
            [this.NEWS]: __('Новости'),
            [this.COMMUNITY]: __('Сообщество'),
        };
    }
}
