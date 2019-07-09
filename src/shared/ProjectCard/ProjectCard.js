import React from 'react';
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
    };

    render() {
        return (
            <div className={bem.block()}>
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
