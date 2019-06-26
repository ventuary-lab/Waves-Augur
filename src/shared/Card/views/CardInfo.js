import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {html} from 'components';
import coverStub from '../../../static/images/cover-stub.png';
import avatarStub from '../../../static/images/avatar-stub.png';
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
        const status = isProject ? this.getProjectStatus() : null;
        const daysLeft = isProject ? this.getDaysLeft(status) : null;

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
                            src={this.props.logoUrl || avatarStub}
                            alt='avatar'
                        />
                    </div>
                    <div className={bem.element('info')}>
                        {daysLeft && (
                            <span className={bem.element('days-left')}>
                                {daysLeft} {__('days left')}
                            </span>
                        )}
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

    getDaysLeft(status) {
        const now = moment();

        if (status === ProjectStatusEnum.VOTING) {
            return moment(this.props.expireVoting).diff(now, 'days');
        }

        if (status === ProjectStatusEnum.CROWDFUND) {
            return moment(this.props.expireCrowd).diff(now, 'days');
        }

        if (status === ProjectStatusEnum.WAITING_GRANT) {
            return moment(this.props.expireWhale).diff(now, 'days');
        }

        if (status === ProjectStatusEnum.GRANT) {
            return null;
        }
    }

    getProjectStatus() {
        if (moment() < moment(this.props.expireVoting)) {
            return ProjectStatusEnum.VOTING;
        }

        if (moment(this.props.expireVoting) < moment() < moment(this.props.expireCrowd)) {
            return ProjectStatusEnum.CROWDFUND;
        }

        if (moment(this.props.expireCrowd) < moment() < moment(this.props.expireWhale)) {
            return ProjectStatusEnum.WAITING_GRANT;
        }

        if (moment(this.props.expireWhale) < moment()) {
            return ProjectStatusEnum.GRANT;
        }
    }
}
