import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
const bem = html.bem('CheckboxFieldView');
import './CheckboxFieldView.scss';

export default class CheckboxFieldView extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        required: PropTypes.bool,
        isInvalid: PropTypes.bool,
        disabled: PropTypes.bool,
        inputProps: PropTypes.object,
        className: PropTypes.string,
    };

    render() {
        return (
            <div
                className={bem(
                    bem.block({
                        disabled: this.props.disabled
                    }),
                    this.props.className
                )}
            >
                <label
                    className={bem.element('label')}
                    htmlFor={this.props.fieldId + '_' + 'checkbox'}
                >
                    <input
                        className={bem(
                            bem.element('input', {
                                'is-invalid': this.props.isInvalid
                            }),
                            this.props.className
                        )}
                        id={this.props.fieldId + '_' + 'checkbox'}
                        {...this.props.inputProps}
                        disabled={this.props.disabled}
                        required={this.props.required}
                    />
                    <div className={bem.element('container')}>
                        <div className={bem.element('inner')}>
                            <span className={bem(bem.element('icon'), 'Icon Icon__checkbox-true')}/>
                        </div>
                        <div className={bem.element('text', {required: this.props.required})}>
                            {this.props.label}
                        </div>
                    </div>
                </label>
            </div>
        );
    }
}
