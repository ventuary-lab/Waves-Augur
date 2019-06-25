import React from 'react';
import PropTypes from 'prop-types';
import fieldHoc from 'yii-steroids/ui/form/fieldHoc';
import Button from 'yii-steroids/ui/form/Button';

import {html} from 'components';

const bem = html.bem('AvatarField');

import './AvatarField.scss';

export default
@fieldHoc({
    componentId: 'form.AvatarField',
})
class AvatarField extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        attribute: PropTypes.string,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        required: PropTypes.bool,
        placeholder: PropTypes.string,
        isInvalid: PropTypes.bool,
        disabled: PropTypes.bool,
        inputProps: PropTypes.object,
    };

    render() {
        return (
            <div className={bem.block({invalid: this.props.isInvalid})}>
                <input
                    type='text'
                    className={bem.element('input')}
                    placeholder={this.props.placeholder || __('Enter URL')}
                    disabled={this.props.disabled}
                    required={this.props.required}
                    {...this.props.input}
                    {...this.props.inputProps}
                />
                <Button color='primary'>
                    {__('Connect')}
                </Button>
                {this.props.input.value && (
                    <img
                        src={this.props.input.value}
                        alt={__('Avatar')}
                    />
                )}
            </div>
        );
    }

}
