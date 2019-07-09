import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardInbox from 'shared/Card/views/CardInbox';
import InboxTypeEnum from 'enums/InboxTypeEnum';

import './UserInboxCard.scss';
import UserSchema from 'types/UserSchema';

const bem = html.bem('UserInboxCard');

export default class UserInboxCard extends React.PureComponent {

    static propTypes = {
        item: UserSchema,
        type: PropTypes.oneOf(InboxTypeEnum.getKeys())
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
                            logoUrl: this.props.item.profile.avatar,
                            title: this.props.item.profile.name,
                            description: this.props.item.profile.title,
                            country: this.props.item.profile.location,
                            createTime: this.props.item.profile.createTime,
                        },
                    }}
                    right={{
                        component: CardInbox,
                        componentProps: {
                            type: this.props.type,
                        },
                    }}
                />
            </div>
        );
    }
}
