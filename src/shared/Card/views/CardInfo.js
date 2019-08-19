import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import LinesEllipsis from 'react-lines-ellipsis';
import _upperFirst from 'lodash-es/upperFirst';

import {html} from 'components';
import coverStub from 'static/images/cover-stub.jpg';
import userAvatarStub from 'static/images/user-avatar-stub.png';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';
import whaleAvatarStub from 'static/images/whale-avatar-stub.png';
import projectAvatarStub from 'static/images/project-avatar-stub.png';

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
        coverSmallUrl: PropTypes.string,
        expireVoting: PropTypes.string,
        expireCrowd: PropTypes.string,
        expireWhale: PropTypes.string,
        status: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        country: PropTypes.string,
        activity: PropTypes.number,
        isProject: PropTypes.bool,
        role: PropTypes.string,
        isInvitedPage: PropTypes.bool,
        noHover: PropTypes.bool,
        contest: PropTypes.string,
        contestWinner: PropTypes.bool,
    };

    render() {

        const avatarStub = this.props.isWhale
            ? whaleAvatarStub
            : this.props.role === UserRole.REGISTERED ? userAvatarStub : anonymousAvatarStub;

        const isProject = this.props.isProject;
        const status = isProject ? this.props.status : null;
        const daysLeft = isProject ? ProjectStatusEnum.getDaysLeft(status, this.props) : null;
        const daysAgo = (!isProject && this.props.createTime) ? this.daysAgoFormatter(this.props.createTime) : null;
        const isJustInvited = this.props.isInvitedPage && this.props.role === UserRole.INVITED;

        return (
            <div className={bem.block({
                'no-hover': this.props.noHover,
            })}>
                <div className={bem.element('column-left')}>
                    {this.props.contest && (
                        <div className={bem.element('ribbons')}>
                            <div className={bem.element('ribbon')}>
                                {__('contest')}
                            </div>
                            {this.props.contestWinner && (
                                <div className={bem.element('ribbon', 'winner')}>
                                    {__('winner')}
                                </div>
                            )}
                        </div>
                    )}
                    <div
                        className={bem.element('cover')}
                        style={{
                            backgroundImage: `url(${this.props.coverSmallUrl ? this.props.coverSmallUrl : coverStub})`
                        }}
                    >
                        <Link
                            className={bem.element('avatar-link')}
                            toRoute={(() => {
                                if (isJustInvited) {
                                    return null;
                                }

                                return isProject
                                    ? ROUTE_PROJECT_FEED
                                    : (this.props.userRole === UserRole.WHALE
                                        ? ROUTE_USER_GRANTS
                                        : ROUTE_USER_DONATION
                                    );
                            })()}
                            toRouteParams={{
                                uid: isProject && this.props.uid,
                                address: !isProject && this.props.address,
                            }}
                            noStyles
                        >
                            <img
                                className={bem.element('avatar')}
                                src={this.props.logoUrl || (isProject ? projectAvatarStub : avatarStub)}
                                alt='avatar'
                            />
                        </Link>
                    </div>
                    <div className={bem.element('info')}>
                        <div className={bem.element('left-info')}>
                            {isProject && (
                                <>
                                    {daysLeft && (
                                        <span className={bem.element('days-left')}>
                                            <b>{daysLeft}</b>
                                            <br />{__('{count, plural, one{day} few{days} many{days}} left', {
                                                count: daysLeft,
                                            })}
                                        </span>
                                    ) || (
                                        <span className={bem.element('time-is-over')}>
                                            {__('Today')}
                                        </span>
                                    )}
                                </>
                            ) || (
                                <>
                                    {this.props.isInvitedPage && (
                                        <>
                                            {_upperFirst(this.props.role)}
                                        </>
                                    ) || (
                                        <>
                                            {daysAgo && (
                                                <span>
                                                    {daysAgo}
                                                </span>
                                            ) || ''}
                                        </>
                                    )}

                                </>
                            )}
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
                                toRoute={(() => {
                                    if (isJustInvited) {
                                        return null;
                                    }

                                    return isProject
                                        ? ROUTE_PROJECT_FEED
                                        : (this.props.userRole === UserRole.WHALE
                                            ? ROUTE_USER_GRANTS
                                            : ROUTE_USER_DONATION
                                        );
                                })()}
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
                            <div className={bem.element('description')}>
                                <LinesEllipsis
                                    text={this.props.description}
                                    maxLine='2'
                                    ellipsis='...'
                                    trimRight
                                    basedOn='letters'
                                    component='p'
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    daysAgoFormatter(value) {
        const seconds = moment().diff(moment(value), 'seconds');
        if (seconds < 60) {
            return (
                <>
                    {__('{count} {count, plural, one{second} few{seconds} many{seconds}}', {
                        count: seconds,
                    })}
                </>
            );
        }

        const minutes = moment().diff(moment(value), 'minutes');
        if (minutes < 60) {
            return (
                <>
                    {__('{count} {count, plural, one{minute} few{minutes} many{minutes}}', {
                        count: minutes,
                    })}
                </>
            );
        }

        const hours = moment().diff(moment(value), 'hours');
        if (hours < 24) {
            return (
                <>
                    {__('{count} {count, plural, one{hour} few{hours} many{hours}}', {
                        count: hours,
                    })}
                </>
            );
        }

        return moment().diff(moment(value), 'months');
    }
}
