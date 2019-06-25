import Enum from './Enum';

export default class UserRole extends Enum {

    static GUEST = null;
    static REGISTERED = 'registered';
    static INVITED = 'invited';
    static WHALE = 'whale';

    static getKeys() {
        return [
            this.GUEST,
            this.REGISTERED,
            this.INVITED,
            this.WHALE,
        ];
    }

}
