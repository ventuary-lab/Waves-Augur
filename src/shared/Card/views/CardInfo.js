import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import coverStub from '../../../static/images/cover-stub.jpg';
import userAvatarStub from '../../../static/images/user-avatar-stub.png';
import whaleAvatarStub from '../../../static/images/whale-avatar-stub.png';
import projectAvatarStub from '../../../static/images/project-avatar-stub.png';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import './CardInfo.scss';
import Link from 'yii-steroids/ui/nav/Link';
import {ROUTE_PROJECT_FEED, ROUTE_USER_DONATION, ROUTE_USER_GRANTS} from 'routes';
import UserRole from 'enums/UserRole';

const bem = html.bem('CardInfo');

export default class CardInfo extends React.PureComponent {

    static propTypes = {
        daysLeft: PropTypes.number,
        logoUrl: PropTypes.string,
        coverUrl: PropTypes.string,
        expireVoting: PropTypes.string,
        expireCrowd: PropTypes.string,
        expireWhale: PropTypes.string,
        status: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        country: PropTypes.string,
        activity: PropTypes.number,
        isProject: PropTypes.bool,
    };

    render() {

        const avatarStub = this.props.isWhale
            ? whaleAvatarStub
            : userAvatarStub;
        const isProject = this.props.isProject;
        const status = isProject ? this.props.status : null;
        const daysLeft = isProject ? ProjectStatusEnum.getDaysLeft(status, this.props) : null;

        return (
            <div className={bem.block()}>
                <div className={bem.element('column-left')}>
                    <div
                        className={bem.element('cover')}
                        style={{
                            backgroundImage: `url(${this.props.coverUrl ? this.props.coverUrl : coverStub})`
                        }}
                    >
                        <Link
                            className={bem.element('avatar-link')}
                            toRoute={isProject
                                ? ROUTE_PROJECT_FEED
                                : (this.props.userRole === UserRole.WHALE
                                    ? ROUTE_USER_GRANTS
                                    : ROUTE_USER_DONATION
                                )
                            }
                            toRouteParams={{
                                uid: isProject && this.props.uid,
                                address: !isProject && this.props.address,
                            }}
                            noStyles
                        >
                            <img
                                className={bem.element('avatar')}
                                src={this.props.logoUrl || isProject ? projectAvatarStub : avatarStub}
                                alt='avatar'
                            />
                        </Link>
                    </div>
                    <div className={bem.element('info')}>
                        <div className={bem.element('left-info')}>
                            {daysLeft && (
                                <span className={bem.element('days-left')}>
                                    {__('{count} {count, plural, one{day} few{days} many{days}} left', {
                                        count: daysLeft,
                                    })}
                                </span>
                            ) || __('Time is over')}
                        </div>
                        <div className={bem.element('right-info')}>
                            {!isProject && this.props.activity && (
                                <span className={bem.element('activity')}>
                                    {this.props.activity}
                                </span>
                            )}
                            {status && (
                                <span className={bem.element('status')}>
                                    {ProjectStatusEnum.getLabel(status)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className={bem.element('column-right')}>
                    <div className={bem.element('top-info')}>
                        {this.props.title && (
                            <Link
                                toRoute={isProject
                                    ? ROUTE_PROJECT_FEED
                                    : (this.props.userRole === UserRole.WHALE
                                        ? ROUTE_USER_GRANTS
                                        : ROUTE_USER_DONATION
                                    )
                                }
                                toRouteParams={{
                                    uid: isProject && this.props.uid,
                                    address: !isProject && this.props.address,
                                }}
                                className={bem.element('title')}
                                noStyles
                            >
                                {this.props.title}
                            </Link>
                        )}
                        {this.props.description && (
                            <p className={bem.element('description')}>
                                {this.props.description}
                            </p>
                        )}
                    </div>
                    <div className={bem.element('bottom-info')}>
                        {this.props.country && (
                            <div className={bem.element('country')}>
                                <span className={'MaterialIcon'}>location_on</span>
                                &nbsp;
                                <span>{this.props.country}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
