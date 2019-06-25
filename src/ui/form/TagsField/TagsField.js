import React from 'react';
import PropTypes from 'prop-types';
import fieldHoc from 'yii-steroids/ui/form/fieldHoc';
import Button from 'yii-steroids/ui/form/Button';

import {html} from 'components';

const bem = html.bem('TagsField');

import './TagsField.scss';
import InputTag from 'shared/InputTag';

export default
@fieldHoc({
    componentId: 'form.TagsField',
})
class TagsField extends React.PureComponent {

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

    constructor(props) {
        super(props);

        this._onKeyDown = this._onKeyDown.bind(this);
    }

    render() {
        return (
            <div className={bem.block({invalid: this.props.isInvalid})}>
                <label>{__('Use ‘Enter’ to add a hashtag (10 max)')}</label>
                <input
                    type='text'
                    className={bem.element('input')}
                    placeholder={this.props.placeholder || __('Enter')}
                    disabled={this.props.disabled}
                    required={this.props.required}
                    {...this.props.input}
                    {...this.props.inputProps}
                    onKeyDown={this._onKeyDown}
                />
                <div>
                    {tags.map((tag) => <InputTag>{tag}</InputTag>)}
                </div>


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

    _onKeyDown(e) {
        if (e.which === 13) { // enter
            e.preventDefault();


        }
    }

}
