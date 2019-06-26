import React from 'react';
import {connect} from 'react-redux';
import {openModal} from 'yii-steroids/actions/modal';

import {html} from 'components';
import ActionButtonBlock from 'shared/ActionButtonBlock';
import InviteUserModal from 'modals/InviteUserModal';
import InvitedUserCard from './views/InvitedUserCard';

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
                <InvitedUserCard
                    title={'Aleksei Pupyshev'}
                    description={'Founder & CEO @Ventuary'}
                    logoUrl={''}
                    coverUrl={''}
                    country={'Russia'} //TODO: need enum
                    activity={1422}
                    tags={['Consulting', 'RND', 'Analytics', 'Research and Development']}
                    socials={{
                        url_twitter: 'test',
                        url_facebook: 'test',
                        url_linkedin: 'test',
                        url_instagram: 'test',
                        url_telegram: 'test',
                        url_website: 'test',
                    }}
                />
            </div>
        );
    }
}
