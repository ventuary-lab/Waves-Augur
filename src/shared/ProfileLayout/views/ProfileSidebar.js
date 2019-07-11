import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import {openModal} from 'yii-steroids/actions/modal';

import {html} from 'components';
import SocialLinks from 'shared/SocialLinks';
import Tags from 'shared/Tags';
import CopyToClipboard from 'shared/CopyToClipboard';
import userAvatarStub from 'static/images/user-avatar-stub.png';
import whaleAvatarStub from 'static/images/whale-avatar-stub.png';
import UserSchema from 'types/UserSchema';
import ProfileWizardModal from 'modals/ProfileWizardModal';
import UserRole from 'enums/UserRole';
import {ROUTE_USER_DONATION, ROUTE_USER_GRANTS} from 'routes';

import './ProfileSidebar.scss';

const bem = html.bem('ProfileSidebar');
export const APP_DOMAIN = 'https://alpha-ventuary-dao.herokuapp.com';

@connect()
export default class ProfileSidebar extends React.PureComponent {

    static propTypes = {
        isMe: PropTypes.bool,
        user: UserSchema,
    };

    render() {
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
                {this.props.isMe && (
                    <div className={bem.element('you')}>
                        {__('You')}
                    </div>
                )}
                <div className={bem.element('inner')}>
                    <span className={bem.element('name')}>
                        {this.props.user.profile.name}
                    </span>
                    <span className={bem.element('description')}>
                        {this.props.user.profile.title}
                    </span>
                    {this.props.user.profile.socials && (
                        <div className={bem.element('social-links')}>
                            <SocialLinks urls={this.props.user.profile.socials}/>
                        </div>
                    )}
                    {this.props.user.activity && (
                        <div className={bem.element('activity')}>
                            <span>{__('Activity')}:</span>
                            <span>
                                {this.props.user.activity}
                            </span>
                        </div>
                    )}
                    {this.props.user.profile.location && (
                        <div className={bem.element('country')}>
                            <span className={'MaterialIcon'}>location_on</span>
                            &nbsp;
                            <span>{this.props.user.profile.location}</span>
                        </div>
                    )}
                    {this.props.user.invitedBy && this.props.user.invitedBy.profile.name && (
                        <div className={bem.element('invited-by')}>
                            <span>{__('Invited by')}</span>
                            &nbsp;
                            <Link
                                toRoute={this.props.user.invitedBy.role === UserRole.WHALE ? ROUTE_USER_GRANTS : ROUTE_USER_DONATION}
                                toRouteParams={{
                                    address: this.props.user.invitedBy.address,
                                }}
                                noStyles
                            >
                                {this.props.user.invitedBy.profile.name}
                            </Link>
                        </div>
                    )}
                    {this.props.user.profile.tags && this.props.user.profile.tags.length > 0 && (
                        <Tags
                            items={this.props.user.profile.tags}
                        />
                    )}
                    {this.props.isMe && (
                        <>
                            <div className={bem.element('balance')}>
                                <span>{__('Balance')}:</span>
                                <span>
                                    {this.props.user.balance} 🔹
                                </span>
                            </div>
                            <Link
                                className={bem.element('edit')}
                                onClick={() => this.props.dispatch(openModal(ProfileWizardModal))}
                                noStyles
                            >
                                <svg className={bem.element('edit-icon')} width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M13.7725 3.14373C14.0758 2.84044 14.0758 2.33495 13.7725 2.04722L11.9528 0.227468C11.665 -0.0758228 11.1596 -0.0758228 10.8563 0.227468L9.42536 1.6506L12.3416 4.56687L13.7725 3.14373ZM0 11.0837V14H2.91626L11.5173 5.3912L8.60103 2.47493L0 11.0837Z' />
                                </svg>
                                {__('Edit profile')}
                            </Link>
                            <CopyToClipboard copyText={`${APP_DOMAIN}/users/${this.props.user.address}`}>
                                <button className={bem.element('share-link')}>{__('Share Profile')}</button>
                            </CopyToClipboard>
                        </>
                    )}
                </div>
            </div>
        );
    }
}
