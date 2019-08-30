import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _get from 'lodash-es/get';
import Link from 'yii-steroids/ui/nav/Link';
import {getUser, isAuthorized, isInitialized} from 'yii-steroids/reducers/auth';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import {openModal} from 'yii-steroids/actions/modal';
import enhanceWithClickOutside from 'react-click-outside';

import {dal, html} from 'components';
import UserRole from 'enums/UserRole';
import NavItemSchema from 'types/NavItemSchema';
import userAvatarStub from 'static/images/user-avatar-stub.png';
import whaleAvatarStub from 'static/images/whale-avatar-stub.png';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';
import UserSchema from 'types/UserSchema';
import MessageModal from 'modals/MessageModal';

import {ROUTE_PROFILE, ROUTE_PROFILE_INBOX} from 'routes';
import './HeaderProfile.scss';
import {isPhone} from 'yii-steroids/reducers/screen';

const bem = html.bem('HeaderProfile');

@connect(
    state => ({
        isInitialized: isInitialized(state),
        isAuthorized: isAuthorized(state),
        contextUser: getUser(state),
        profileNavItems: getNavItems(state, ROUTE_PROFILE),
        isPhone: isPhone(state),
    })
)
@dal.hoc2(
    (props) => ({
        url: `/api/v1/users/${_get(props, 'contextUser.address')}`,
        key: 'user',
        collection: 'users',
    })
)
@enhanceWithClickOutside
export default class HeaderProfile extends React.PureComponent {

    static propTypes = {
        isInitialized: PropTypes.bool,
        isAuthorized: PropTypes.bool,
        user: UserSchema,
        profileNavItems: PropTypes.arrayOf(NavItemSchema)
    };

    constructor() {
        super(...arguments);

        this.state = {
            isMenuOpen: false,
        };
    }

    render() {
        if (!this.props.isInitialized || !this.props.user || !this.props.contextUser) {
            return null;
        }

        const user = {
            ...this.props.contextUser,
            ...this.props.user,
        };

        const items = user && this.props.profileNavItems.filter(item => item.roles.includes(user.role)) || [];
        if (!this.props.isAuthorized || items.length === 0) {
            return (
                <>
                    {this.props.isPhone && (
                        <a
                            href='javascript:void(0)'
                            className={bem.element('login-link')}
                            onClick={() => {
                                this.props.dispatch(openModal(MessageModal, {
                                    icon: 'Icon__log-in-from-pc',
                                    title: __('Log in from PC'),
                                    color: 'success',
                                    description: __('This functionality is currently only available in the desktop version of Ventuary DAO. Sorry for the inconvenience.'),
                                }));
                            }}
                        >
                            {__('Login')}
                        </a>
                    ) || (
                        <a
                            href='https://forms.gle/uLwL83EM9MWSCBAp6'
                            target={'_blank'}
                            className={bem.element('login-link')}
                        >
                            {__('Login')}
                        </a>
                    )}
                    {/*<Link
                    className={bem.element('login-link')}
                    label={__('Login')}
                    noStyles
                    onClick={() => {

                        if (this.props.isPhone) {
                            this.props.dispatch(openModal(MessageModal, {
                                icon: 'Icon__log-in-from-pc',
                                title: __('Log in from PC'),
                                color: 'success',
                                description: __('This functionality is currently only available in the desktop version of Ventuary DAO. Sorry for the inconvenience.'),
                            }));
                        } else {
                            // if (this.props.user && this.props.user.role === UserRole.INVITED) {
                            //     return this.props.dispatch(openModal(ProfileWizardModal, {isCreate: true}));
                            // }
                            //
                            // this.props.dispatch(openModal(MessageModal, {
                            //     icon: 'Icon__get-an-invitation',
                            //     title: __('You Need An Invitation'),
                            //     color: 'success',
                            //     description: __('You must be invited by registered user'),
                            //     submitLabel: __('Check out Community'),
                            //     toRoute: ROUTE_COMMUNITY,
                            // }));
                        }

                    }}
                />*/}
                </>
            );
        }

        const avatarStub = user.isWhale
            ? whaleAvatarStub
            : user.role === UserRole.REGISTERED ? userAvatarStub : anonymousAvatarStub;

        // console.log(1, this.props.user)

        return (
            <div className={bem.block()}>
                <img
                    className={bem.element('avatar')}
                    src={_get(user, 'profile.avatar', avatarStub)}
                    alt={_get(user, 'profile.name', '')}
                />
                <div className={bem.element('inner')}>
                    <div className={bem.element('balance')}>
                        {user.balance}
                    </div>
                    <div className={bem.element('info')}>
                        <div className={bem.element('name')}>
                            {_get(user, 'profile.name', '')}
                        </div>
                        <button
                            className={bem(bem.element('menu-toggle'), 'MaterialIcon')}
                            onClick={() => this.setState({isMenuOpen: !this.state.isMenuOpen})}
                        >
                            {this.state.isMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                        </button>
                        <ul className={bem.element('menu', {
                            hidden: !this.state.isMenuOpen
                        })}>
                            {items.map(item => (
                                <li
                                    className={bem.element('menu-item')}
                                    key={item.id}
                                >
                                    <Link
                                        className={bem.element('menu-link', {
                                            active: item.isActive,
                                        })}
                                        to={item.url}
                                        label={item.label}
                                        onClick={() => this.setState({isMenuOpen: false})}
                                        noStyles
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {items.find(item => item.id === ROUTE_PROFILE_INBOX) && (
                    <Link
                        className={bem.element('notification')}
                        toRoute={ROUTE_PROFILE_INBOX}
                        noStyles
                    >
                        <span className={bem(bem.element('notification-icon'), 'MaterialIcon')}>
                            notifications
                        </span>
                    </Link>
                )}
            </div>
        );
    }

    handleClickOutside() {
        this.setState({isMenuOpen: false});
    }
}
