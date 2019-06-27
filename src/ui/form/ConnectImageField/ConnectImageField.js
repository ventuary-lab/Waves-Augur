import React from 'react';
import {InputField} from 'yii-steroids/ui/form';
import fieldHoc from 'yii-steroids/ui/form/fieldHoc';
import Button from 'yii-steroids/ui/form/Button';

import {html} from 'components';

const bem = html.bem('ConnectImageField');
import './ConnectImageField.scss';

export default
@fieldHoc({
    componentId: 'form.ConnectImageField',
})
class ConnectImageField extends React.PureComponent {

    static propTypes = {};

    constructor() {
        super(...arguments);

        this.state = {
            value: '',
            imageUrl: '',
        };

        this._onChange = this._onChange.bind(this);
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
                </div>
                <div className={bem.element('inner')}>
                    <Button
                        className={bem.element('action')}
                        label={__('Connect')}
                        color='primary'
                        layout='default'
                        onClick={() => this.setState({imageUrl: this.state.value})}
                    />
                    {this.state.imageUrl && (
                        <img
                            className={bem.element('avatar')}
                            src={this.state.imageUrl || ''}
                            alt='avatar'
                        />
                    )}
                </div>
            </div>
        );
    }

    _onChange(value) {
        this.setState({value});
    }
}
