import {
    ROUTE_PROFILE_PROJECTS,
    ROUTE_PROFILE_INVITED
} from 'routes';
import { openModal } from 'yii-steroids/actions/modal';
import { store } from 'components';
import ProjectWizardModal from 'modals/ProjectWizardModal';
import InviteUserModal from 'modals/InviteUserModal';

export const customRouteProps = {
    [ROUTE_PROFILE_PROJECTS]: {
        placeholder: 'Add new project',
        onClick: () => {
            store.dispatch(openModal(ProjectWizardModal));
        }
    },
    [ROUTE_PROFILE_INVITED]: {
        placeholder: 'Invite new user',
        onClick: () => {
            store.dispatch(openModal(InviteUserModal));
        }
    }
};

export function getUserNavItems (props, user) {
    const { profileNavItems } = props;

    const res = profileNavItems
        .filter(item => item.roles ? item.roles.includes(user.role) : false)
        .map(item => {

            return !customRouteProps[item.id] ? item : {
                ...item,
                ...customRouteProps[item.id]
            };
        });

    return res;
}