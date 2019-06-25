import React from 'react';
import PropTypes from 'prop-types';

import Card from 'shared/Card';
import CardAvatar from 'shared/Card/views/CardAvatar';
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
        status: PropTypes.oneOf(ProjectStatusEnum),
        currentWaves: PropTypes.number,
        againstWaves: PropTypes.number,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Card
                    left={{
                        component: CardAvatar,
                        componentProps: {
                            logoUrl: this.props.logoUrl,
                            duration: 'to do',
                            status: this.props.status,
                        }
                    }}
                    center={{
                        component: CardInfo,
                        componentProps: {
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
                            status: this.props.status,
                        }
                    }}
                />
            </div>
        );
    }
}
