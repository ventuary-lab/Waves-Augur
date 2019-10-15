import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { html, dal, store, keeperHandler } from 'components';
import { seedUtils } from '@waves/waves-transactions';
import { setUser } from 'yii-steroids/actions/auth';

import { LOG_IN_USER } from 'actions/global';
import Button from 'yii-steroids/ui/form/Button';
import BaseCheckbox from 'ui/form/BaseCheckbox';
import BaseModal from 'ui/modal/BaseModal';
import { openModal } from 'yii-steroids/actions/modal';
import BaseInput from 'ui/form/BaseInput';
// import ProfileWizardModal from 'modals/ProfileWizardModal';
import CopyToClipboard from 'shared/CopyToClipboard';
import OutsideAlerter from 'ui/global/OutsideAlerter';
import MessageModal from 'modals/MessageModal';

import loginWithKeeperIcon from 'static/icons/login-waves-keeper.svg';
import eyeIcon from '!svg-inline-loader?classPrefix!static/icons/input/eye.svg';
import copyToIcon from 'static/icons/button/copy.svg';
import logoSvg from 'static/icons/dao-logo-white.svg';

import LoggedInEnum from 'enums/LoggedInEnum';

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

export default function KeeperCreateModal (props) {
    const { isVisible } = props;

    return isVisible ? <Wrapped {...props}/> : null;
}

class Wrapped extends React.Component {
    static propTypes = {
        onModalTrigger: PropTypes.function,
        isInviteProvided: PropTypes.oneOf([PropTypes.boolean, PropTypes.undefined])
    }

