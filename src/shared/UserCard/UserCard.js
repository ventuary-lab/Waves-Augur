import React from 'react';

import {html} from 'components';

import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardTags from 'shared/Card/views/CardTags';

import './UserCard.scss';
import UserSchema from 'types/UserSchema';

const bem = html.bem('UserCard');

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
                            logoUrl: this.props.item.profile.avatar,
                            title: this.props.item.profile.name,
                            description: this.props.item.profile.title,
                            country: this.props.item.profile.location,
                        },
                    }}
                    right={{
                        component: CardTags,
                        componentProps: {
                            tags: this.props.item.profile.tags,
                            socials: this.props.item.profile.socials,
                        },
                    }}
                />
            </div>
        );
    }
}