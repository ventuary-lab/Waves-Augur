import {
    ROUTE_PROFILE_PROJECTS,
    ROUTE_PROFILE_INVITED
} from 'routes';


export const customRouteProps = {
    [ROUTE_PROFILE_PROJECTS]: {
        placeholder: 'Add new project'
    },
    [ROUTE_PROFILE_INVITED]: {
        placeholder: 'Invite new user'
    }
}

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