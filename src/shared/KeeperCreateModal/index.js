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

const bem = html.bem('KeeperCreateModal');

import './index.scss';

function RightFormContainer ({ heading, body, children }) {

    return (
        <div className={bem.element('right-form-container')}>
            <h4>{heading}</h4>
            <p>{body}</p>
            {children}
        </div>
    );
}

const NO_INVITE_START_VIEW = 'noInviteStartView';
const INVITE_START_VIEW = 'inviteStartView';
const ACCOUNT_CREATE_VIEW = 'accountCreateView';
const ACCOUNT_ADDRESS_VIEW = 'accountAddressView';
const ACCOUNT_SAVE_PHRASE_VIEW = 'accountSavePhraseView';
const ACCOUNT_NAME_VIEW = 'accountNameView';
const ACCOUNT_CREATED_VIEW = 'accountCreatedView';
const ACCOUNT_BACKUP_VIEW = 'accountBackupView';
const IMPORT_FROM_SEED_VIEW = 'importFromSeedView';

class KeeperCreateModal extends React.Component {
    constructor(props) {
        super(props);

        this._closeModal = this._closeModal.bind(this);
        this._openModal = this._openModal.bind(this);
        this._setModalVisibility = this._setModalVisibility.bind(this);
        this._triggerModal = this._triggerModal.bind(this);
        this._setTabIndex = this._setTabIndex.bind(this);
        this._checkIsImportView = this._checkIsImportView.bind(this);

        // Common methods
        this._onCreateNewAccount = this._onCreateNewAccount.bind(this);
        this._isPassValid = this._isPassValid.bind(this);
        this._getInitialState = this._getInitialState.bind(this);
        this._updateFormState = this._updateFormState.bind(this);

        this._getCurrentViewInfoProps = this._getCurrentViewInfoProps.bind(this);

        // View getters
        this._getInviteStartView = this._getInviteStartView.bind(this);
        this._getAccountAddressView = this._getAccountAddressView.bind(this);
        this._getAccountSavePhraseView = this._getAccountSavePhraseView.bind(this);
        this._getAccountNameView = this._getAccountNameView.bind(this);
        this._getSuccessfulAccountCreateView = this._getSuccessfulAccountCreateView.bind(this);
        this._getImportFromSeedView = this._getImportFromSeedView.bind(this);
        this._getAccountCreateView = this._getAccountCreateView.bind(this);
        this._getAccountBackupView = this._getAccountBackupView.bind(this);
        this._getNoInviteStartView = this._getNoInviteStartView.bind(this);
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

        this.inviteProvided = false;

        this.daoAccount = null;
        this.seedInstance = null;

        this.accountCreateInfoProps = {
            ...this.welcomeInfoProps,
            heading: 'Create new Waves account'
        };

        this.importAccountInfoProps = {
            ...this.welcomeInfoProps,
            heading: 'Import an account via Seed'
        };

        this.state = {
            ...this._getInitialState()
        };
    }

    _getInitialState () {
        const currentViewName = this.inviteProvided ? INVITE_START_VIEW : NO_INVITE_START_VIEW;

        return {
            currentViewName,
            isVisible: true,
            inviteStart: {
                tabIndex: 0
            },
            formState: {
                policyApproved: false,
                password: null,
                passwordConfirm: null,
                accAddress: null,
                accountName: '',
                seedPhrase: '',
            }
        };
    }

