import Enum from './Enum';

export default class UserRole extends Enum {

    static GUEST = null;
    static INVITED = 'invited';
    static SPEND_INVITE = 'spend_invite';
    static REGISTERED = 'registered';
    static WHALE = 'whale';
    static GENESIS = 'genesis';
    static ANONYMOUS = 'anonymous';

    static getKeys() {
        return [
            this.GUEST,
            this.REGISTERED,
            this.INVITED,
            this.SPEND_INVITE,
            this.WHALE,
            this.GENESIS,
            this.ANONYMOUS,
        ];
    }

    static getAuth() {
        return [
            this.REGISTERED,
            this.WHALE,
            this.GENESIS,
        ];
    }

}
