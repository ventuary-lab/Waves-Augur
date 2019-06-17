import React from 'react';
import PropTypes from 'prop-types';

import ProfileLayout from 'shared/ProfileLayout';

import {html} from 'components';

import './ProfileInvitedPage.scss';

const bem = html.bem('ProfileInvitedPage');

export default class ProfileInvitedPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                <ProfileLayout>
                    InvitedPage
                </ProfileLayout>
            </div>
        );
    }
}
