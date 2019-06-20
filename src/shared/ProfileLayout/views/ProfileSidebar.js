import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {html} from 'components';
import SocialLinksSchema from 'types/SocialLinksSchema';
import SocialLinks from 'shared/SocialLinks';

import './ProfileSidebar.scss';

const bem = html.bem('ProfileSidebar');

export default class ProfileSidebar extends React.PureComponent {

    static propTypes = {
        avatarUrl: PropTypes.string,
        backgroundUlr: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
        socialLinks: SocialLinksSchema,
        activity: PropTypes.number,
        status: PropTypes.string, //TODO make enum
        country: PropTypes.string,
        invitedBy: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        balance: PropTypes.number,
        crowdfunding: PropTypes.shape({
            startDate: PropTypes.string,
            finishDate: PropTypes.string,
        }),
        isProject: PropTypes.bool,

    };

    render() {
        return (
            <div className={bem.block({
                'is-project': this.props.isProject,
            })}>
                <img
                    className={bem.element('avatar')}
                    src={this.props.avatarUrl || '/images/avatar-stub.png'}
                    alt={this.props.name}
                />
                <div className={bem.element('inner')}>
                    <span className={bem.element('name')}>
                        {this.props.name}
                    </span>
                    <span className={bem.element('description')}>
                        {this.props.description}
                    </span>
                    {!this.props.isProject && this.props.socialLinks && (
                        <div className={bem.element('social-links')}>
                            <SocialLinks
                                items={this.props.socialLinks}
                            />
                        </div>
                    )}
                    {this.props.isProject && this.props.status && (
                        <div className={bem.element('info-string', 'status')}>
                            <span>{__('Status')}:</span>
                            <span className={bem.element('info-value')}>
                                {this.props.status}
                            </span>
                        </div>
                    )}
                    {!this.props.isProject && this.props.activity && (
                        <div className={bem.element('info-string', 'activity')}>
                            <span>{__('Activity')}:</span>
                            <span className={bem.element('info-value')}>
                                {this.props.activity}
                            </span>
                        </div>
                    )}
                    {this.props.country && (
                        <div className={bem.element('country')}>
                            <span className={'MaterialIcon'}>location_on</span>
                            &nbsp;
                            <span>{this.props.country}</span>
                        </div>
                    )}
                    {!this.props.isProject && this.props.invitedBy && (
                        <div className={bem.element('invited-by')}>
                            <span>{__('Invited by')}</span>
                            &nbsp;
                            <span>
                                {this.props.invitedBy}
                            </span>
                        </div>
                    )}
                    {this.props.tags && (
                        <ul className={bem.element('tags-list')}>
                            {this.props.tags.map((item, index) => (
                                <li
                                    key={index}
                                    className={bem.element('tags-item')}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    {this.props.isProject && this.props.crowdfunding && (
                        <table className={bem.element('crowdfunding')}>
                            <tbody>
                                <tr>
                                    <td>{__('Crowdfunding')}</td>
                                    <td>
                                        {moment(this.props.crowdfunding.startDate).format('DD.MM.YYYY')}
                                    </td>
                                </tr>
                                <tr>
                                    <td>{__('Finish')}</td>
                                    <td>{moment(this.props.crowdfunding.finishDate).format('DD.MM.YYYY')}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    {!this.props.isProject && this.props.balance && (
                        <div className={bem.element('balance')}>
                            <span>{__('Balance')}</span>
                            <span>
                                {this.props.balance} {__('WAVES')}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
