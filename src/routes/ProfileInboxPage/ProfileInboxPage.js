import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './ProfileInboxPage.scss';

const bem = html.bem('ProfileInboxPage');

export default class ProfileInboxPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.array,
    };

    render() {
        return (
            <div className={bem.block()}>
                InboxPage
            </div>
        );
    }
}
