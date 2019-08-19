import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {openModal} from 'yii-steroids/actions/modal';

import {dal as Dal, html} from 'components';
const dal = Dal();


import ActionButtonBlock from 'shared/ActionButtonBlock';
import InviteUserModal from 'modals/InviteUserModal';
import UserCard from 'shared/UserCard';

import './ProfileInvitedPage.scss';
import List from 'yii-steroids/ui/list/List';
import UserSchema from 'types/UserSchema';
import {ROUTE_PROJECTS_REDIRECT} from '../index';
import Link from 'yii-steroids/ui/nav/Link';
import MessageModal from '../../modals/MessageModal';
import {isPhone} from 'yii-steroids/reducers/screen';

const bem = html.bem('ProfileInvitedPage');

@dal.hoc2(
    props => ({
        url: `/api/v1/users/${props.user.address}/invites`,
        key: 'items',
        collection: 'users',
    })
)
@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class ProfileInvitedPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(UserSchema),
        isMe: PropTypes.bool,
    };

    render() {
        return (
            <div className={bem.block()}>
                {this.props.isMe && (
                    <ActionButtonBlock
                        title={__('Invite New User')}
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
                                this.props.dispatch(openModal(InviteUserModal));
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
                        listId='ProfileInvitedPage'
                        itemView={UserCard}
                        itemProps={{
                            isInvitedPage: true,
                        }}
                        emptyText={__('No invited users')}
                        items={this.props.items}
                    />
                </div>
            </div>
        );
    }
}
