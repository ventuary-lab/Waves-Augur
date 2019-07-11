import React from 'react';
import PropTypes from 'prop-types';
import {push} from 'react-router-redux';

import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardProgress from 'shared/Card/views/CardProgress';
import ProjectSchema from 'types/ProjectSchema';

import {html, store} from 'components';

import './ProjectCard.scss';

const bem = html.bem('ProjectCard');

export default class ProjectCard extends React.PureComponent {

    static propTypes = {
        item: ProjectSchema,
        isReviewPage: PropTypes.bool,
    };

    render() {
        return (
            <div className={bem.block({
                'is-review-page': this.props.isReviewPage,
            })}>
                <Card
                    left={{
                        component: CardInfo,
                        componentProps: {
                            isProject: true,
                            uid: this.props.item.uid,
                            status: this.props.item.status,
                            coverUrl: this.props.item.coverUrl,
                            logoUrl: this.props.item.logoUrl,
                            title: this.props.item.name,
                            description: this.props.item.description,
                            country: this.props.item.location,
                            expireVoting: this.props.item.expireVoting,
                            expireCrowd: this.props.item.expireCrowd,
                            expireWhale: this.props.item.expireWhale,
                        }
                    }}
                    right={{
                        component: CardProgress,
                        componentProps: {
                            uid: this.props.item.uid,
                            status: this.props.item.status,
                            positiveBalance: this.props.item.positiveBalance,
                            negativeBalance: this.props.item.negativeBalance,
                            targetWaves: this.props.item.targetWaves,
                        }
                    }}
                    onClick={() => store.dispatch(push(`/projects/${this.props.item.uid}/feed`))}
                />
            </div>
        );
    }
}
