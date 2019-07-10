import React from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';

import {getUser} from 'yii-steroids/reducers/auth';
import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardReview from 'shared/Card/views/CardReview';

import {html} from 'components';
import ProjectSchema from 'types/ProjectSchema';
import UserSchema from 'types/UserSchema';

const bem = html.bem('ProjectFeedCard');

import './ProjectFeedCard.scss';


@connect(
    (state) => ({
        user: getUser(state),
    })
)
export default class ProjectFeedCard extends React.PureComponent {

    static propTypes = {
        // item: ProjectSchema, //todo
        user: UserSchema,
    };

    render() {
        if (!this.props.user) {
            return null;
        }

        return (
            <div className={bem.block()}>
                <Card
                    left={{
                        component: CardInfo,
                        componentProps: {
                            isProject: true,
                            uid: this.props.item.project.uid,
                            status: this.props.item.project.status,
                            coverUrl: this.props.item.project.coverUrl,
                            logoUrl: this.props.item.project.logoUrl,
                            title: this.props.item.project.name,
                            description: this.props.item.project.description,
                            country: this.props.item.project.location,
                        }
                    }}
                    right={{
                        component: CardReview,
                        componentProps: {
                            ...this.props.item,
                            user: this.props.item.user || this.props.user,
                        }
                    }}
                    onClick={() => this.props.dispatch(push(`/review/${this.props.item.user.address}/project/${this.props.item.project.uid}/${this.props.item.type}/${this.props.item.type === 'donate' ? this.props.item.reviewNumber : ''}`))}
                />
            </div>
        );
    }
}
