import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './ProfileDonationPage.scss';

const bem = html.bem('ProfileDonationPage');

export default class ProfileDonationPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.array,
    };

    render() {
        return (
            <div className={bem.block()}>
                DonationPage
            </div>
        );
    }
}
