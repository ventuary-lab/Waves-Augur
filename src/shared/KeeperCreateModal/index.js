import React from 'react';
import { html } from 'components';
import BaseCheckbox from 'ui/form/BaseCheckbox';
import BaseModal from 'ui/modal/BaseModal';
import BaseInput from 'ui/form/BaseInput';
import CopyToClipboard from 'shared/CopyToClipboard';
import OutsideAlerter from 'ui/global/OutsideAlerter';
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

        this._closeModal = this._closeModal.bind(this);
        this._openModal = this._openModal.bind(this);
        this._setModalVisibility = this._setModalVisibility.bind(this);
        this._triggerModal = this._triggerModal.bind(this);
        this._setTabIndex = this._setTabIndex.bind(this);

        // View getters
        this._getInviteStartView = this._getInviteStartView.bind(this);
        this._getAccountAddressView = this._getAccountAddressView.bind(this);
        this._getAccountSavePhraseView = this._getAccountSavePhraseView.bind(this);
        this._getAccountNameView = this._getAccountNameView.bind(this);
        this._getSuccessfulAccountCreateView = this._getSuccessfulAccountCreateView.bind(this);
        this._getImportFromSeedView = this._getImportFromSeedView.bind(this);
        this._getLeftSideView = this._getLeftSideView.bind(this);
        this._getView = this._getView.bind(this);

        this._mapButton = this._mapButton.bind(this);

        this.welcomeInfoProps = {
            heading: 'Welcome to the DAO',
            body: `
                Congratulations, you have received an invitation from a DAO’s member.
                Now, we will guide you step-by-step as you register.
                To use our platform, you require a Waves account — let’s set it up first.
            `
        };

        this.accountCreateInfoProps = {
            ...this.welcomeInfoProps,
            heading: 'Create new Waves account'
        };

        this.importAccountInfoProps = {
            ...this.welcomeInfoProps,
            heading: 'Import an account via Seed'
        }

        this.state = {
            isVisible: true,
            inviteStart: {
                tabIndex: 0
            }
        };
    }

    _setModalVisibility (isVisible) {
        this.setState({ isVisible });
    }

    _closeModal () {
        this._setModalVisibility(false);
    }

    _openModal () {
        this._setModalVisibility(true);
    }

    _triggerModal () {
        const { isVisible } = this.state;
        this._setModalVisibility(!isVisible);
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

    _getImportFromSeedView () {
        
    }

    _getSuccessfulAccountCreateView () {
        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this.accountCreateInfoProps)}
                <div className={`${bem.element('right')} left-centered`}>
                    <RightFormContainer
                        heading='Waves account has been created!'
                        body='Now you need to  create your DAO profile'
                    >
                        <Button
                            type='submit'
                            color='primary'
                            label='Create new account'
                        />
                    </RightFormContainer>
                </div>
            </div>
        )
    }

    _getAccountSavePhraseView () {
        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this.accountCreateInfoProps)}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='Save backup phrase'
                        body='Since only you control your money, you’ll need to save your backup phrase in case this app is deleted or go back'
                    >
                        <div className={bem.element('account-save-phrase')}>
                            <span>
                                Copy your backup phrase and store it somewhere safe:
                            </span>
                            <BaseInput type='password'/>
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
        return this._getSuccessfulAccountCreateView();
    }

    render () {
        const { _closeModal } = this;
        const { isVisible } = this.state;

        return (
            <div className={bem.element('root')}>
                <button onClick={this._triggerModal}>1</button>
                <BaseModal isVisible={isVisible}>
                    <OutsideAlerter onOutsideClick={_closeModal}>
                        {this._getView()}
                    </OutsideAlerter>
                </BaseModal>
            </div>
        )
    };
}

export default KeeperCreateModal;