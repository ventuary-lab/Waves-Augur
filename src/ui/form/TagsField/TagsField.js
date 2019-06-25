import React from 'react';
import PropTypes from 'prop-types';
import fieldHoc from 'yii-steroids/ui/form/fieldHoc';
import _uniq from 'lodash/uniq';
import _remove from 'lodash/remove';
import dataProviderHoc from 'yii-steroids/ui/form/dataProviderHoc';
import propsHoc from 'yii-steroids/ui/propsHoc';

import {html} from 'components';

const bem = html.bem('TagsField');

import './TagsField.scss';

export default @fieldHoc({
    componentId: 'form.TagsField',
})
@propsHoc({
    multiple: true,
})
@dataProviderHoc()
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
                    {...this.props.inputProps}
                    onKeyDown={this._onKeyDown}
                />
                <div>
                    {[].concat(this.props.input.value || []).map((tag, index) => (
                        <div
                            key={index}
                            onClick={e => this._onRemoveItem(e, tag)}
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    _onRemoveItem(e, tag) {
        e.preventDefault();

        const tags = [].concat(this.props.input.value) || [];
        this.props.input.onChange(_remove(tags, t => t !== tag));
    }

    _onKeyDown(e) {
        if (e.which === 13) { // enter
            e.preventDefault();

            const tags = [].concat(this.props.input.value) || [];
            tags.push(e.target.value);
            e.target.value = '';
            this.props.input.onChange(_uniq(tags));

        }
    }

}
