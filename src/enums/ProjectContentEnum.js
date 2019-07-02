import Enum from './Enum';

export default class ProjectContentEnum extends Enum {

    static PROBLEM = 'problem';
    static SOLUTION = 'solution';
    static X_FACTOR = 'xFactor';
    static MVP = 'mvp';
    static LARGE_SCALE_ADOPTION = 'largeScaleAdoption';
    static IMPACT_ON_USER = 'impactOnUser';
    static IMPACT_ON_USER_CONTEXT = 'impactOnUserContext';
    static IMPACT_ON_USER_SOCIETY = 'impactOnUserSociety';
    static CODE_VALIDATION = 'codeValidation';
    static LEGAL_ARRANGEMENTS = 'legalArrangements';
    static OPEN_SOURCE_STRATEGY = 'openSourceStrategy';
    static INTERCONNECTEDNESS = 'interconnectedness';

    static getLabels() {
        return {
            [this.PROBLEM]: __('Problem'),
            [this.SOLUTION]: __('Solution'),
            [this.X_FACTOR]: __('X-Factor'),
            [this.MVP]: __('MVP'),
            [this.LARGE_SCALE_ADOPTION]: __('Large Scale Adoption'),
            [this.IMPACT_ON_USER]: __('Impact On User'),
            [this.IMPACT_ON_USER_CONTEXT]: __('Impact On User Context'),
            [this.IMPACT_ON_USER_SOCIETY]: __('Impact On User Society'),
            [this.CODE_VALIDATION]: __('Code Validation'),
            [this.LEGAL_ARRANGEMENTS]: __('Legal Arrangements'),
            [this.OPEN_SOURCE_STRATEGY]: __('Open Source Strategy'),
            [this.INTERCONNECTEDNESS]: __('Interconnectedness'),
        };
    }

}
