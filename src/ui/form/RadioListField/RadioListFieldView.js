import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import './RadioListFieldView.scss';

const bem = html.bem('RadioListFieldView');

export default class RadioListFieldView extends React.PureComponent {

    static propTypes = {
        fieldId: PropTypes.string,
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.any,
        ]),
        hint: PropTypes.string,
        required: PropTypes.bool,
        isInvalid: PropTypes.bool,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        disabled: PropTypes.bool,
        inputProps: PropTypes.object,
        className: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
                PropTypes.bool,
            ]),
            label: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.any,
            ]),
        })),
        onItemClick: PropTypes.func,
    };

    render() {
        return (
            <div className={bem.block()}>
                {this.props.items.map(item => (
                    <div
                        key={item.id}
                        className={bem.element('item')}
                    >
                        <label
                            className={bem.element('label')}
                            // htmlFor={this.props.fieldId + '_' + item.id}
                        >
                            <input
                                className={bem(
                                    bem.element('input', {
                                        'is-invalid': this.props.isInvalid
                                    }),
                                )}
                                id={this.props.fieldId + '_' + item.id}
                                {...this.props.inputProps}
                                checked={item.isSelected}
                                disabled={this.props.disabled}
                                onChange={() => this.props.onItemClick(item)}
                            />
                            <span className={bem.element('icon')}>
                                <span className={bem.element('icon-circle')} />
                            </span>
                            <div className={bem.element('text')}>
                                {item.label}
                            </div>
                        </label>
                    </div>
                ))}
            </div>
        );
    }

}
