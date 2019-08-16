import React from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';

import {getUser} from 'yii-steroids/reducers/auth';
import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardReport from 'shared/Card/views/CardReport';

import {html} from 'components';
import UserSchema from 'types/UserSchema';

const bem = html.bem('ProjectReportCard');

import './ProjectReportCard.scss';


@connect(
    (state) => ({
        user: getUser(state),
    })
)
export default class ProjectReportCard extends React.PureComponent {

    static propTypes = {
        //todo
        user: UserSchema,
    };

    render() {
        const user = this.props.item.user;
        // const user = this.props.item.user || this.props.user;

        if (!user) {
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
                            isDelisted: this.props.item.project.isDelisted,
                            delistedReason: this.props.item.project.delistedReason,
                        }
                    }}
                    right={{
                        component: CardReport,
                        componentProps: {
                            ...this.props.item,
                            user: user,
                        }
                    }}
                    onClick={() => {
                        const uid = this.props.item.project.uid;
                        return this.props.dispatch(push(`/projects/${uid}/details`));
                    }}
                />
            </div>
        );
    }
}
