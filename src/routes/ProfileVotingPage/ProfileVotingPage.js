import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';

import ActionButtonBlock from 'shared/ActionButtonBlock';
import ProjectFeedCard from 'shared/ProjectFeedCard';
import {dal, html} from 'components';
import {ROUTE_PROJECTS_REDIRECT} from 'routes';

import './ProfileVotingPage.scss';

const bem = html.bem('ProfileVotingPage');

@dal.hoc2(
    props => ({
        url: `/api/v1/reviews/votings/user/${props.user.address}`,
        key: 'items',
    })
)
export default class ProfileVotingPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.array,
    };

    render() {
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
                    <div className={bem.element('card-list')}>
                        <List
                            listId='ProfileDonationPage'
                            itemView={ProjectFeedCard}
                            emptyText={__('No Voting')}
                            items={this.props.items}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
