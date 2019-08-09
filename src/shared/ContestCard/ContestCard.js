import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

import {html} from 'components';

import {ROUTE_CONTEST_DETAILS} from 'routes';
import Card from 'shared/Card';
import ContestCardInfo from 'shared/Card/views/ContestCardInfo';
import CardTags from 'shared/Card/views/CardTags';
import ContestSchema from 'types/ContestSchema';

import './ContestCard.scss';

const bem = html.bem('ContestCard');

@connect()
export default class UserCard extends React.PureComponent {

    static propTypes = {
        item: ContestSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Card
                    left={{
                        component: ContestCardInfo,
                        componentProps: {
                            uid: this.props.item.uid,
                            status: this.props.item.status,
                            coverSmallUrl: this.props.item.coverSmallUrl,
                            logoUrl: this.props.item.logoUrl,
                            title: this.props.item.name,
                            description: this.props.item.description,
                            platform: this.props.item.contents.platform,
                            expireEntries: this.props.item.expireEntries,
                            expireImplementation: this.props.item.expireImplementation,
                            rewardWaves: this.props.item.rewardWaves,
                        },
                    }}
                    right={{
                        component: CardTags,
                        componentProps: {
                            tags: this.props.item.tags,
                            toRoute: ROUTE_CONTEST_DETAILS,
                            toRouteParams: {
                                uid: this.props.item.uid,
                            },
                            socials: this.props.item.socials
                        },
                    }}

                    onClick={() => this.props.dispatch(push(`/contest/${this.props.item.uid}/details`))}
                />
            </div>
        );
    }
}
