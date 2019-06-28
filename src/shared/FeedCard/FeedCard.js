import React from 'react';

import {html} from 'components';

import './FeedCard.scss';
import FeedSchema from 'types/FeedSchema';

const bem = html.bem('FeedCard');

export default class FeedCard extends React.PureComponent {

    static propTypes = {
        item: FeedSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                {this.props.item.type}
            </div>
        );
    }
}
