
import React from 'react';
import { html } from 'components';
import BaseModal from 'ui/modal/BaseModal';
import BaseInput from 'ui/form/BaseInput';
import OutsideAlerter from 'ui/global/OutsideAlerter';
import eyeIcon from '!svg-inline-loader?classPrefix!static/icons/input/eye.svg';
import Button from 'yii-steroids/ui/form/Button';
import AlertBadge from 'shared/AlertBadge';

import './index.scss';

const bem = html.bem('TransactionApproveModal');

const INITIAL_VIEW = 'initialView';
const REQUEST_SUCCESS_VIEW = 'requestSuccessView';
const REQUEST_FAIL_VIEW = 'requestFailView';

export default function TransactionApproveModal (props) {
    const { isVisible } = props;

    return isVisible ? <Wrapped {...props}/> : null;
}

class Wrapped extends React.Component {
    constructor (props) {
        super(props);

        this._closeModal = this._closeModal.bind(this);
        this._getView = this._getView.bind(this);

        this.state = {
            isVisible: this.props.isVisible,
            currentView: INITIAL_VIEW
        };
    }

    _closeModal () {
        this.setState({ isVisible: false });
    }

    _getView () {
        const { currentView } = this.state;
        const onPasswordChange = (e) => {
            const value = e.target.value;

            if (!value || value.length < 24) {
                return;
            }
        };
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
                <BaseModal isVisible={isVisible}>
                    <OutsideAlerter onOutsideClick={_closeModal}>
                        {this._getView()}
                    </OutsideAlerter>
                </BaseModal>
            </div>
        )
    }
}