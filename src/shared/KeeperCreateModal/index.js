import React from 'react';
import { html } from 'components';
import BaseCheckbox from 'ui/form/BaseCheckbox';
import BaseModal from 'ui/modal/BaseModal';
import BaseInput from 'ui/form/BaseInput';
import CopyToClipboard from 'shared/CopyToClipboard';
import eyeIcon from '!svg-inline-loader?classPrefix!static/icons/input/eye.svg';
import copyToIcon from 'static/icons/button/copy.svg';
import logoSvg from 'static/icons/dao-logo-white.svg';
import Button from 'yii-steroids/ui/form/Button';

const bem = html.bem('KeeperCreateModal');

import './index.scss';

function RightFormContainer ({ heading, body, children }) {

    return (
        <div className={bem.element('right-form-container')}>
            <h4>{heading}</h4>
            <p>{body}</p>
            {children}
        </div>
    )
}

class KeeperCreateModal extends React.Component {
    constructor(props) {
        super(props);

        this._triggerModal = this._triggerModal.bind(this);
        this._setTabIndex = this._setTabIndex.bind(this);
        this._getInviteStartView = this._getInviteStartView.bind(this);
        this._getAccountAddressView = this._getAccountAddressView.bind(this);
        this._getAccountNameView = this._getAccountNameView.bind(this);
        this._getLeftSideView = this._getLeftSideView.bind(this);
        this._mapButton = this._mapButton.bind(this);
        this._getView = this._getView.bind(this);

        this.accountCreateInfoProps = {
            heading: 'Create new Waves account',
            body: `
                Congratulations, you have received an invitation from a DAO’s member.
                Now, we will guide you step-by-step as you register.
                To use our platform, you require a Waves account — let’s set it up first.
            `
        };

        this.welcomeInfoProps = {
            heading: 'Welcome to the DAO',
            body: `
                Congratulations, you have received an invitation from a DAO’s member.
                Now, we will guide you step-by-step as you register.
                To use our platform, you require a Waves account — let’s set it up first.
            `
        };

        this.state = {
            isVisible: true,
            inviteStart: {
                tabIndex: 0
            }
        };
    }

    _triggerModal () {
        this.setState(prevState => ({ ...prevState, isVisible: !prevState.isVisible }))
    }

    _setTabIndex (tabIndex) {
        this.setState(prevState => (
            {
                ...prevState,
                inviteStart: {
                    ...prevState.inviteStart,
                    tabIndex
                }
            }
        ));
    }

    _getLeftSideView ({ heading, body }) {
        return (
            <div className={bem.element('left')}>
                <img src={logoSvg}/>
                <h4>{heading}</h4>
                <p>{body}</p>
            </div>
        )
    }

    _mapButton ({ label, onClick }, btnIndex) {
        const { tabIndex = 0 } = this.state.inviteStart;

        return  (
            <div className={btnIndex === tabIndex ? 'selected' : ''}>
                <a onClick={onClick}>{label}</a>
            </div>
        );
    }

    _getAccountBackupView () {
        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this.accountCreateInfoProps)}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='No Backup, No Money'
                        body='You should save the Seed phrase. It is crucial for accessing your account in the future if you lose your password.'
                    >
                        <div className={bem.element('account-backup')}>
                            <Button
                                type='submit'
                                color='primary'
                                onClick={() => alert(1)}
                                label='Back up now'
                            />
                            <span>or</span>
                            <Button
                                type='submit'
                                color='primary'
                                onClick={() => alert(1)}
                                label='Do it later'
                                outline
                            />
                        </div>
                    </RightFormContainer>
                </div>
            </div>
        );
    }

    _getAccountNameView () {
        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this.accountCreateInfoProps)}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='Account name'
                        body='The account name will be known only to you'
                    >
                        <BaseInput
                            label='Enter account name'
                        />
                        <Button
                            type='submit'
                            color='primary'
                            onClick={() => alert(1)}
                            label='Continue'
                        />
                    </RightFormContainer>
                </div>
            </div>
        );
    }

    _getAccountAddressView () {
        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this.accountCreateInfoProps)}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='Account address'
                        body='This is the address of your newly generated wallet'
                    >
                        <div className={bem.element('account-address')}>
                            <BaseInput />
                            <CopyToClipboard>
                                <img src={copyToIcon}/>
                            </CopyToClipboard>
                            <Button
                                type='submit'
                                color='primary'
                                onClick={() => alert(1)}
                                label='Continue'
                            />
                        </div>
                    </RightFormContainer>
                </div>
            </div>
        );
    }

    _getAccountCreateView () {
        const bodyClassName = [
            bem.element('right'),
            bem.element('right_acc_create')
        ].join(' ');

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this.accountCreateInfoProps)}
                <div className={bodyClassName}>
                    <div className={bem.element('right_acc_create_child')}>
                        <h4>Protect your account</h4>
                        <span>Set a master password for all your accounts</span>
                        <BaseInput
                            label='Create a password'
                            warningText='Must be at least 8 characters'
                            icon={eyeIcon}
                            type='password'
                        />
                        <BaseInput
                            label='Confirm password'
                            icon={eyeIcon}
                            type='password'
                        />
                        <BaseCheckbox
                            label='I have read and agree with Terms  and Conditions & Privacy Policy.'
                        />
                        <Button
                            type='submit'
                            color='primary'
                            onClick={() => alert(1)}
                            label='Continue'
                        />
                    </div>
                </div>
            </div>
        );
    }

    _getInviteStartView () {
        const createWavesAccount = () => this._setTabIndex(0);
        const importWavesAccount = () => this._setTabIndex(1);
        const { _mapButton: mapButton } = this;

        const buttons = [
            { label: 'Create Waves account', onClick: createWavesAccount },
            { label: 'Import Waves account', onClick: importWavesAccount },
        ].map(mapButton);

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this.welcomeInfoProps)}
                <div className={`${bem.element('right')} centered`}>
                    <div className={bem.element('import-create')}>
                        <div>
                            {buttons}
                        </div>
                        <p>
                            If you do not own a Waves account yet, create it right now in a matter of minutes.
                        </p>
                        <Button
                            type='submit'
                            color='primary'
                            label='Create new account'
                        />
                    </div>
                </div>
            </div>
        );
    }

    _getView () {
        return this._getAccountBackupView();
    }

    render () {
        const { isVisible } = this.state;

        return (
            <div className={bem.element('root')}>
                <button onClick={this._triggerModal}>1</button>
                <BaseModal isVisible={isVisible}>
                    {this._getView()}
                </BaseModal>
            </div>
        )
    }
}

export default KeeperCreateModal;