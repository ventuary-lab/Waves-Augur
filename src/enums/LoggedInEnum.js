
import Enum from './Enum';

export default class LoggedInEnum extends Enum {

    static LOGGED_BY_NO_KEEPER = 'loggedByNoKeeper';
    static LOGGED_BY_KEEPER = 'loggedByKeeperInstalled';
    static LOGGED_OUT = 'loggedOut';

    static getKeys() {
        return [
            this.LOGGED_BY_NO_KEEPER,
            this.LOGGED_BY_KEEPER,
            this.LOGGED_OUT
        ];
    }
}