    _isPassValid () {
        const { password, passwordConfirm } = this.state.formState;

        return password && passwordConfirm && passwordConfirm === password;
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

    _getCurrentViewInfoProps () {
        const { tabIndex } = this.state.inviteStart;

        switch (tabIndex) {
            case 0:
                return this.accountCreateInfoProps;
            case 1:
                return this.importAccountInfoProps;
        };
    }

    _checkIsImportView () {
        try {
            return this.state.inviteStart.tabIndex === 1;
        } catch (err) {
            return false;
        }
    }

    _getLeftSideView ({ heading, body }) {
        const smallHint = (
            <div className={bem.element('left-side-hint')}>
                <span>You can also:</span>
                <a href='#'>
                    <span>Import accounts via seed</span>
                </a>
                <a href='#'>
                    <span>Import accounts from Keeper</span>
                </a>
            </div>
        );

        return (
            <div className={bem.element('left')}>
                <img src={logoSvg}/>
                <h4>{heading}</h4>
                <p>{body}</p>
                {smallHint}
            </div>
        );
    }

    _mapButton ({ label, onClick }, btnIndex) {
        const { tabIndex = 0 } = this.state.inviteStart;

        return  (
            <div className={btnIndex === tabIndex ? 'selected' : ''}>
                <a onClick={onClick}>{label}</a>
            </div>
        );
    }

    _getNoInviteStartView () {
        const onImport = () => {
            this.setState({ inviteStart: { tabIndex: 1 }, currentViewName: ACCOUNT_CREATE_VIEW });
        };

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this._getCurrentViewInfoProps())}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='Import Waves account'
                        body='If you already own a Waves wallet, click the button below to import it or connect it with the platform.'
                    >
                        <div className={bem.element('account-backup')}>
                            <Button
                                type='submit'
                                color='primary'
                                label='Import account via SEED phrase'
                                onClick={onImport}
                            />
                            <span>or</span>
                            <Button
                                type='submit'
                                color='primary'
                                label='Use Waves Keeper'
                                onClick={() => window.open('https://wavesplatform.com/technology/keeper')}
                                outline
                            />
                        </div>
                    </RightFormContainer>
                </div>
            </div>
        )
    }

    _getImportFromSeedView () {
        const { accAddress } = this.state.formState;

        const onContinue = () => {
            if (accAddress) {
                this.setState({ currentViewName: ACCOUNT_NAME_VIEW });
            }
        };
        const onChangeSeed = (e) => {
            const value = e.target.value;

            if (!value) {
                this._updateFormState({ 
                    seedPhrase: null,
                    accAddress: null
                });
                return;
            }

            try {
                const seed = seedUtils.Seed.fromExistingPhrase(value);

                this._updateFormState({ 
                    seedPhrase: seed.phrase,
                    accAddress: seed.address
                });
            } catch (err) {
                console.log({ err });
            }
        };

        const walletWarning = (
            <div className={bem.element('wallet-warning')}>
                <p>
                    Make sure that your Waves Wallet‘s balance is equal to at least 0.01 WAVES — 
                    you will need to spend a 0.009 fee to register your profile on the blockchain
                </p>
                <div>
                    <Button
                        type='submit'
                        color='primary'
                        label='Learn how to fund your Waves wallet'
                        outline
                    />
                    <Button
                        type='submit'
                        color='primary'
                        label='Fund your wallet'
                    />
                </div>
            </div>
        )

        return (
            <div className={bem.element('base-view')} style={{ maxHeight: 604 }}>
                {this._getLeftSideView(this._getCurrentViewInfoProps())}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='Import from seed'
                        body='Enter your Seed phrase or to access your wallet'
                    >
                        <BaseInput
                            asTextArea
                            onChange={onChangeSeed}
                            label='Seed phrase'
                            placeholder='Your seed is 15 words you saved when creating your account'
                        />
                        {accAddress && (
                            <div className={bem.element('success-alert')}>
                                <span>Address</span>
                                <span>{accAddress}</span>
                            </div>
                        )}
                        {!this.inviteProvided && walletWarning}
                        <Button
                            type='submit'
                            color='primary'
                            label='Continue'
                            onClick={onContinue}
                        />
                    </RightFormContainer>
                </div>
            </div>
        )
    }

    _getSuccessfulAccountCreateView () {
        const onCreate = async () => {
            this.daoAccount = await dal.constructAccountInstance(this.state.formState.accountName, this.seedInstance);

            window.localStorage.setItem('dao_account', JSON.stringify({ ...this.daoAccount, seed: this.seedInstance.phrase }));

            this.setState(this._getInitialState());
            this._closeModal();

            store.dispatch(openModal(ProfileWizardModal));
        };
        const buttonProps = {
            label: this.inviteProvided ? 'Create DAO profile' : 'Ask for an invitation link',
            onClick: onCreate,
        };

        const rightFormProps = {
            heading: this._checkIsImportView() ? 'Waves account has been imported!' : 'Waves account has been created!',
            body: this.inviteProvided ? 'Now you need to create your DAO profile' : 'Now you need to ask for an invitation link'
        };

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this._getCurrentViewInfoProps())}
                <div className={`${bem.element('right')} left-centered`}>
                    <RightFormContainer {...rightFormProps}>
                        <Button
                            type='submit'
                            color='primary'
                            {...buttonProps}
                        />
                    </RightFormContainer>
                </div>
            </div>
        );
    }

    _getAccountSavePhraseView () {
        const { seedPhrase } = this.state.formState;
        const onContinue = () => this.setState({ currentViewName: ACCOUNT_CREATED_VIEW });

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this._getCurrentViewInfoProps())}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='Save backup phrase'
                        body='Since only you control your money, you’ll need to save your backup phrase in case this app is deleted or go back'
                    >
                        <div className={bem.element('account-save-phrase')}>
                            <span>
                                Copy your backup phrase and store it somewhere safe:
                            </span>
                            <BaseInput type='password' value={seedPhrase}/>
                            <CopyToClipboard message='Copied!' copyText={seedPhrase}>
                                <img src={copyToIcon} />
                            </CopyToClipboard>
                            <Button
                                type='submit'
                                color='primary'
                                onClick={onContinue}
                                label='Continue'
                            />
                        </div>
                    </RightFormContainer>
                </div>
            </div>
        );
    }

    _getAccountBackupView () {
        const onBackupNow = () => this.setState({ currentViewName: ACCOUNT_SAVE_PHRASE_VIEW });
        const onDoItLater = () => this.setState({ currentViewName: ACCOUNT_CREATED_VIEW });

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this._getCurrentViewInfoProps())}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='No Backup, No Money'
                        body='You should save the Seed phrase. It is crucial for accessing your account in the future if you lose your password.'
                    >
                        <div className={bem.element('account-backup')}>
                            <Button
                                type='submit'
                                color='primary'
                                onClick={onBackupNow}
                                label='Back up now'
                            />
                            <span>or</span>
                            <Button
                                type='submit'
                                color='primary'
                                onClick={onDoItLater}
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
        const onContinue = () => this.setState({ 
            currentViewName: this._checkIsImportView() ? ACCOUNT_CREATED_VIEW : ACCOUNT_BACKUP_VIEW
        });
        const onAccountNameChange = (e) => {
            this._updateFormState({ accountName: e.target.value })
        };

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this._getCurrentViewInfoProps())}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='Account name'
                        body='The account name will be known only to you'
                    >
                        <BaseInput
                            onChange={onAccountNameChange}
                            label='Enter account name'
                        />
                        <Button
                            type='submit'
                            color='primary'
                            onClick={onContinue}
                            label='Continue'
                        />
                    </RightFormContainer>
                </div>
            </div>
        );
    }

    _getAccountAddressView () {
        const { accAddress } = this.state.formState;
        const onContinue = () => this.setState({ currentViewName: ACCOUNT_NAME_VIEW });

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this._getCurrentViewInfoProps())}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='Account address'
                        body='This is the address of your newly generated wallet'
                    >
                        <div className={bem.element('account-address')}>
                            <BaseInput value={accAddress || ''}/>
                            <CopyToClipboard 
                                copyText={accAddress || ''}
                                message='Address copied!'
                            >
                                <img src={copyToIcon}/>
                            </CopyToClipboard>
                            <Button
                                type='submit'
                                color='primary'
                                onClick={onContinue}
                                label='Continue'
                            />
                        </div>
                    </RightFormContainer>
                </div>
            </div>
        );
    }

    _updateFormState (updatedForm) {
        this.setState(prevState => (
            {
                ...prevState,
                formState: {
                    ...prevState.formState,
                    ...updatedForm
                }
            }
        ));
    }

    _getAccountCreateView () {
        const bodyClassName = [
            bem.element('right'),
            bem.element('right_acc_create')
        ].join(' ');
        const { policyApproved, password } = this.state.formState;
        const triggerCheckbox = () => this._updateFormState({ policyApproved: !policyApproved });

        const onContinue = async () => {
            if (!this._isPassValid() || !policyApproved || password.length < 8) {
                return;
            };

            const isImportView = this._checkIsImportView();
            const chainId = dal.isTestMode() === 'main' ? 'W' : 'T';
            const words = seedUtils.generateNewSeed(16);
            this.seedInstance = new seedUtils.Seed(words, chainId);

            if (!isImportView) {
                this._updateFormState({ accAddress: this.seedInstance.address, seedPhrase: words });
            }

            this.setState({
                currentViewName: isImportView ? IMPORT_FROM_SEED_VIEW : ACCOUNT_ADDRESS_VIEW
            });
        };

        const onPasswordChange = (event) => {
            this._updateFormState({ password: event.target.value })
        };
        const onPasswordChangeConfirm = (event) => {
            this._updateFormState({ passwordConfirm: event.target.value });
        };

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this._getCurrentViewInfoProps())}
                <div className={bodyClassName}>
                    <div className={bem.element('right_acc_create_child')}>
                        <h4>Protect your account</h4>
                        <span>Set a master password for all your accounts</span>
                        <BaseInput
                            label='Create a password'
                            warningText='Must be at least 8 characters'
                            icon={eyeIcon}
                            type='password'
                            onChange={onPasswordChange}
                        />
                        <BaseInput
                            label='Confirm password'
                            icon={eyeIcon}
                            type='password'
                            onChange={onPasswordChangeConfirm}
                        />
                        <BaseCheckbox
                            value={policyApproved}
                            onChange={triggerCheckbox}
                            label='I have read and agree with Terms and Conditions & Privacy Policy.'
                        />
                        <Button
                            type='submit'
                            color='primary'
                            onClick={onContinue}
                            label='Continue'
                        />
                    </div>
                </div>
            </div>
        );
    }

    _onCreateNewAccount () {
        const { tabIndex } = this.state.inviteStart;

        switch (tabIndex) {
            case 0:
                this.setState({ currentViewName: ACCOUNT_CREATE_VIEW });
                break;
            case 1:
                this.setState({ currentViewName: ACCOUNT_CREATE_VIEW });
                break;
        }
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
                            onClick={this._onCreateNewAccount}
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
        const { currentViewName } = this.state;

        switch (currentViewName) {
            case INVITE_START_VIEW:
                return this._getInviteStartView();
            case ACCOUNT_ADDRESS_VIEW:
                return this._getAccountAddressView();
            case ACCOUNT_SAVE_PHRASE_VIEW:
                return this._getAccountSavePhraseView();
            case ACCOUNT_NAME_VIEW:
                return this._getAccountNameView();
            case ACCOUNT_CREATED_VIEW:
                return this._getSuccessfulAccountCreateView();
            case IMPORT_FROM_SEED_VIEW:
                return this._getImportFromSeedView();
            case ACCOUNT_CREATE_VIEW:
                return this._getAccountCreateView();
            case ACCOUNT_BACKUP_VIEW:
                return this._getAccountBackupView();
            case NO_INVITE_START_VIEW:
                return this._getNoInviteStartView();
        };

        return null;
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
    };
}

export default KeeperCreateModal;