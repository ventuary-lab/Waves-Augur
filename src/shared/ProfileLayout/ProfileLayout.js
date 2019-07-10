import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import {getUser} from 'yii-steroids/reducers/auth';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import _get from 'lodash/get';

import {dal, html} from 'components';
import {ROUTE_PROFILE, ROUTE_USER} from 'routes';
import ProfileSidebar from './views/ProfileSidebar';
import NavItemSchema from 'types/NavItemSchema';
import UserSchema from 'types/UserSchema';
import routes from 'routes';

import './ProfileLayout.scss';
import Link from 'yii-steroids/ui/nav/Link';

const bem = html.bem('ProfileLayout');

@connect(
    state => {
        const address = _get(getCurrentRoute(state), 'params.address');
        const isMe = !address;
        return {
            address,
            isMe,
            user: isMe ? getUser(state) : null,
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
            .then(user => ({user}));
    }
)
export default class ProfileLayout extends React.PureComponent {

    static propTypes = {
        user: UserSchema,
        routeId: PropTypes.string,
        profileNavItems: PropTypes.arrayOf(NavItemSchema),
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.address !== nextProps.address) {
            this.props.fetch();
        }
    };

    render() {
        if (!this.props.user) {
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
                                    user={this.props.user}
                                />
                            </div>
                        </div>
                        <div className='col col_tablet-count-8'>
                            <div className={bem.element('nav-container')}>
                                <div className={bem.element('nav')}>
                                    {this.props.profileNavItems
                                        .filter(item => item.isNavVisible !== false)
                                        .filter(item => (item.rolesUser || item.roles).includes(this.props.user && this.props.user.role || null))
                                        .map(item => (
                                            <Link
                                                key={item.id}
                                                className={bem.element('nav-item', {
                                                    'is-active': item.isActive,
                                                })}
                                                toRoute={item.id}
                                                toRouteParams={{
                                                    address: this.props.user.address,
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
                                        user={this.props.user}
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
