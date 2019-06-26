import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import {getUser} from 'yii-steroids/reducers/auth';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import _get from 'lodash/get';

import {html} from 'components';
import {ROUTE_PROFILE} from 'routes';
import ProfileSidebar from './views/ProfileSidebar';
import NavItemSchema from 'types/NavItemSchema';
import UserSchema from 'types/UserSchema';
import routes from 'routes';

import './ProfileLayout.scss';
import Link from 'yii-steroids/ui/nav/Link';

const bem = html.bem('ProfileLayout');

@connect(
    (state) => ({
        user: getUser(state),
        routeId: _get(getCurrentRoute(state), 'id'),
        profileNavItems: getNavItems(state, ROUTE_PROFILE),
    })
)
export default class ProfileLayout extends React.PureComponent {

    static propTypes = {
        user: UserSchema,
        routeId: PropTypes.string,
        profileNavItems: PropTypes.arrayOf(NavItemSchema),
    };

    render() {
        const ContentComponent = _get(routes, ['items', ROUTE_PROFILE, 'items', this.props.routeId, 'component']);
        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col col_tablet-count-4'}>
                            <div className={bem.element('sidebar')}>
                                <ProfileSidebar/>
                            </div>
                        </div>
                        <div className='col col_tablet-count-8'>
                            <div className={bem.element('nav-container')}>
                                <div className={bem.element('nav')}>
                                    {this.props.profileNavItems
                                        .filter(item => item.roles.includes(this.props.user.role))
                                        .map(item => (
                                            <Link
                                                key={item.id}
                                                className={bem.element('nav-item', {
                                                    'is-active': item.isActive,
                                                })}
                                                to={item.url}
                                                noStyles
                                            >
                                                <span className={bem.element('nav-icon')}>
                                                    <span className={`Icon ${item.isActive ? item.icon + '_green' : item.icon}`}/>
                                                </span>
                                                {item.label}
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className={bem.element('content')}>
                                {ContentComponent && (
                                    <ContentComponent />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
