import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './ProfilePage.scss';

const bem = html.bem('ProfilePage');

export default class ProfilePage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <section className={bem.block()}>
                ProfilePage page
            </section>
        );
    }
}
