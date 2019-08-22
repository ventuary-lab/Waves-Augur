import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import {dal as Dal, html} from 'components';
const dal = Dal();

import './ProjectFeedPage.scss';
import ProjectSchema from 'types/ProjectSchema';
import List from 'yii-steroids/ui/list/List';
import FeedCard from 'shared/FeedCard';

const bem = html.bem('ProjectFeedPage');


@dal.hoc2(
    props => ([
        {
            url: `/api/v1/reviews/donations/project/${_get(props, 'project.uid')}`,
            key: 'reviewDonations',
            collection: 'reviewDonations',
        },
        {
            url: `/api/v1/reviews/whales/project/${_get(props, 'project.uid')}`,
            key: 'reviewWhales',
            collection: 'reviewWhales',
        },
    ].filter(Boolean))
)
export default class ProjectFeedPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
        reviewDonations: PropTypes.arrayOf(PropTypes.object), //todo: need shema
        reviewWhales: PropTypes.arrayOf(PropTypes.object), //todo: need shema

    };

    render() {
        if (!this.props.reviewDonations && !this.props.reviewWhales) {
            return null;
        }

        const items = [].concat(this.props.reviewDonations || []).concat(this.props.reviewWhales || []);

        return (
            <div className={bem.block()}>
                <div className={bem.element('card-list')}>
                    <List
                        listId='ProjectFeedPage'
                        itemView={FeedCard}
                        itemProps={{
                            uid: this.props.project.uid,
                        }}
                        emptyText={__('No items')}
                        items={items}
                    />
                </div>
            </div>
        );
    }
}
