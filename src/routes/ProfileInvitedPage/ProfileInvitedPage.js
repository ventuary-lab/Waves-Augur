import React from 'react';
import {connect} from 'react-redux';
import {openModal} from 'yii-steroids/actions/modal';

import {html} from 'components';
import ActionButtonBlock from 'shared/ActionButtonBlock';
import InviteUserModal from 'modals/InviteUserModal';

import './ProfileInvitedPage.scss';

const bem = html.bem('ProfileInvitedPage');

@connect()
export default class ProfileInvitedPage extends React.PureComponent {


    render() {
        return (
            <div className={bem.block()}>
                <ActionButtonBlock
                    title={__('Invite New User')}
                    iconClass={'Icon__new-project'}
                    onClick={() => this.props.dispatch(openModal(InviteUserModal))}
                />
                InvitedPage
            </div>
        );
    }
}
