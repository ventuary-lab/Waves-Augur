import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _get from 'lodash-es/get';
import Link from 'yii-steroids/ui/nav/Link';
import { getUser, isAuthorized, isInitialized } from 'yii-steroids/reducers/auth';
import { getNavItems } from 'yii-steroids/reducers/navigation';
import { openModal } from 'yii-steroids/actions/modal';
import enhanceWithClickOutside from 'react-click-outside';
import { setUser } from 'yii-steroids/actions/auth';

import { dal, html, store } from 'components';
import { LOG_OUT_USER } from 'actions/global';
import UserRole from 'enums/UserRole';
import NavItemSchema from 'types/NavItemSchema';
import userAvatarStub from 'static/images/user-avatar-stub.png';
import whaleAvatarStub from 'static/images/whale-avatar-stub.png';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';
import UserSchema from 'types/UserSchema';
import MessageModal from 'modals/MessageModal';
import ProfileWizardModal from 'modals/ProfileWizardModal';

import {ROUTE_PROFILE, ROUTE_PROFILE_INBOX} from 'routes';
import './HeaderProfile.scss';
import {isPhone} from 'yii-steroids/reducers/screen';
import AddEntityIcon from 'shared/Header/AddEntityIcon';
import UserHeaderInfo from 'shared/Header/UserHeaderInfo';
import ModalsContext from 'shared/Layout/context';
import {
    getUserNavItems,
    customRouteProps
} from '../utils';

const bem = html.bem('HeaderProfile');

const Separator = () => <div className={bem.element('separator')}></div>;

@connect(
    state => ({
        isInitialized: isInitialized(state),
        isAuthorized: isAuthorized(state),
        isInternallyAuthorized: state.global.isLoggedIn,
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

        this._onIconLinkHover = this._onIconLinkHover.bind(this);
        this._getAdditionalLinks = this._getAdditionalLinks.bind(this);
        this._mapNavItem = this._mapNavItem.bind(this);

        this.additionalLinks = [
            {
                label: 'Settings',
                onClick: () => {
                    this.setState({ isMenuOpen: false });
                    store.dispatch(openModal(ProfileWizardModal));
                }
            },
            { label: 'Help' },
            {
                label: 'Log out', onClick: () => {
                    store.dispatch({ type: LOG_OUT_USER });
                    store.dispatch(setUser(null));
                    window.localStorage.removeItem('dao_account');
                    dal.setLoginTypeLoggedOut();

                    this.setState({ isMenuOpen: false });
                }
            },
        ];

        this.state = {
            isMenuOpen: false,
            hoveredItemIndex: null
        };
    }

    _mapNavItem (item) {
        const _item = item;

        if (_item.label === 'My Favorites' || _item.label === 'My Donations' && this.props.user && this.props.user.role === UserRole.ANONYMOUS) {
            _item.label = 'My Profile';
        }

        return _item;
    }

    _onIconLinkHover (index) {
        this.setState({ hoveredItemIndex: index });
    }

    _getAdditionalLinks () {
        const links = this.additionalLinks.map(
            (item) => (
                <li className={bem.element('menu-item')} key={item.label}>
                    <Link
                        className={bem.element('menu-link')}
                        to={'#'}
                        label={item.label}
                        onClick={item.onClick}
                        noStyles
                    />
                </li>
            )
        );

        return (
            <>
                <Separator />
                {links}
            </>
        );
    }

    render() {
        const user = {
            ...this.props.contextUser,
            ...this.props.user,
        };

        const _items = user && getUserNavItems(this.props, user) || [];
        const items = _items.map(this._mapNavItem);

        if (!this.props.isAuthorized || !this.props.isInternallyAuthorized || items.length === 0) {

            return (
                <ModalsContext.Consumer>
                    {({ noKeeperModal }) => (
                        this.props.isPhone && (
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
                            <div
                                onClick={async () => {
                                    if (!this.props.isInternallyAuthorized) {
                                        // const user = await dal.auth();
                                        // if (user === null) {
                                        //     noKeeperModal.setState({ isVisible: true, isInvitedProvided: false });
                                        // } else {
                                        //     store.dispatch({ type: LOG_IN_USER });
                                        //     store.dispatch(setUser(user));
                                        // }
                                        noKeeperModal.setState({ isVisible: true, isInvitedProvided: false });
                                    }
                                }}
                                className={bem.element('login-link')}>
                                {__('Login')}
                            </div>
                        )
                    )}
                    {/* {} */}
                </ModalsContext.Consumer>
            );
        }

        const avatarStub = user.isWhale
            ? whaleAvatarStub
            : user.role === UserRole.REGISTERED ? userAvatarStub : anonymousAvatarStub;

        const { hoveredItemIndex } = this.state;
        const { _getAdditionalLinks } = this;
        const closeMenu = () => this.setState({ isMenuOpen: false });

        return (
            <div className={bem.block()}>
                <img
                    className={bem.element('avatar')}
                    src={_get(user, 'profile.avatar', avatarStub)}
                    alt={_get(user, 'profile.name', '')}
                    onMouseEnter={() => this.setState({ isMenuOpen: true })}
                    onClick={() => this.setState(prevState => ({ ...prevState, isMenuOpen: !prevState.isMenuOpen }))}
                />
                <div className={bem.element('inner')}>
                    <div className={bem.element('info')}>
                        <ul className={bem.element('menu', {
                            hidden: !this.state.isMenuOpen
                        })}>
                            <li>
                                <UserHeaderInfo 
                                    user={user} 
                                    altImg={anonymousAvatarStub}
                                    onAvatarClick={user && user.role !== 'anonymous' && closeMenu}
                                />
                            </li>
                            <Separator />
                            {items.map((item, itemIndex) => {
                                const isAdditional = customRouteProps[item.id];

                                return (
                                    <li
                                        className={bem.element('menu-item', { 'is-additional': !!isAdditional, hovered: hoveredItemIndex === itemIndex })}
                                        key={item.id}
                                    >
                                        <Link
                                            className={bem.element('menu-link', {
                                                active: item.isActive
                                            })}
                                            to={item.url}
                                            label={item.label}
                                            onClick={closeMenu}
                                            noStyles
                                        />
                                        {isAdditional && (
                                            <AddEntityIcon
                                                item={item}
                                                itemIndex={itemIndex}
                                                isActive={item.isActive} 
                                                onHover={this._onIconLinkHover}
                                                onClick={closeMenu}
                                            />
                                        )}
                                    </li>
                                );
                            })}
                            {_getAdditionalLinks()}
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
