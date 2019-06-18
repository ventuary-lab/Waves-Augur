import React from 'react';
import PropTypes from 'prop-types';

import ProfileLayout from 'shared/ProfileLayout';
import ActionButtonBlock from 'shared/ActionButtonBlock';

import {html} from 'components';

import './ProfileVotingPage.scss';

const bem = html.bem('ProfileVotingPage');

export default class ProfileVotingPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                <ProfileLayout>
                    <ActionButtonBlock
                        title={__('Explore New Ideas')}
                        iconClass={'Icon__explore-ideas'}
                    />
                </ProfileLayout>
            </div>
        );
    }
}
