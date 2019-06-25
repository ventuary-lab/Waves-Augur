import React from 'react';
import PropTypes from 'prop-types';
import _uniq from 'lodash-es/uniq';
import _includes from 'lodash-es/includes';
import { InputField } from 'yii-steroids/ui/form';
import fieldHoc from 'yii-steroids/ui/form/fieldHoc';
import dataProviderHoc from 'yii-steroids/ui/form/dataProviderHoc';
import enhanceWithClickOutside from 'react-click-outside';

import { html } from 'components';

const bem = html.bem('TagsField');
import './TagsField.scss';

export default
@fieldHoc({
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

    componentWillReceiveProps(nextProps) {
        // Add by dataProviderHoc on enter click
        if (this.props.input.value !== nextProps.input.value && this.props.isOpened) {
            this.setState({ value: '' });
            this.props.onClose();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this._onKeyDown);
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
                                onFocus: this._onFocus,
                            }}
                        />
                    </div>
                    {this.props.isOpened && (
                        <div className={bem.element('drop-down')}>
                            <div className={bem.element('drop-down-list')}>
                                {this.props.items
                                    .filter(item => !_includes(this.getValues(), item.id))
                                    .map(item => (
                                        <div
                                            key={item.id}
                                            className={bem.element('drop-down-item', {
                                                hover: this.props.hoveredItem && this.props.hoveredItem.id === item.id,
                                                select: !!this.props.selectedItems.find(selectedItem => selectedItem.id === item.id),
                                            })}
                                            onClick={() => this._onItemClick(item)}
                                            onMouseOver={() => this.props.onItemMouseOver(item)}
                                        >
                                            <span>{item.label}</span>
                                            <span>{item.total}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
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
                                        onClick={() => this._onRemove(value)}
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
            this.setState({ value: '' });
            this.props.input.onChange(_uniq(this.getValues().concat(value)));
        }
    }

    _onFocus() {
        if (this.state.value && !this.props.isOpened) {
            this.props.onOpen();
            this.props.onSearch(this.state.value);
        }
    }

    _onRemove(value) {
        const skills = this.getValues();
        const index = skills.indexOf(value);
        if (index !== -1) {
            skills.splice(index, 1);
            this.props.input.onChange(skills);
        }
    }

    _onChange(value) {
        if (this.props.autoComplete) {
            if (value && !this.props.isOpened) {
                this.props.onOpen();
            }
            this.props.onSearch(value);
        }
        this.setState({ value });
    }

    _onItemClick(item) {
        this._onAdd(item.id);
        this.props.onClose();
    }

    _onKeyDown(e) {
        // On enter
        if (e.which === 13 && !this.props.hoveredItem) {
            e.preventDefault();
            this._onAdd(this.state.value);
        }
    }
}
