import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('Footer');

export default class Footer extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <footer className={bem.block()}>
                Footer
            </footer>
        );
    }
}
