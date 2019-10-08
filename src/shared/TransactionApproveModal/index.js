
import React from 'react';
import { html, dal, store } from 'components';
import BaseCheckbox from 'ui/form/BaseCheckbox';
import BaseModal from 'ui/modal/BaseModal';
import { openModal } from 'yii-steroids/actions/modal';
import BaseInput from 'ui/form/BaseInput';
import ProfileWizardModal from 'modals/ProfileWizardModal';
import CopyToClipboard from 'shared/CopyToClipboard';
import OutsideAlerter from 'ui/global/OutsideAlerter';
import eyeIcon from '!svg-inline-loader?classPrefix!static/icons/input/eye.svg';
import copyToIcon from 'static/icons/button/copy.svg';
import logoSvg from 'static/icons/dao-logo-white.svg';
import Button from 'yii-steroids/ui/form/Button';
import { seedUtils } from '@waves/waves-transactions';
import AlertBadge from 'shared/AlertBadge';

import './index.scss';

const bem = html.bem('TransactionApproveModal');

const INITIAL_VIEW = 'initialView';
const REQUEST_SUCCESS_VIEW = 'requestSuccessView';
const REQUEST_FAIL_VIEW = 'requestFailView';

class TransactionApproveModal extends React.Component {
    constructor (props) {
        super(props);

        this._closeModal = this._closeModal.bind(this);
        this._getView = this._getView.bind(this);

        this.state = {
            isVisible: true,
            currentView: INITIAL_VIEW
        };
    }

    _closeModal () {
        this.setState({ isVisible: false });
    }

    _getView () {
        const { currentView } = this.state;
        const onPasswordChange = () => {};
        const {
            methodName,
            payment,
            fee
        } = {
            methodName: 'donate',
            payment: '10',
            fee: '0.009 WAVES'
        };

        const badge = (
            currentView === REQUEST_SUCCESS_VIEW && (
                <AlertBadge text='The transaction was successfully confirmed'/>
            ) || 
            currentView === REQUEST_FAIL_VIEW && (
                <AlertBadge text='The transaction was denied' type='fail'/>
            )
        );
        const inputs = currentView === INITIAL_VIEW && (
            <>
                <BaseInput
                    label='Enter your password'
                    icon={eyeIcon}
                    type='password'
                    onChange={onPasswordChange}
                />
                <div className={bem.element('action-btn-cont')}>
                    <Button
                        type='submit'
                        color='primary'
                        label='Reject'
                        onClick={() => this.setState({ currentView: REQUEST_FAIL_VIEW })}
                        outline
                    />
                    <Button
                        type='submit'
                        color='primary'
                        label='Approve'
                        onClick={() => this.setState({ currentView: REQUEST_SUCCESS_VIEW })}
                    />
                </div>
            </>
        );

        return (
            <div className={bem.element('base-view')}>
                <div className={bem.element('top-heading')}>
                    <h4>Confirmation request</h4>
                </div>
                <div className={bem.element('card-body')}>
                    {badge}
                    {inputs}
                    <div className={bem.element('additional-info')}>
                        <span className='title'>Function:</span>
                        <span>{methodName}</span>
                        <span className='title'>Payment</span>
                        <span>{payment}</span>
                        <span className='title'>Fee</span>
                        <span>{fee}</span>
                    </div>
                    {currentView !== INITIAL_VIEW && (
                        <Button
                            type='submit'
                            color='primary'
                            label='Ok'
                            onClick={() => this.setState({ currentView: INITIAL_VIEW })}
                        />
                    )}
                </div>
            </div>
        )
    }

    render () {
        const { _closeModal } = this;
        const { isVisible } = this.state;

        return (
            <div className={bem.element('root')}>
                {/* <button onClick={this._triggerModal}></button> */}
                <BaseModal isVisible={isVisible}>
                    <OutsideAlerter onOutsideClick={_closeModal}>
                        {this._getView()}
                    </OutsideAlerter>
                </BaseModal>
            </div>
        )
    }
}

export default TransactionApproveModal;

