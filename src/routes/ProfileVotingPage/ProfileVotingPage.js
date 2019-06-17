import React from 'react';
import PropTypes from 'prop-types';

import ProfileLayout from 'shared/ProfileLayout';

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
                    VotingPage
                </ProfileLayout>
            </div>
        );
    }
}
