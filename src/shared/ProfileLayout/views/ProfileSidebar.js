import React from 'react';
import {connect} from 'react-redux';
import {getUser} from 'yii-steroids/reducers/auth';

import {html} from 'components';
import SocialLinks from 'shared/SocialLinks';
import Tags from 'shared/Tags';
import userAvatarStub from 'static/images/user-avatar-stub.png';
import whaleAvatarStub from 'static/images/whale-avatar-stub.png';
import UserSchema from 'types/UserSchema';

import './ProfileSidebar.scss';
import Link from 'yii-steroids/ui/nav/Link';
import {openModal} from 'yii-steroids/actions/modal';
import ProfileWizardModal from 'modals/ProfileWizardModal';

const bem = html.bem('ProfileSidebar');

@connect(
    state => ({
        user: getUser(state),
    })
)
export default class ProfileSidebar extends React.PureComponent {

    static propTypes = {
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
                    {this.props.user.profile.activity && (
                        <div className={bem.element('activity')}>
                            <span>{__('Activity')}:</span>
                            <span>
                                {this.props.user.profile.activity}
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
                    {this.props.user.profile.invitedBy && this.props.user.profile.invitedBy.name && (
                        <div className={bem.element('invited-by')}>
                            <span>{__('Invited by')}</span>
                            &nbsp;
                            <span>
                                {this.props.user.profile.invitedBy.name}
                            </span>
                        </div>
                    )}
                    {this.props.user.profile.tags && this.props.user.profile.tags.length > 0 && (
                        <ul className={bem.element('tags-list')}>
                            {this.props.user.profile.tags.map((item, index) => (
                                <li
                                    key={index}
                                    className={bem.element('tags-item')}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    {this.props.user.profile.tags && this.props.user.profile.tags.length > 0 && (
                        <Tags
                            items={this.props.user.profile.tags}
                        />
                    )}
                    <div className={bem.element('balance')}>
                        <span>{__('Balance')}</span>
                        <span>
                            {this.props.user.balance} {__('WAVES')}
                        </span>
                    </div>
                    <Link
                        label={__('Edit profile')}
                        onClick={() => this.props.dispatch(openModal(ProfileWizardModal))}
                    />
                </div>
            </div>
        );
    }
}
