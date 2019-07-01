import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _get from 'lodash/get';

import {dal, html} from 'components';
import VotingForm from 'shared/VotingForm';

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
                <div className={bem.element('form-block')}>
                    <VotingForm/>
                </div>
                <div className={bem.element('card-list')}>
                    <List
                        listId='ProjectFeedPage'
                        itemView={FeedCard}
                        emptyText={__('No items')}
                        items={this.props.items}
                    />
                </div>

                <FeedCard
                    item={{
                        user: {
                            profile: {
                                avatar: '',
                                socials: {
                                    url_twitter: '1',
                                    url_facebook: '1',
                                    url_linkedin: '1',
                                    url_instagram: '1',
                                    url_telegram: '1',
                                    url_website: '1',
                                }
                            }
                        },
                        type: 'donate',
                        // vote: 'delisted',
                        amount: -5,
                        review: {
                            comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad consectetur est illum labore mollitia numquam optio quaerat sapiente temporibus! Ad aliquid eaque mollitia neque pariatur quis sunt, unde voluptates voluptatibus?',
                        },
                    }}
                />
            </div>
        );
    }
}
