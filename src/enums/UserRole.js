import Enum from 'yii-steroids/base/Enum';

export default class UserRole extends Enum {

    static GUEST = null;
    static USER = 'user';
    static MANAGER = 'manager';
    static ADMIN = 'admin';

    static getKeys() {
        return [
            this.GUEST,
            this.USER,
            this.MANAGER,
            this.ADMIN,
        ];
    }

}
