import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import 'ProfileBlock.scss';

const bem = html.bem('ProfileBlock');

export default class ProfileBlock extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>

            </div>
        );
    }
}