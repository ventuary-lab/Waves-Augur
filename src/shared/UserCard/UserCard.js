import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

import {html} from 'components';

import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardTags from 'shared/Card/views/CardTags';

import './UserCard.scss';
import UserSchema from 'types/UserSchema';

const bem = html.bem('UserCard');

@connect()
export default class UserCard extends React.PureComponent {

    static propTypes = {
        item: UserSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Card
                    left={{
                        component: CardInfo,
                        componentProps: {
                            isProject: false,
                            address: this.props.item.address,
                            userRole: this.props.item.role,
                            isWhale: this.props.item.profile.isWhale,
                            logoUrl: this.props.item.profile.avatar,
                            title: this.props.item.profile.name,
                            description: this.props.item.profile.title,
                            country: this.props.item.profile.location,
                            createTime: this.props.item.profile.createTime,
                            activity: this.props.item.activity,
                        },
                    }}
                    right={{
                        component: CardTags,
                        componentProps: {
                            user: this.props.item,
                        },
                    }}
                    onClick={() => this.props.dispatch(push(`/users/${this.props.item.address}/donation`))}
                />
            </div>
        );
    }
}
