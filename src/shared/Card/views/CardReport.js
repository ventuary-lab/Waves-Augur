import React from 'react';
import PropTypes from 'prop-types';

import UserSchema from 'types/UserSchema';
import userAvatarStub from 'static/images/user-avatar-stub.png';
import whaleAvatarStub from 'static/images/whale-avatar-stub.png';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';
import UserRole from 'enums/UserRole';
import ProjectReportEnum from 'enums/ProjectReportEnum';

import {dal, html} from 'components';
import './CardReport.scss';
import Link from 'yii-steroids/ui/nav/Link';
import {ROUTE_PROJECT, ROUTE_USER_DONATION, ROUTE_USER_GRANTS} from 'routes';

const bem = html.bem('CardReport');

export default class CardReport extends React.PureComponent {

    static propTypes = {
        user: UserSchema,
        report: PropTypes.shape({
            direction: PropTypes.oneOf(ProjectReportEnum.getKeys()),
            createTime: PropTypes.string,
        }),
    };

    render() {
        const avatarStub = this.props.user.profile.isWhale
            ? whaleAvatarStub
            : this.props.user.role === UserRole.REGISTERED ? userAvatarStub : anonymousAvatarStub;


        return (
            <div className={bem.block()}>
                <div className={bem.element('column-left')}>
                    <Link
                        className={bem.element('avatar-link')}
                        toRoute={this.props.user.role === UserRole.WHALE ? ROUTE_USER_GRANTS : ROUTE_USER_DONATION}
                        toRouteParams={{
                            address: this.props.user.address,
                        }}
                        noStyles
                    >
                        <img
                            className={bem.element('avatar')}
                            src={this.props.user.profile.avatar || avatarStub}
                            alt={this.props.user.profile.name}
                        />
                    </Link>
                </div>

                <div className={bem.element('column-right')}>
                    <div className={bem.element('info-container')}>
                        <div className={bem.element('info')}>
                            <div className={bem.element('vote-type')}>
                                {this.props.report.direction === ProjectReportEnum.POSITIVE && (
                                    <div className={bem.element('featured-vote-icon')}>
                                        <span className={'MaterialIcon'}>
                                            done
                                        </span>
                                    </div>
                                ) || (
                                    <div className={bem.element('delisted-vote-icon')}>
                                        <span className={'MaterialIcon'}>
                                            block
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={bem.element('actions')}>
                        <Link
                            className={bem(bem.element('link'), 'read-more-link')}
                            toRoute={ROUTE_PROJECT}
                            toRouteParams={{
                                uid: this.props.uid || this.props.project.uid,
                            }}
                            label={__('Read More')}
                            noStyles
                        />
                    </div>
                </div>
            </div>
        );
    }
}
