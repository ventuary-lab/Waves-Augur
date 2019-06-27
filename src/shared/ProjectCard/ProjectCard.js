import React from 'react';

import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardProgress from 'shared/Card/views/CardProgress';

import {html} from 'components';

import './ProjectCard.scss';
import ProjectSchema from 'types/ProjectSchema';

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
                            status: this.props.item.status,
                            coverUrl: this.props.item.coverUrl,
                            logoUrl: this.props.item.logoUrl,
                            title: this.props.item.title,
                            description: this.props.item.description,
                            country: this.props.item.location,
                        }
                    }}
                    right={{
                        component: CardProgress,
                        componentProps: {
                            uid: this.props.item.uid,
                            currentWaves: this.props.item.balance,
                            targetWaves: this.props.item.targetWaves,
                        }
                    }}
                />
            </div>
        );
    }
}
