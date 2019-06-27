import uuid from 'uuid/v4';
import moment from 'moment';

export default class DalHelper {

    static generateUid() {
        return uuid();
    }

    static dateNow() {
        return moment.utc().format('YYYY-MM-DD HH:mm:ss');
    }

}
