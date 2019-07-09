import Enum from './Enum';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

export default class ProjectStateEnum extends Enum {

    static FEATURED = 'featured';
    static FEED = 'feed';
    static NEW = 'new';
    static FINISHED = 'finished';

    static getLabels() {
        return {
            [this.FEATURED]: __('Featured'),
            [this.FEED]: __('Feed'),
            [this.NEW]: __('New'),
            [this.FINISHED]: __('Finished'),
        };
    }

    static getCssClasses() {
        return {
            [this.FEATURED]: 'Icon__star',
            [this.FEED]: 'Icon__donation',
            [this.NEW]: 'Icon__star',
            [this.FINISHED]: 'Icon__rocket-success',
        };
    }


}
