import uuid from 'uuid/v4';
import moment from 'moment';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import UserRole from 'enums/UserRole';
import _get from 'lodash-es/get';

export default class DalHelper {

    static generateUid() {
        return uuid();
    }

    static dateNow() {
        return moment.utc().format('YYYY-MM-DD HH:mm:ss');
    }

    static getScope(item, user) {
        let scope = {
            canDonate: false,
            canWhale: false,
            canEdit: false,
            canContestWinner: false,
        };

        if (user && item) {
            if ((_get(item, 'author.address') || item.authorAdress) !== user.address) {
                if (user.role !== UserRole.WHALE) {
                    if (item.status === ProjectStatusEnum.CROWDFUND) {
                        scope.canDonate = true;
                    }
                } else if (item.status === ProjectStatusEnum.WAITING_GRANT) {
                    scope.canWhale = true;
                }
            } else {
                scope.canEdit = true;
            }

            if (user.role === UserRole.ADMIN) {
                if (item.contest && !item.contestWinner) {
                    scope.canContestWinner = true;
                }
            }
        }

        return scope;
    }


}
