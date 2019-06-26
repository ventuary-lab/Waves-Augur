import React from 'react';

import {html} from 'components';

import Card from 'shared/Card';
import CardInfo from 'shared/Card/views/CardInfo';
import CardTags from 'shared/Card/views/CardTags';

import './InvitedUserCard.scss';

const bem = html.bem('InvitedUserCard');

export default class InvitedUserCard extends React.PureComponent {


    render() {
        return (
            <div className={bem.block()}>
                <Card
                    left={{
                        component: CardInfo,
                        componentProps: {
                            ...this.props,
                        }
                    }}
                    right={{
                        component: CardTags,
                        componentProps: {
                            ...this.props,
                        }
                    }}
                />
            </div>
        );
    }
}
