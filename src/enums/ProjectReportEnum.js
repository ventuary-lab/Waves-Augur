import Enum from './Enum';

export default class ProjectReportEnum extends Enum {

    static POSITIVE = 'positive';
    static NEGATIVE = 'negative';

    static getKeys() {
        return [
            this.POSITIVE,
            this.NEGATIVE,
        ];
    }
}
