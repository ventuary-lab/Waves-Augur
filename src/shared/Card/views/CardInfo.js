import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import coverStub from '../../../static/images/cover-stub.png';
import userAvatarStub from '../../../static/images/user-avatar-stub.png';
import projectAvatarStub from '../../../static/images/project-avatar-stub.png';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import './CardInfo.scss';

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
                        <img
                            className={bem.element('avatar')}
                            src={this.props.logoUrl || isProject ? projectAvatarStub : userAvatarStub}
                            alt='avatar'
                        />
                    </div>
                    <div className={bem.element('info')}>
                        <div className={bem.element('left-info')}>
                            {daysLeft && (
                                <span className={bem.element('days-left')}>
                                    {daysLeft} {__('days left')}
                                </span>
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
                            <div className={bem.element('title')}>
                                {this.props.title}
                            </div>
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