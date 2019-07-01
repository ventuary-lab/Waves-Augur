import React from 'react';

import Card from 'shared/Card';
import CardReview from 'shared/Card/views/CardReview'
import {html} from 'components';
import FeedSchema from 'types/FeedSchema';

import './FeedCard.scss';

const bem = html.bem('FeedCard');

export default class FeedCard extends React.PureComponent {

    static propTypes = {
        item: FeedSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Card
                    right={{
                        component: CardReview,
                        componentProps: {
                            type: this.props.item.type,
                            user: this.props.item.user,
                            text: this.props.item.review.comment,
                            vote: this.props.item.vote,
                            amount: this.props.item.amount,
                        }
                    }}
                />
            </div>
        );
    }
}
