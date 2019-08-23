import Enum from './Enum';

export default class ContestStatusEnum extends Enum {


    static OPEN = 'open';
    static COMPLETED = 'Completed';


    static getLabels() {
        return {
            [this.OPEN]: __('Active'),
            [this.COMPLETED]: __('Completed'),
        };
    }
}
