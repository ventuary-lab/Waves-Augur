import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './HeaderHamburger.scss';

const bem = html.bem('HeaderHamburger');

export default class HeaderHamburger extends React.PureComponent {

    static propTypes = {
        isActive: PropTypes.bool,
        onClick: PropTypes.func,
    };

    render() {
        return (
            <button
                className={bem.block({active: this.props.isActive})}
                onClick={this.props.onClick || null}
            >
                <div
                    className={bem.element('line')}
                    aria-hidden
                />
                <div
                    className={bem.element('line')}
                    aria-hidden
                />
                <div
                    className={bem.element('line')}
                    aria-hidden
                />
            </button>
        );
    }
}
