import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import {getUser, isAuthorized, isInitialized} from 'yii-steroids/reducers/auth';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import {openModal} from 'yii-steroids/actions/modal';

import {html} from 'components';
import UserRole from 'enums/UserRole';
import MessageModal from 'modals/MessageModal';
import ProfileWizardModal from 'modals/ProfileWizardModal';
import NavItemSchema from 'types/NavItemSchema';
import userAvatarStub from 'static/images/user-avatar-stub.png';
import whaleAvatarStub from 'static/images/whale-avatar-stub.png';
import UserSchema from 'types/UserSchema';

import {ROUTE_PROFILE, ROUTE_COMMUNITY, ROUTE_PROFILE_INBOX} from 'routes';
import './HeaderProfile.scss';

const bem = html.bem('HeaderProfile');

@connect(
    state => ({
        isInitialized: isInitialized(state),
        isAuthorized: isAuthorized(state),
        user: getUser(state),
        profileNavItems: getNavItems(state, ROUTE_PROFILE),
    })
)
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
        if (!this.props.isInitialized) {
            return null;
        }

        const items = this.props.user && this.props.profileNavItems.filter(item => item.roles.includes(this.props.user.role)) || [];
        if (!this.props.isAuthorized || items.length === 0) {
            return (
                <Link
                    className={bem.element('login-link')}
                    label={__('Login')}
                    noStyles
                    onClick={() => {
                        if (this.props.user.role === UserRole.INVITED) {
                            return this.props.dispatch(openModal(ProfileWizardModal, {isCreate: true}));
                        }

                        return this.props.dispatch(openModal(MessageModal, {
                            icon: 'Icon__get-an-invitation',
                            title: __('You Need An Invitation'),
                            color: 'success',
                            description: __('You must be invited by registered user'),
                            submitLabel: __('Check out Community'),
                            toRoute: ROUTE_COMMUNITY,
                        }));
                    }}
                />
            );
        }

        const avatarStub = this.props.user.profile.isWhale
            ? whaleAvatarStub
            : userAvatarStub;

        return (
            <div className={bem.block()}>
                <img
                    className={bem.element('avatar')}
                    src={this.props.user.profile.avatar || avatarStub}
                    alt={this.props.user.profile.name}
                />
                <div className={bem.element('inner')}>
                    <div className={bem.element('balance')}>
                        {this.props.user.balance} W
                    </div>
                    <div className={bem.element('info')}>
                        <div className={bem.element('name')}>
                            {this.props.user.profile.name}
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
}
