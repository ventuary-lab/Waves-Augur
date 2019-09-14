import React from 'react';
import { html } from 'components';
import PropTypes from 'prop-types';
import InputField from 'yii-steroids/ui/form/InputField';
import Button from 'yii-steroids/ui/form/Button';
import SelectDropdown from 'ui/form/SelectDropdown';
import UserSchema from 'types/UserSchema';
import crossIcon from 'static/icons/cross-icon-artwork.svg';

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

        this.state = {
            viewIndex: 0,
            transferAmount: 0
        };
    }

    _onAmountChange (event) {
        console.log(event);
    }

    _getBaseView () {
        const { _onAmountChange } = this;
        const { user } = this.props;
        const { profile } = user;

        return (
            <>
                <div className={bem.element('transfer-body')}>
                    <div>
                        <span>Transfer recipient:</span>
                        <div>
                            <div>
                                <img src={profile.avatar}/>
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
                            <InputField
                                layout={'default'}
                                topLabel={__('Amount')}
                                attribute={'name'}
                            />
                            <SelectDropdown options={['WAVES']} initialIndex={1}/>
                        </div>
                    </div>
                </div>
                <div className={bem.element('buttons')}>
                    {/* <Button
                        type='submit'
                        color='primary'
                        label='Terms of Transfer'
                        link
                    /> */}
                    <Button
                        type='submit'
                        color='primary'
                        label='Transfer'
                        onClick={() => this.setState({ viewIndex: 1 })}
                    />
                </div>
            </>
        );
    }

    _getTransactionSuccessfulView () {
        const { transferAmount: amount } = this.state;

        return (
            <TransactionSuccessView
                amount={amount}
                onOk={() => this.setState({ viewIndex: 2 })}
                user={this.props.user}
            />
        );
    }
    
    _getTransactionFailureView () {
        return (
            <KeeperApproveView
                onOk={() => this.setState({ viewIndex: 0 })}
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

        const currentView = this._getViews()[viewIndex];

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