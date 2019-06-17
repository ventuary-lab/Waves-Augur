import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './InputFieldSearchView.scss';

const bem = html.bem('InputFieldSearchView');

export default class InputFieldSearchView extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        required: PropTypes.bool,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        type: PropTypes.oneOf(['text', 'email', 'hidden', 'phone', 'password']),
        placeholder: PropTypes.string,
        isInvalid: PropTypes.bool,
        disabled: PropTypes.bool,
        inputProps: PropTypes.object,
        className: PropTypes.string,
    };

    render() {
        return (
            <div className={bem.block()}>
                <span className={bem(bem.element('icon'), 'Icon')}>
                    search
                </span>
                <input
                    className={bem(
                        bem.element('input'),
                        this.props.isInvalid && 'is-invalid',
                        this.props.className,
                    )}
                    {...this.props.inputProps}
                    type={this.props.type}
                    placeholder={__('Search')}
                    disabled={this.props.disabled}
                    required={this.props.required}
                />
            </div>
        );
    }
}
