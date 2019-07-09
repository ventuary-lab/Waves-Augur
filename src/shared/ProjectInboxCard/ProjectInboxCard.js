import React from 'react';
import PropTypes from 'prop-types';
import {push} from 'react-router-redux';

import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardInbox from 'shared/Card/views/CardInbox';
import InboxTypeEnum from 'enums/InboxTypeEnum';
import ProjectSchema from 'types/ProjectSchema';

import {html, store} from 'components';

import './ProjectInboxCard.scss';

const bem = html.bem('ProjectInboxCard');

export default class ProjectInboxCard extends React.PureComponent {

    static propTypes = {
        item: ProjectSchema,
        type: PropTypes.oneOf(InboxTypeEnum.getKeys())
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
                            expireVoting: this.props.item.expireVoting,
                        }
                    }}
                    right={{
                        component: CardInbox,
                        componentProps: {
                            type: this.props.type,
                            uid: this.props.item.uid,
                            isProject: this.props.item.uid,
                        }
                    }}
                    onClick={() => store.dispatch(push(`/projects/${this.props.item.uid}/feed`))}
                />
            </div>
        );
    }
}
