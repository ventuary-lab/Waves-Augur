import uuid from 'uuid/v4';
import moment from 'components/DalComponent';

export default class DalHelper {

    static generateUid() {
        return uuid();
    }

    static dateNow() {
        return moment.utc().format('YYYY-MM-DD HH:mm:ss');
    }

    static dateToHeight(date) {
        let days = -1 * Math.floor(moment().diff(date, 'days', true));
        if (this.isTestMode) {
            // In test mode one block = 1 day
            return days;
        } else {
            // One block = 2 minutes
            return Math.round((days * 1440) / 2);
        }
    }

}
