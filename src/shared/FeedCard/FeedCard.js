import React from 'react';
import { push } from 'react-router-redux';

import Card from 'shared/Card';
import CardReview from 'shared/Card/views/CardReview';
import FeedTypeEnum from 'enums/FeedTypeEnum';
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
                            ...this.props.item,
                            uid: this.props.uid,
                        }
                    }}
                    onClick={() => {
                        const address = this.props.item.user.address;
                        const uid = this.props.uid;
                        const type = this.props.item.type;
                        const number = this.props.item.type === FeedTypeEnum.DONATE
                            ? this.props.item.reviewNumber
                            : '';

                        return this.props.dispatch(push(`/review/${address}/project/${uid}/${type}/${number}`));
                    }}
                />
            </div>
        );
    }
}
