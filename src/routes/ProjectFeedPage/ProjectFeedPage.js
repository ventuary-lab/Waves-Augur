import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _get from 'lodash/get';

import {dal, html} from 'components';

import './ProjectFeedPage.scss';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import FeedSchema from 'types/FeedSchema';
import List from 'yii-steroids/ui/list/List';
import FeedCard from 'shared/FeedCard';

const bem = html.bem('ProjectFeedPage');

@connect(
    state => ({
        projectUid: _get(getCurrentRoute(state), 'match.params.uid'),
    })
)
@dal.hoc(
    props => dal.getProjectFeed(props.projectUid)
        .then(items => ({items}))
)
export default class ProjectFeedPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(FeedSchema),
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('card-list')}>
                    <List
                        listId='ProjectFeedPage'
                        itemView={FeedCard}
                        emptyText={__('No items')}
                        items={this.props.items}
                    />
                </div>
            </div>
        );
    }
}
