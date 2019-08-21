import React from 'react';
import {replace} from 'react-router-redux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {removeCover} from 'actions/layout';
import {getNavItems, getCurrentItem} from 'yii-steroids/reducers/navigation';
import {getUser} from 'yii-steroids/reducers/auth';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import _get from 'lodash/get';

import { dal as DalClass, html} from 'components';
const dal = DalClass();

import {ROUTE_PROFILE, ROUTE_USER, ROUTE_USER_DONATION} from 'routes';
import ProfileSidebar from './views/ProfileSidebar';
import NavItemSchema from 'types/NavItemSchema';
import UserSchema from 'types/UserSchema';
import routes from 'routes';

import './ProfileLayout.scss';
import Link from 'yii-steroids/ui/nav/Link';
import UserRole from 'enums/UserRole';


const bem = html.bem('ProfileLayout');

@connect(
    state => {
        const address = _get(getCurrentRoute(state), 'params.address');
        const isMe = !address;
        const contextUser = getUser(state);
        const isRedirectToProfile = address === _get(contextUser, 'address');
        const currentItem = getCurrentItem(state);

        return {
            currentItem,
            address,
            isMe,
            isRedirectToProfile,
            contextUser: isMe ? contextUser : null,
            routeId: _get(getCurrentRoute(state), 'id'),
            profileNavItems: getNavItems(state, isMe ? ROUTE_PROFILE : ROUTE_USER, {address}),
        };
    }
)
@dal.hoc(
    props => {
        if (!props.address) {
            return {};
        }
        return dal.getUser(props.address)
            .then(profileUser => ({profileUser}));
    }
)
export default class ProfileLayout extends React.PureComponent {

    static propTypes = {
        contextUser: UserSchema,
        profileUser: UserSchema,
        routeId: PropTypes.string,
        profileNavItems: PropTypes.arrayOf(NavItemSchema),
    };

    componentWillMount() {
        this.props.dispatch(removeCover);

        if (this.props.isRedirectToProfile) {
            this.props.dispatch(replace('/profile/projects'));
        }
    }

    componentWillReceiveProps(nextProps) {
        //redirect from /donation to /grants
        if (_get(this.props, 'currentItem.id') === ROUTE_USER_DONATION && _get(this.props, 'profileUser.role') === UserRole.WHALE) {
            this.props.dispatch(replace(_get(this.props, 'match.url') + '/grants'));
        }

    };

    render() {
        const user = this.props.isMe ? this.props.contextUser : this.props.profileUser;
        if (!user) {
            return null;
        }

        const routeParentId = this.props.isMe ? ROUTE_PROFILE : ROUTE_USER;
        const ContentComponent = _get(routes, ['items', routeParentId, 'items', this.props.routeId, 'component']);
        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col col_tablet-count-4'}>
                            <div className={bem.element('sidebar')}>
                                <ProfileSidebar
                                    isMe={this.props.isMe}
                                    user={user}
                                />
                            </div>
                        </div>
                        <div className='col col_tablet-count-8'>
                            <div className={bem.element('nav-container')}>
                                <div className={bem.element('nav')}>
                                    {this.props.profileNavItems
                                        .filter(item => item.isNavVisible !== false)
                                        .filter(item => (item.rolesUser || item.roles).includes(user.role || null))
                                        .map(item => (
                                            <Link
                                                key={item.id}
                                                className={bem.element('nav-item', {
                                                    'is-active': item.isActive,
                                                })}
                                                toRoute={item.id}
                                                toRouteParams={{
                                                    address: user.address,
                                                }}
                                                noStyles
                                            >
                                                <div className={bem.element('nav-icon')}>
                                                    <span className={`Icon ${item.isActive ? item.icon + '_green' : item.icon}`}/>
                                                </div>
                                                {item.label}
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className={bem.element('content')}>
                                {ContentComponent && (
                                    <ContentComponent
                                        isMe={this.props.isMe}
                                        user={user}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
