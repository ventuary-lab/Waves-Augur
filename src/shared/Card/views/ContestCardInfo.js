import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import LinesEllipsis from 'react-lines-ellipsis';

import {html} from 'components';
import coverStub from 'static/images/cover-stub.jpg';
import projectAvatarStub from 'static/images/project-avatar-stub.png';

import './ContestCardInfo.scss';
import Link from 'yii-steroids/ui/nav/Link';
import {ROUTE_CONTEST_DETAILS} from 'routes';

const bem = html.bem('ContestCardInfo');

export default class ContestCardInfo extends React.PureComponent {

    static propTypes = {
        logoUrl: PropTypes.string,
        coverSmallUrl: PropTypes.string,
        expireEntries: PropTypes.string,
        expireImplementation: PropTypes.string,
        status: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        noHover: PropTypes.bool,
        platform: PropTypes.string,
        rewardWaves: PropTypes.number,
    };

    render() {
        return (
            <div className={bem.block({
                'no-hover': this.props.noHover,
            })}>
                <div className={bem.element('column-left')}>
                    <div
                        className={bem.element('cover')}
                        style={{
                            backgroundImage: `url(${this.props.coverSmallUrl ? this.props.coverSmallUrl : coverStub})`
                        }}
                    >
                        <Link
                            className={bem.element('avatar-link')}
                            toRoute={ROUTE_CONTEST_DETAILS}
                            toRouteParams={{
                                uid: this.props.uid,
                            }}
                            noStyles
                        >
                            <img
                                className={bem.element('avatar')}
                                src={this.props.logoUrl || projectAvatarStub}
                                alt='avatar'
                            />
                        </Link>
                    </div>
                    <div className={bem.element('info')}>
                        <div className={bem.element('left-info')}>
                            <div>
                                {__('ends')}:
                                <br/>
                                {moment(this.props.expireEntries).format('DD.MM.YYYY')}
                            </div>
                        </div>
                        <div className={bem.element('right-info')}>
                            <span className={bem.element('activity')}>
                                {this.props.rewardWaves} 🔹
                            </span>
                        </div>
                    </div>
                </div>
                <div className={bem.element('column-right')}>
                    <div className={bem.element('top-info')}>
                        {this.props.title && (
                            <Link
                                toRoute={ROUTE_CONTEST_DETAILS} TODO
                                toRouteParams={{
                                    uid: this.props.uid,
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
                    <div className={bem.element('bottom-info')}>
                        {this.props.platform && (
                            <span className={bem.element('platform')}>
                                {this.props.platform}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
