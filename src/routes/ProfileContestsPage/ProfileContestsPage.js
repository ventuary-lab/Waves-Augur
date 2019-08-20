import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {openModal} from 'yii-steroids/actions/modal';

import {dal, html} from 'components';
import ActionButtonBlock from 'shared/ActionButtonBlock';
import ContestCard from 'shared/ContestCard';

import './ProfileContestsPage.scss';
import List from 'yii-steroids/ui/list/List';
import ContestSchema from 'types/ContestSchema';
import {ROUTE_PROJECTS_REDIRECT} from '../index';
import Link from 'yii-steroids/ui/nav/Link';
import MessageModal from 'modals/MessageModal';
import {isPhone} from 'yii-steroids/reducers/screen';
import ContestWizardModal from 'modals/ContestWizardModal';

const bem = html.bem('ProfileContestsPage');

@dal.hoc(
    () => dal.getContests()
        .then(items => ({items}))
)
@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class ProfileContestsPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(ContestSchema),
        isMe: PropTypes.bool,
    };

    render() {
        return (
            <div className={bem.block()}>
                {this.props.isMe && (
                    <ActionButtonBlock
                        title={__('New Contest')}
                        iconClass={'Icon__invite-user_small'}
                        onClick={() => {

                            if (this.props.isPhone) {
                                this.props.dispatch(openModal(MessageModal, {
                                    icon: 'Icon__log-in-from-pc',
                                    title: __('Log in from PC'),
                                    color: 'success',
                                    description: __('This functionality is currently only available in the desktop version of Ventuary DAO. Sorry for the inconvenience.'),
                                }));
                            } else {
                                this.props.dispatch(openModal(ContestWizardModal));
                            }
                        }}
                    />
                ) || (
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
                )}
                <div className={bem.element('card-list')}>
                    <List
                        listId='ProfileContestsPage'
                        itemView={ContestCard}
                        emptyText={__('No contests')}
                        items={this.props.items}
                    />
                </div>
            </div>
        );
    }
}
