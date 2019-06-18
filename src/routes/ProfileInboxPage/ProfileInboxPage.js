import React from 'react';
import PropTypes from 'prop-types';

import ProfileLayout from 'shared/ProfileLayout';

import {html} from 'components';

import './ProfileInboxPage.scss';

const bem = html.bem('ProfileInboxPage');

export default class ProfileInboxPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                <ProfileLayout>
                    InboxPage
                </ProfileLayout>
            </div>
        );
    }
}
