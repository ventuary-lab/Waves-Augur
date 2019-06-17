import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './ProfileInboxPage.scss';

const bem = html.bem('ProfileInboxPage');

export default class ProfileInboxPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <section className={bem.block()}>
                ProfileInboxPage page
            </section>
        );
    }
}
