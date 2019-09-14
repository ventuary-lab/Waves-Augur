import React from 'react';
import { html } from 'components';
import InputField from 'yii-steroids/ui/form/InputField';
import Button from 'yii-steroids/ui/form/Button';
import crossIcon from 'static/icons/cross-icon-artwork.svg';
import SelectDropdown from 'ui/form/SelectDropdown';
import anonymousImg from 'static/images/anonymous-avatar-stub.jpeg';

const bem = html.bem('BaseTransferModal');

import './index.scss';
import {
    triggerDocumentScroll
} from 'ui/global/helper';

class BaseTransferModal extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount () {
        // triggerDocumentScroll('block');
    }

    componentWillUnmount () {
        // triggerDocumentScroll('unblock');
    }

    render() {
        const { onClose, className } = this.props;
        const computedClassList = [
            bem.element('root'),
            className
        ].join(' ');

        return (
            <section className={computedClassList}>
                <div>
                    <div>
                        <span>Transferring funds to a user</span>
                        <div>
                            <img src={crossIcon} onClick={onClose}/>
                        </div>
                    </div>
                    <div className={bem.element('body')}>
                        <div className={bem.element('transfer-body')}>
                            <div>
                                <span>Transfer recipient:</span>
                                <div>
                                    <div>
                                        <img src={anonymousImg}/>
                                    </div>
                                    <div>
                                        <span>Aleksei Pupyshev</span>
                                        <span>Founder & CEO @Ventuary</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span>Transfer amount:</span>
                                <div>
                                    <InputField
                                        layout={'default'}
                                        topLabel={__('Amount')}
                                        attribute={'name'}
                                    />
                                    <SelectDropdown options={['asd', 'foo', 'bar']}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button
                                type='submit'
                                color='primary'
                                label='Terms of Transfer'
                                link
                            />
                            <Button
                                type='submit'
                                color='primary'
                                label='Transfer'
                            />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default BaseTransferModal;