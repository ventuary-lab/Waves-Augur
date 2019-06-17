import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './InboxPage.scss';

const bem = html.bem('InboxPage');

export default class InboxPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <section className={bem.block()}>
                InboxPage page
            </section>
        );
    }
}
