import React from 'react';
import {InputField} from 'yii-steroids/ui/form';
import fieldHoc from 'yii-steroids/ui/form/fieldHoc';
import ButtonView from 'yii-steroids/ui/form/Button/ButtonView';

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
    }

    render() {
        const InputFieldInternal = InputField.WrappedComponent;

        return (
            <div className={bem.block({
                'is-invalid': this.props.isInvalid
            })}>
                <div className={bem.element('field')}>
                    <div className={bem.element('input')}>
                        <InputFieldInternal
                            placeholder={this.props.placeholder}
                            input={{
                                ...this.props.input,
                            }}
                            isInvalid={this.props.isInvalid}
                        />
                    </div>
                </div>
                <div className={bem.element('inner')}>
                    <ButtonView
                        className={bem.element('action')}
                        color='primary'
                        type={'button'}
                        onClick={() => this.setState({imageUrl: this.props.input.value})}
                    >
                        {__('Connect')}
                    </ButtonView>
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
}
