import React from 'react';
import { dal, html } from 'components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import InputField from 'yii-steroids/ui/form/InputField';
import Button from 'yii-steroids/ui/form/Button';
import SelectDropdown from 'ui/form/SelectDropdown';
import UserSchema from 'types/UserSchema';
import CopyToClipboard from 'shared/CopyToClipboard';
import crossIcon from 'static/icons/cross-icon-artwork.svg';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';

import KeeperApproveView from './views/KeeperApprove';
import TransactionSuccessView from './views/TransactionSuccess';

const bem = html.bem('BaseTransferModal');

import './index.scss';

class BaseTransferModal extends React.PureComponent {

    static propTypes = {
        isMe: PropTypes.bool,
        user: UserSchema,
    };

    constructor(props) {
        super(props);

        this._getViews = this._getViews.bind(this);
        this._getBaseView = this._getBaseView.bind(this);
        this._getTransactionSuccessfulView = this._getTransactionSuccessfulView.bind(this);
        this._getTransactionFailureView = this._getTransactionFailureView.bind(this);
        this._onAmountChange = this._onAmountChange.bind(this);
        this._transferFunds = this._transferFunds.bind(this);
        this._generateInvoice = this._generateInvoice.bind(this);
        this._getBaseNextButton = this._getBaseNextButton.bind(this);

        this.onlyFloatNumRegex = /^[+-]?\d+(\.)?(\.\d+)?$/;

        this.state = {
            viewIndex: this.props.modalProps.initialViewIndex || 0,
            transferAmount: 0
        };
    }

    _generateInvoice () {
        return [
            window.location.origin,
            'invoice',
            'WAVES',
            this.props.user.address,
            this.state.transferAmount
        ].join('/');
    }

    async _transferFunds (address) {
        const { transferAmount } = this.state;

        if (!transferAmount) {
            return;
        };

        try {
            await dal.transferFunds(address, transferAmount);
            this.setState({ transferAmount, viewIndex: 1 });
        } catch (err) {
            this.setState({ viewIndex: 2 });
        }
    }

    _onAmountChange (val) {
        if (val === '' || this.onlyFloatNumRegex.test(val)) {
            this.setState({ transferAmount: val });
        }
    }

    _getBaseNextButton () {
        if (this.props.isInvoice) {
            return (
                <CopyToClipboard copyText={this._generateInvoice()}>
                    <Button
                        type='submit'
                        color='primary'
                        label={this.props.modalProps.approveButton.label}
                    />
                </CopyToClipboard>
            );
        }

        const _transferFunds = async () => {
            await this._transferFunds(_.get(this.props, 'user.address'));
        };

        return (
            <Button
                type='submit'
                color='primary'
                label={this.props.modalProps.approveButton.label}
                onClick={_transferFunds}
            />
        );
    }

    _getBaseView () {
        const { _onAmountChange } = this;
        const { user } = this.props;
        const { profile } = user;
        const InputFieldView = InputField.WrappedComponent;

        return (
            <>
                <div className={bem.element('transfer-body')}>
                    <div>
                        <span>Transfer recipient:</span>
                        <div>
                            <div>
                                <img src={profile.avatar || anonymousAvatarStub}/>
                            </div>
                            <div>
                                <span>{profile.name}</span>
                                <span>{profile.title}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span>Transfer amount:</span>
                        <div>
                            <div className={bem.element('amount-input')}>
                                <span>Amount</span>
                                <InputFieldView
                                    layout={'default'}
                                    topLabel={__('Amount')}
                                    input={{
                                        value: this.state.transferAmount,
                                        onChange: _onAmountChange
                                    }}
                                />
                            </div>
                            <SelectDropdown options={['WAVES']} initialIndex={1}/>
                        </div>
                    </div>
                </div>
                <div className={bem.element('buttons')}>
                    {this._getBaseNextButton()}
                </div>
            </>
        );
    }

    _getTransactionSuccessfulView () {
        const { transferAmount: amount } = this.state;

        return (
            <TransactionSuccessView
                amount={amount}
                onOk={() => this.props.onClose()}
                user={this.props.user}
            />
        );
    }
    
    _getTransactionFailureView () {
        return (
            <KeeperApproveView
                onOk={() => this.props.onClose()}
            />
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
        const { modalProps } = this.props;

        const currentView = this._getViews()[viewIndex];

        return (
            <section className={computedClassList}>
                <div>
                    <div>
                        <span>{modalProps.heading}</span>
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