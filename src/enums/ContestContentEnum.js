import Enum from './Enum';

export default class ContestContentEnum extends Enum {

    static APP_DESCRIPTION = 'appDescription';
    static APP_DESCRIPTION_ADDITIONAL = 'appDescriptionAdditional';
    static APP_DESCRIPTION_PLACEHOLDER = 'appDescriptionPlaceholder';
    static THEME = 'theme';
    static THEME_DESCRIPTION = 'themeDescription';
    static THEME_DESCRIPTION_PLACEHOLDER = 'themeDescriptionPlaceholder'
    static SCREEN_DESCRIPTION = 'screenDescription';
    static SCREEN_DESCRIPTION_PLACEHOLDER = 'screenDescriptionPlaceholder';

    static getLabels() {
        return {
            [this.APP_DESCRIPTION]: __('Application Description'),
            [this.THEME]: __('Application Visual Style'),
            [this.THEME_DESCRIPTION]: __('Application Visual Style (Stylistic Requirements for the UI)'),
            [this.SCREEN_DESCRIPTION]: __('List of Main Screens (Screen Title | Screen Description)'),
        };
    }

    static getPlaceholders() {
        return {
            [this.APP_DESCRIPTION]: __('Example: Beauty and Wellnes the uber way. Via the app, users can request a service of beauty and wellnes, like manicure, haircut or many other services. Service provider...'),
            [this.APP_DESCRIPTION_ADDITIONAL]: __('(Detailed introduction of the requested application idea (“Elevator Pitch”))'),
            [this.APP_DESCRIPTION_PLACEHOLDER]: __('Ex.: A customer referral program that rewards platform users for inviting new customers. The rewarding mechanism is...'),
            [this.THEME_DESCRIPTION_PLACEHOLDER]: __('Ex.: The application should use the red color scheme and provide a night mode dark theme.'),
            [this.THEME]: __('Example: I think that colors should be pastel. Slogan can be something like "Beauty and Wellness Now and Here".\ I am also running a LOGO CONTEST here in 99Designs ...'),
            [this.SCREEN_DESCRIPTION_PLACEHOLDER]: __('Ex.: Share Referral Screen - On this screen, the user should be able to copy and send a referral link to their friends or share it on social media'),
        }
    }

    static getPlaceholder(id) {
        return this.getPlaceholders()[id] || '';
    }
}
