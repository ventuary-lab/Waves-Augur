import Enum from './Enum';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

export default class ProjectStateEnum extends Enum {

    static FEATURED = 'featured';
    static DONATION = 'donation';
    static SUCCESS = 'success';

    static getLabels() {
        return {
            [this.FEATURED]: __('Featured'),
            [this.DONATION]: __('Donation'),
            [this.SUCCESS]: __('Success'),
        };
    }

    static getState(status) {
        if (status === ProjectStatusEnum.VOTING) {
            return this.FEATURED;
        }

        if (status === ProjectStatusEnum.CROWDFUND) {
            return this.DONATION;
        }

        if (status === ProjectStatusEnum.WAITING_GRANT || ProjectStatusEnum.GRANT) {
            return this.SUCCESS;
        }
    }

    static getCssClasses() {
        return {
            [this.FEATURED]: __('Icon__star'),
            [this.DONATION]: __('Icon__donation'),
            [this.SUCCESS]: __('Icon__rocket-success'),
        };
    }


}
