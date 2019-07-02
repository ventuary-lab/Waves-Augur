import Enum from './Enum';

export default class ProjectVoteEnum extends Enum {

    static FEATURED = 'featured';
    static DELISTED = 'delisted';

    static getKeys() {
        return [
            this.FEATURED,
            this.DELISTED,
        ];
    }
}
