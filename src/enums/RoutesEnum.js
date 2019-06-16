import Enum from './Enum';

export default class RoutesEnum extends Enum {

    static MAIN = 'main';
    static ABOUT = 'about';
    static NEWS = 'news';
    static COMMUNITY = 'community';
    static TEST = 'test';

    static getLabels() {
        return {
            [this.MAIN]: __('Главная'),
            [this.ABOUT]: __('О проекте'),
            [this.NEWS]: __('Новости'),
            [this.COMMUNITY]: __('Сообщество'),
            [this.TEST]: __('Тест'),
        };
    }
}
