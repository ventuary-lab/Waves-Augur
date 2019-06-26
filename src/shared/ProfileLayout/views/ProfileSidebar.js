import React from 'react';
import {connect} from 'react-redux';
import {getUser} from 'yii-steroids/reducers/auth';

import {html} from 'components';
import SocialLinks from 'shared/SocialLinks';
import avatarStub from 'static/images/avatar-stub.png';
import UserSchema from 'types/UserSchema';

import './ProfileSidebar.scss';

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

        return (
            <div className={bem.block()}>
                <img
                    className={bem.element('avatar')}
                    src={this.props.user.avatar || avatarStub}
                    alt={this.props.user.name}
                />
                <div className={bem.element('inner')}>
                    <span className={bem.element('name')}>
                        {this.props.user.name}
                    </span>
                    <span className={bem.element('description')}>
                        {this.props.user.title}
                    </span>
                    {this.props.user.socials && (
                        <div className={bem.element('social-links')}>
                            <SocialLinks urls={this.props.user.socials}/>
                        </div>
                    )}
                    {this.props.user.activity && (
                        <div className={bem.element('info-string', 'activity')}>
                            <span>{__('Activity')}:</span>
                            <span className={bem.element('info-value')}>
                                {this.props.user.activity}
                            </span>
                        </div>
                    )}
                    {this.props.user.location && (
                        <div className={bem.element('country')}>
                            <span className={'MaterialIcon'}>location_on</span>
                            &nbsp;
                            <span>{this.props.user.location}</span>
                        </div>
                    )}
                    {this.props.user.invitedBy && (
                        <div className={bem.element('invited-by')}>
                            <span>{__('Invited by')}</span>
                            &nbsp;
                            <span>
                                {this.props.user.invitedBy.name}
                            </span>
                        </div>
                    )}
                    {this.props.user.tags && this.props.user.tags.length > 0 && (
                        <ul className={bem.element('tags-list')}>
                            {this.props.user.tags.map((item, index) => (
                                <li
                                    key={index}
                                    className={bem.element('tags-item')}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className={bem.element('balance')}>
                        <span>{__('Balance')}</span>
                        <span>
                            {this.props.user.balance} {__('WAVES')}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
