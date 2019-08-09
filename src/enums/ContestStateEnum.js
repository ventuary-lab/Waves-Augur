import Enum from './Enum';

export default class ContestStateEnum extends Enum {

    static FEATURED = 'featured';
    static NEW = 'new';
    static FINISHED = 'finished';

    static getLabels() {
        return {
            [this.FEATURED]: __('Featured'),
            [this.NEW]: __('New'),
            [this.FINISHED]: __('Finished'),
        };
    }

    static getCssClasses() {
        return {
            [this.FEATURED]: 'Icon__star',
            [this.NEW]: 'Icon__star',
            [this.FINISHED]: 'Icon__rocket-success',
        };
    }
}
