import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardProgress from 'shared/Card/views/CardProgress';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import {html} from 'components';

import './ProjectCard.scss';

const bem = html.bem('ProjectCard');

export default class ProjectCard extends React.PureComponent {

    static propTypes = {
        logoUrl: PropTypes.string,
        coverUrl: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        expireVoting: PropTypes.string,
        expireCrowd: PropTypes.string,
        expireWhale: PropTypes.string,
        targetWaves: PropTypes.number,
        country: PropTypes.string,

        activity: PropTypes.number,
        currentWaves: PropTypes.number,
        againstWaves: PropTypes.number,
    };

    render() {
        const status = this.getProjectStatus(this.props.expireVoting, this.props.expireCrowd, this.props.expireWhale);
        const daysLeft = this.getDaysLeft(status);

        return (
            <div className={bem.block()}>
                <Card
                    left={{
                        component: CardInfo,
                        componentProps: {
                            logoUrl: this.props.logoUrl,
                            daysLeft: daysLeft,
                            status: status,
                            title: this.props.title,
                            description: this.props.description,
                            country: this.props.country,
                        }
                    }}
                    right={{
                        component: CardProgress,
                        componentProps: {
                            currentWaves: this.props.currentWaves,
                            againstWaves: this.props.againstWaves,
                            targetWaves: this.props.targetWaves,
                            status: status,
                        }
                    }}
                />
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
