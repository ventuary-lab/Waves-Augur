import React from 'react';
import PropTypes from 'prop-types';

import ProfileLayout from 'shared/ProfileLayout';

import {html} from 'components';

import './ProfileDonationPage.scss';

const bem = html.bem('ProfileDonationPage');

export default class ProfileDonationPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                <ProfileLayout>
                    DonationPage
                </ProfileLayout>
            </div>
        );
    }
}
