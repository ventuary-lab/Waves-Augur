import React from 'react';
import PropTypes from 'prop-types';
import _uniq from 'lodash-es/uniq';
import {InputField} from 'yii-steroids/ui/form';
import fieldHoc from 'yii-steroids/ui/form/fieldHoc';
import dataProviderHoc from 'yii-steroids/ui/form/dataProviderHoc';
import enhanceWithClickOutside from 'react-click-outside';

import {html} from 'components';

const bem = html.bem('TagsField');
import './TagsField.scss';
import _remove from 'lodash/remove';

export default @fieldHoc({
    componentId: 'form.TagsField',
})
@dataProviderHoc()
@enhanceWithClickOutside
class TagsField extends React.PureComponent {

    static propTypes = {
        placeholder: PropTypes.string,
        input: PropTypes.shape({
            value: PropTypes.arrayOf(PropTypes.string),
            onChange: PropTypes.func,
        }),
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            label: PropTypes.string,
        })),
        selectedItems: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            label: PropTypes.string,
        })),
        hoveredItem: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            label: PropTypes.string,
        }),
        autoComplete: PropTypes.bool,
        isOpened: PropTypes.bool,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onSearch: PropTypes.func,
        onItemClick: PropTypes.func,
        onItemMouseOver: PropTypes.func,
        max: PropTypes.number,
    };

    constructor() {
        super(...arguments);

        this.state = {
            value: '',
        };

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onChange = this._onChange.bind(this);
    }


    handleClickOutside() {
        if (this.props.autoComplete) {
            this.props.onClose();
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this._onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this._onKeyDown);
    }

    componentWillReceiveProps(nextProps) {
        // Add by dataProviderHoc on enter click
        if (this.props.input.value !== nextProps.input.value && this.props.isOpened) {
            this.setState({value: ''});
            this.props.onClose();
        }
    }

    getValues() {
        return [].concat(this.props.input.value || []);
    }

    render() {
        const InputFieldInternal = InputField.WrappedComponent;

        return (
            <div className={bem.block()}>
                <div className={bem.element('field')}>
                    <div className={bem.element('input')}>
                        <InputFieldInternal
                            placeholder={this.props.placeholder}
                            input={{
                                value: this.state.value,
                                onChange: this._onChange,
                                onKeyDown: this._onKeyDown
                            }}
                        />
                    </div>
                </div>
                {this.getValues().length > 0 && (
                    <div className={bem.element('skills')}>
                        <ul className={bem.element('skill-list')}>
                            {this.getValues().map(value => (
                                <li
                                    key={value}
                                    className={bem.element('skill-item')}
                                    title={value}
                                >
                                    {value}
                                    <span
                                        className={bem(
                                            bem.element('skill-remove'),
                                            'Icon Icon__close-small'
                                        )}
                                        onClick={e => this._onRemove(e, value)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    _onAdd(value) {
        if (value) {
            this.setState({value: ''});
            let values = _uniq(this.getValues().concat(value));
            if (this.props.max > 0) {
                values.splice(this.props.max);
            }
            this.props.input.onChange(values);
        }
    }

    _onRemove(e, value) {
        e.preventDefault();
        this.props.input.onChange(_remove(this.getValues(), tag => tag !== value));
    }

    _onChange(value) {
        if (this.props.autoComplete) {
            if (value && !this.props.isOpened) {
                this.props.onOpen();
            }
            this.props.onSearch(value);
        }
        this.setState({value});
    }

    _onKeyDown(e) {
        // On enter
        if (e.which === 13 && !this.props.hoveredItem) {
            e.preventDefault();
            e.stopPropagation();
            this._onAdd(this.state.value);
        }
    }
}
