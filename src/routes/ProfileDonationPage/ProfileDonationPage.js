import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';

import {dal, html} from 'components';
import {ROUTE_PROJECTS_REDIRECT} from 'routes';

import ActionButtonBlock from 'shared/ActionButtonBlock';
import ProjectFeedCard from 'shared/ProjectFeedCard';
import './ProfileDonationPage.scss';

const bem = html.bem('ProfileDonationPage');


@dal.hoc(
    () => dal.getMyDonations()
        .then(items => ({items}))
)
export default class ProfileDonationPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.array,
    };

    render() {
        if (!this.props.items) {
            return null;
        }

        return (
            <div className={bem.block()}>
                <Link
                    toRoute={ROUTE_PROJECTS_REDIRECT}
                    noStyles
                    className={bem.element('link-block')}
                >
                    <ActionButtonBlock
                        title={__('Explore New Ideas')}
                        iconClass={'Icon__explore-ideas'}
                    />
                </Link>
                <div className={bem.element('card-list')}>
                    <List
                        listId='ProfileDonationPage'
                        itemView={ProjectFeedCard}
                        emptyText={__('No Donation')}
                        items={this.props.items}
                    />
                </div>
            </div>
        );
    }
}
