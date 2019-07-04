import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {isSubmitting} from 'redux-form';

import {html} from 'components';
const bem = html.bem('FormView');

import './FormView.scss';

@connect(
    (state, props) => ({
        isSubmitting: isSubmitting(props.formId)(state),
    })
)
export default class FormView extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        required: PropTypes.bool,
        isInvalid: PropTypes.bool,
        isSubmitting: PropTypes.bool,
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        className: PropTypes.string,
    };

    render() {
        return (
            <form
                className={bem(
                    bem.block({submitting: this.props.isSubmitting}),
                    this.props.className,
                    this.props.layout === 'horizontal' && 'form-horizontal',
                )}
                onSubmit={this.props.onSubmit}
            >
                {this.props.children}
            </form>
        );
    }

}
