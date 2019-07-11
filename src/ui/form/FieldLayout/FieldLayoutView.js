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
                    layout: this.props.layout,
                    'has-errors': !!this.props.errors,
                }),
                this.props.layoutClassName,
                this.props.layout === 'horizontal' && 'form-row',
            )}>
                {this.props.label && (
                    <label className={bem(
                        bem.element('label', {
                            required: this.props.required
                        }),
                        this.getLayoutClass(false),
                    )}>
                        <span className={bem.element('label-inner')}>
                            {this.props.labelIconClass && (
                                <span className={bem(bem.element('label-icon'), this.props.labelIconClass)}/>
                            )}
                            {this.props.label}
                        </span>
                    </label>
                )}
                <div
                    className={bem(
                        bem.element('field'),
                        this.getLayoutClass(true),
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

    getLayoutClass(isField) {
        const className = isField ? 'form-field-col' : 'form-label-col';
        const alignClassName = isField ? 'form-field-col_align-left' : 'form-label-col_align-left';

        if (this.props.layout === 'horizontal') {
            if (this.props.layoutProps && this.props.layoutProps.align) {
                return this.props.layoutProps.align === 'left' ? `${className} ${alignClassName}` : className;
            }

            return className;
        }

        return null;
    }
}
