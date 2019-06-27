import Enum from './Enum';

export default class ProjectTierEnum extends Enum {

    static AMOUNT_1 = 'amount_1';
    static AMOUNT_2 = 'amount_2';
    static AMOUNT_3 = 'amount_3';
    static AMOUNT_4 = 'amount_4';
    static AMOUNT_5 = 'amount_5';

    static getLabels() {
        return {
            [this.AMOUNT_1]: 10,
            [this.AMOUNT_2]: 50,
            [this.AMOUNT_3]: 250,
            [this.AMOUNT_4]: 1250,
            [this.AMOUNT_5]: 6250,
        };
    }

}