    constructor(props) {
        super(props);

        this._closeModal = this._closeModal.bind(this);
        this._openModal = this._openModal.bind(this);
        this._setModalVisibility = this._setModalVisibility.bind(this);
        this._triggerModal = this._triggerModal.bind(this);
        this._setTabIndex = this._setTabIndex.bind(this);
        this._checkIsImportView = this._checkIsImportView.bind(this);
        this._formValidate = this._formValidate.bind(this);
        this._onSubmit = this._onSubmit.bind(this);

        // Common methods
        this._onCreateNewAccount = this._onCreateNewAccount.bind(this);
        this._isPassValid = this._isPassValid.bind(this);
        this._getInitialState = this._getInitialState.bind(this);
        this._onLoginWithKeeper = this._onLoginWithKeeper.bind(this);

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


        this.inviteProvided = true;

        this.chainId = dal.isTestMode() ? 'T' : 'W';

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
                password: '',
                passwordConfirm: '',
                accAddress: '',
                accountName: '',
                seedPhrase: '',
            }
        };
    }

    _isPassValid (password, passwordConfirm) {
        return password && passwordConfirm && passwordConfirm === password;
    }

    _setModalVisibility (isVisible) {
        this.setState({ isVisible });

        if (this.props.onModalTrigger) {
            this.props.onModalTrigger(isVisible);
        }
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

    async _onLoginWithKeeper () {
        // dal.transport.noKeeper.loginType = LoggedInEnum.LOGGED_BY_KEEPER;
        const user = await dal.auth();

        if (user && user.role) {
            store.dispatch({ type: LOG_IN_USER });
            store.dispatch(setUser(user));
        } else {
            // store.dispatch(openModal(MessageModal, {
            //     icon: 'Icon__waves-keeper',
            //     title: __('Install Waves Keeper'),
            //     color: 'success',
            //     description: __('You Need a WAVES Wallet to Join Us'),
            //     submitLabel: __('Install'),
            //     url: 'https://wavesplatform.com/products-keeper',
            // }));
        }

        this._closeModal();
    }

    _getLeftSideView ({ heading, body }) {
        const { _onLoginWithKeeper } = this;

        const smallHint = (
            <div className={bem.element('left-side-hint')}>
                <span>You can also:</span>
                <a href='#'>
                    <span>Import accounts via seed</span>
                </a>
                <span>or login with:</span>
                <a href='#' className='keeper' onClick={_onLoginWithKeeper}>
                    <img src={loginWithKeeperIcon}/>
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
        );
    }

    _getImportFromSeedView (props) {
        const { values, setFieldValue, errors, isValid } = props;

        const onContinue = () => {
            this.seedInstance = new seedUtils.Seed(values.seedPhrase, this.chainId);

            this.setState({ currentViewName: ACCOUNT_NAME_VIEW });
        };

        const onChangeSeed = (e) => {
            const value = e.target.value;

            try {
                if (!value) {
                    throw new Error();
                }

                const seed = new seedUtils.Seed(value.trim(), this.chainId);

                setFieldValue('seedPhrase', seed.phrase, true);
                setFieldValue('accAddress', seed.address, true);
                // eslint-disable-next-line no-empty
            } catch (err) {
                setFieldValue('accAddress', '', true);
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
                            name='seedPhrase'
                            placeholder='Your seed is 15 words you saved when creating your account'
                            errorText={errors.seedPhrase}
                        />
                        {values.accAddress && (
                            <div className={bem.element('success-alert')}>
                                <span>Address</span>
                                <span>{values.accAddress}</span>
                            </div>
                        )}
                        {!this.inviteProvided && walletWarning}
                        <Button
                            type='submit'
                            color='primary'
                            label='Continue'
                            disabled={!isValid || !values.accAddress}
                            onClick={onContinue}
                        />
                    </RightFormContainer>
                </div>
            </div>
        );
    }

    _getSuccessfulAccountCreateView (props) {
        const { values } = props;

        const onCreate = async () => {
            this.daoAccount = await dal.constructAccountInstance(values, this.seedInstance);

            const { password } = values;

            const { encrypted } = await keeperHandler.getEncryptedPass(password, this.seedInstance.phrase);

            window.localStorage.setItem('dao_account', JSON.stringify({
                ...this.daoAccount,
                seed: encrypted,
                loginType: LoggedInEnum.LOGGED_BY_NO_KEEPER
            }));

            store.dispatch({ type: LOG_IN_USER });

            const user = await dal.auth();

            store.dispatch(setUser(user));

            this.setState(this._getInitialState());
            this._closeModal();
        };
        const buttonProps = {
            label: this.inviteProvided ? 'Create DAO profile' : 'Ask for an invitation link',
            onClick:  this.inviteProvided ? onCreate : () => {},
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

    _getAccountSavePhraseView (props) {
        const { values } = props;
        const onContinue = () => {
            this.setState({ currentViewName: ACCOUNT_CREATED_VIEW });
        };

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
                            <BaseInput type='password' value={values.seedPhrase}/>
                            <CopyToClipboard message='Copied!' copyText={values.seedPhrase}>
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

    _getAccountNameView (props) {
        const { handleChange, isValid, errors, values } = props;
        const onContinue = () => (
            this.setState({
                currentViewName: this._checkIsImportView() ? ACCOUNT_CREATED_VIEW : ACCOUNT_BACKUP_VIEW
            })
        );

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView(this._getCurrentViewInfoProps())}
                <div className={bem.element('right')}>
                    <RightFormContainer
                        heading='Account name'
                        body='The account name will be known only to you'
                    >
                        <BaseInput
                            onChange={handleChange}
                            name='accountName'
                            label='Enter account name'
                            errorText={errors.accountName}
                        />
                        <Button
                            type='submit'
                            color='primary'
                            disabled={!isValid || !values.accountName}
                            onClick={onContinue}
                            label='Continue'
                        />
                    </RightFormContainer>
                </div>
            </div>
        );
    }

    _getAccountAddressView (props) {
        const { values } = props;
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
                            <BaseInput value={values.accAddress || ''}/>
                            <CopyToClipboard 
                                copyText={values.accAddress || ''}
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

    _getAccountCreateView (props) {
        const bodyClassName = [
            bem.element('right'),
            bem.element('right_acc_create')
        ].join(' ');

        const { values, handleChange, errors, validateForm, isValid, setFieldValue } = props;

        const onContinue = async () => {
            await validateForm();

            const isImportView = this._checkIsImportView();
            const words = String(seedUtils.generateNewSeed(16)).trim();

            this.seedInstance = new seedUtils.Seed(words, this.chainId);

            if (!isImportView) {
                
                setFieldValue('accAddress', this.seedInstance.address, true);
                setFieldValue('seedPhrase', words, true);
            }

            this.setState({
                currentViewName: isImportView ? IMPORT_FROM_SEED_VIEW : ACCOUNT_ADDRESS_VIEW
            });
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
                            value={values.password}
                            type='password'
                            name='password'
                            onChange={handleChange}
                            errorText={errors.password}
                        />
                        <BaseInput
                            label='Confirm password'
                            icon={eyeIcon}
                            value={values.passwordConfirm}
                            type='password'
                            name='passwordConfirm'
                            onChange={handleChange}
                            errorText={errors.passwordConfirm}
                        />
                        <BaseCheckbox
                            value={values.policyApproved}
                            onChange={handleChange}
                            name='policyApproved'
                            label='I have read and agree with Terms and Conditions & Privacy Policy.'
                            errorText={errors.policyApproved}
                        />
                        <Button
                            type='submit'
                            color='primary'
                            disabled={!isValid}
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

        const { tabIndex } = this.state.inviteStart;
        const btnLabel = tabIndex === 0 ? 'Create new account' : 'Import Waves account';

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
                            label={btnLabel}
                        />
                    </div>
                </div>
            </div>
        );
    }

    _getView (props) {
        const { currentViewName } = this.state;

        switch (currentViewName) {
            case INVITE_START_VIEW:
                return this._getInviteStartView(props);
            case ACCOUNT_ADDRESS_VIEW:
                return this._getAccountAddressView(props);
            case ACCOUNT_SAVE_PHRASE_VIEW:
                return this._getAccountSavePhraseView(props);
            case ACCOUNT_NAME_VIEW:
                return this._getAccountNameView(props);
            case ACCOUNT_CREATED_VIEW:
                return this._getSuccessfulAccountCreateView(props);
            case IMPORT_FROM_SEED_VIEW:
                return this._getImportFromSeedView(props);
            case ACCOUNT_CREATE_VIEW:
                return this._getAccountCreateView(props);
            case ACCOUNT_BACKUP_VIEW:
                return this._getAccountBackupView(props);
            case NO_INVITE_START_VIEW:
                return this._getNoInviteStartView(props);
        };

        return null;
    }

    _onSubmit () {}

    _formValidate (values) {
        const errors = {};
        const { currentViewName } = this.state;

        if (currentViewName === ACCOUNT_CREATE_VIEW) {
            if (!values.password || !values.passwordConfirm) {
                errors.password = 'Password is mandatory';
            }
            if (values.password.length < 8) {
                errors.password = 'Min pass length is 8';
            }
            if (values.password !== values.passwordConfirm) {
                errors.password = 'Passwords should be equal';
            }
            if (!values.policyApproved) {
                errors.policyApproved = 'Approve is mandatory';
            }
        }

        if (!values.accountName && currentViewName === ACCOUNT_NAME_VIEW) {
            errors.accountName = 'Account name is mandatory';
        }
        if ((!values.seedPhrase || !values.accAddress) && currentViewName === IMPORT_FROM_SEED_VIEW) {
            errors.seedPhrase = 'Enter valid seed';
        }

        return errors;
    }

    render () {
        const { _closeModal } = this;
        const { isVisible } = this.state;
        const formProps = {
            onSubmit: this._onSubmit,
            validate: this._formValidate,
            initialValues: this._getInitialState().formState,
            render: props => this._getView(props)
        };

        return (
            <div className={bem.element('root')}>
                <BaseModal isVisible={isVisible}>
                    <OutsideAlerter onOutsideClick={_closeModal}>
                        <Formik {...formProps} />
                    </OutsideAlerter>
                </BaseModal>
            </div>
        );
    };
};