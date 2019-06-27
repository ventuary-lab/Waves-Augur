import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import './FieldLayoutView.scss';
const bem = html.bem('FieldLayoutView');

export default class FieldLayoutView extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        topLabel: PropTypes.string,
        labelIconClass: PropTypes.string,
        hint: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        errors: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        required: PropTypes.bool,
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        layoutClassName: PropTypes.string,
    };

    render() {
        return (
            <div className={bem(
                bem.block({
                    layout: this.props.layout
                }),
                this.props.layoutClassName,
                this.props.layout === 'horizontal' && 'form-row',
            )}>
                {this.props.label && (
                    <label className={bem(
                        bem.element('label', {
                            required: this.props.required
                        }),
                        this.props.layout === 'horizontal' && 'form-label-col',
                    )}>
                        {this.props.labelIconClass && (
                            <span className={bem(bem.element('label-icon'), this.props.labelIconClass)}/>
                        )}
                        {this.props.label}
                    </label>
                )}
                <div
                    className={bem(
                        bem.element('field'),
                        this.props.layout === 'horizontal' && 'form-field-col',
                    )}
                >
                    {this.props.topLabel && (
                        <span className={bem.element('top-label')}>
                            {this.props.topLabel}
                        </span>
                    )}
                    {this.props.children}
                    {this.props.errors && (
                        <div className={bem.element('invalid-feedback')}>
                            {[].concat(this.props.errors).map((error, index) => (
                                <div key={index}>
                                    {error}
                                </div>
                            ))}
                        </div>
                    )}
                    {!this.props.errors && this.props.hint && (
                        <div className={bem(bem.element('hint'))}>
                            {this.props.hint}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
