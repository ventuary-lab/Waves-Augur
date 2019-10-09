
import React from 'react';
import { html } from 'components';
import BaseModal from 'ui/modal/BaseModal';
import BaseInput from 'ui/form/BaseInput';
import OutsideAlerter from 'ui/global/OutsideAlerter';
import eyeIcon from '!svg-inline-loader?classPrefix!static/icons/input/eye.svg';
import Button from 'yii-steroids/ui/form/Button';
import AlertBadge from 'shared/AlertBadge';
import ModalsContext from 'shared/Layout/context';

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

        this.views = {
            initial: INITIAL_VIEW,
            success: REQUEST_SUCCESS_VIEW,
            failure: REQUEST_FAIL_VIEW
        };

        this.state = {
            isVisible: this.props.isVisible,
            currentView: this.views.initial,
            password: ''
        };
    }

    _closeModal () {
        this.setState({ isVisible: false });
    }

    _getView () {
        const { currentView: _currentView } = this.state;
        const onPasswordChange = (e) => {
            const value = e.target.value;

            this.setState({ password: value });
        };
        const {
            methodName,
            payment,
            // fee
        } = {
            methodName: this.props.method,
            payment:  this.props.payment,
            // fee: '0.009 WAVES'
        };

        const onApprove = () => {
            this.props.onSendPassword(this.state.password);
        };

        const currentView = this.views[this.props.initialView] || _currentView;

        const badge = (
            currentView === REQUEST_SUCCESS_VIEW && (
                <AlertBadge text='The transaction was successfully confirmed'/>
            ) ||
            currentView === REQUEST_FAIL_VIEW && (
                <AlertBadge text='The transaction was denied' type='fail'/>
            )
        );

        return (
            <ModalsContext.Consumer>
                {({ approveModal }) => (
                    <div className={bem.element('base-view')}>
                        <div className={bem.element('top-heading')}>
                            <h4>Confirmation request</h4>
                        </div>
                        <div className={bem.element('card-body')}>
                            {badge}
                            {currentView === INITIAL_VIEW && (
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
                                            onClick={() => {
                                                this.props.onFailure();
                                                // approveModal.setState({ isVisible: false, initialView: INITIAL_VIEW });
                                            }}
                                            outline
                                        />
                                        <Button
                                            type='submit'
                                            color='primary'
                                            label='Approve'
                                            onClick={onApprove}
                                        />
                                    </div>
                                </>
                            )}
                            <div className={bem.element('additional-info')}>
                                <span className='title'>Function:</span>
                                <span>{methodName}</span>
                                <span className='title'>Payment</span>
                                <span>{payment}</span>
                                {/* <span className='title'>Fee</span>
                                <span>{fee}</span> */}
                            </div>
                            {currentView !== INITIAL_VIEW && (
                                <Button
                                    type='submit'
                                    color='primary'
                                    label='Ok'
                                    onClick={() => {
                                        approveModal.setState({ isVisible: false, initialView: INITIAL_VIEW });
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </ModalsContext.Consumer>
        );
    }

    render () {
        const { isVisible } = this.state;

        return (
            <div className={bem.element('root')}>
                <BaseModal isVisible={isVisible}>
                    <ModalsContext.Consumer>
                        {({ approveModal }) => (
                            <OutsideAlerter onOutsideClick={() => {
                                if (this.props.onFailure) {
                                    this.props.onFailure();
                                }
                                approveModal.setState({ isVisible: false });
                            }}>
                                {this._getView()}
                            </OutsideAlerter>
                        )}
                    </ModalsContext.Consumer>
                </BaseModal>
            </div>
        )
    }
}