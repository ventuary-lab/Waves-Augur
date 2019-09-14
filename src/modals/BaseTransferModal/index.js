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

        this._getViews = this._getViews.bind(this);
        this._getBaseView = this._getBaseView(this);
        this._getTransactionSuccessfulView = this._getTransactionSuccessfulView(this);
        this._getTransactionFailureView = this._getTransactionFailureView(this);

        this.state = {
            viewIndex: 1
        };
    }

    _getBaseView () {
        return (
            <>
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
                            <SelectDropdown options={['WAVES', 'WRT (Waves Reward Token)']} initialIndex={1}/>
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
            </>
        );
    }

    _getTransactionSuccessfulView () {
        return (
            <>
                <div className={bem.element('transaction-success-body')}>
                </div>
                <div>
                    <Button
                        type='submit'
                        color='primary'
                        label='Ok'
                    />
                </div>
            </>
        );
    }
    
    _getTransactionFailureView () {
        return (
            <>
                <div className={bem.element('transaction-failure-body')}>
                </div>
                <div>
                    <Button
                        type='submit'
                        color='primary'
                        label='Ok, I understand'
                    />
                </div>
            </>
        );
    }

    _getViews () {
        return [
            this._getBaseView(),
            this._getTransactionSuccessfulView(),
            this._getTransactionFailureView()
        ];
    }


    render() {
        const { onClose, className } = this.props;
        const { viewIndex } = this.state;
        const computedClassList = [
            bem.element('root'),
            className
        ].join(' ');

        const currentView = this.views[viewIndex];

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
                        {currentView}
                    </div>
                </div>
            </section>
        )
    }
}

export default BaseTransferModal;