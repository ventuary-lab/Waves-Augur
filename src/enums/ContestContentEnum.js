import Enum from './Enum';

export default class ContestContentEnum extends Enum {

    static APP_DESCRIPTION = 'appDescription';
    static THEME = 'theme';
    static SCREEN_DESCRIPTION = 'screenDescription';

    static getLabels() {
        return {
            [this.APP_DESCRIPTION]: __('App Description'),
            [this.THEME]: __('The style and theme of the app'),
            [this.SCREEN_DESCRIPTION]: __('Screen Descriptions'),
        };
    }

    static getPlaceholders() {
        return {
            [this.APP_DESCRIPTION]: __('Example: Beauty and Wellnes the uber way. Via the app, users can request a service of beauty and wellnes, like manicure, haircut or many other services. Service provider...'),
            [this.THEME]: __('Example: I think that colors should be pastel. Slogan can be something like "Beauty and Wellness Now and Here". I am also running a LOGO CONTEST here in 99Designs ...'),
            [this.SCREEN_DESCRIPTION]: __('Example: Screen one: Login/Registration. If user is registered, show Login and Password. Below this, there are two links: "Forgot username or password" and "Register ...'),
        };
    }

    static getPlaceholder(id) {
        return this.getPlaceholders()[id] || '';
    }

}
