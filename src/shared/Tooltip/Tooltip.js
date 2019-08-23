import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import './Tooltip.scss';

const bem = html.bem('Tooltip');

export default class Tooltip extends React.PureComponent {

    static propTypes = {
        adaptive: PropTypes.bool,
    };

    render() {
        return (
            <div className={bem.block({adaptive: this.props.adaptive})}>
                <div className={bem.element('tooltip')}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
