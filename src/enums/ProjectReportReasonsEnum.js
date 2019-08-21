import Enum from './Enum';

export default class ProjectReportReasonsEnum extends Enum {

    static OFFENSIVE = 'offensive';
    static SPAM = 'spam';
    static SEXUALLY = 'sexually';
    static SCAM = 'scam';
    static VIOLENT = 'violent';
    static POLITICAL = 'political';

    static getLabels() {
        return {
            [this.OFFENSIVE]: __('I find it offensive'),
            [this.SPAM]: __('It’s spam'),
            [this.SEXUALLY]: __('It’s sexually inappropriate'),
            [this.SCAM]: __('It’s a scam or it’s misleading'),
            [this.VIOLENT]: __('It’s violent or prohibited content'),
            [this.POLITICAL]: __('It refers to a political candidate or issue'),
        };
    }

    static getContexts() {
        return {
            [this.OFFENSIVE]: __('is offensive'),
            [this.SPAM]: __('is spam'),
            [this.SEXUALLY]: __('is sexually inappropriate'),
            [this.SCAM]: __('is a scam or it’s misleading'),
            [this.VIOLENT]: __('is violent or prohibited content'),
            [this.POLITICAL]: __('refers to a political candidate or issue'),
        };
    }

    static getContext(id) {
        return this.getContexts()[id] || '';
    }
}
