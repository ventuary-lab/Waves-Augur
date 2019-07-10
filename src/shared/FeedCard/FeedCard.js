import React from 'react';
import { push } from 'react-router-redux';

import Card from 'shared/Card';
import CardReview from 'shared/Card/views/CardReview';
import {html} from 'components';
import FeedSchema from 'types/FeedSchema';

import './FeedCard.scss';


const bem = html.bem('FeedCard');

export default class FeedCard extends React.PureComponent {

    static propTypes = {
        item: FeedSchema,
    };

    render() {
        console.log(1, this.props)

        return (
            <div className={bem.block()}>
                <Card
                    right={{
                        component: CardReview,
                        componentProps: {
                            ...this.props.item,
                            uid: this.props.uid,
                        }
                    }}
                    onClick={() => this.props.dispatch(push(`/review/${this.props.item.user.address}/project/${this.props.uid}/${this.props.item.type}`))}
                />
            </div>
        );
    }
}
