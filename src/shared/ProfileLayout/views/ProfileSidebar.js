import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import { openModal } from 'yii-steroids/actions/modal';

import { html, dal } from 'components';
import Hint from 'shared/Hint';
import SocialLinks from 'shared/SocialLinks';
import Tags from 'shared/Tags';
import { isPhone } from 'yii-steroids/reducers/screen';
import Button from 'yii-steroids/ui/form/Button';
import CopyToClipboard from 'shared/CopyToClipboard';
import userAvatarStub from 'static/images/user-avatar-stub.png';
import whaleAvatarStub from 'static/images/whale-avatar-stub.png';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';
import UserSchema from 'types/UserSchema';
import ProfileWizardModal from 'modals/ProfileWizardModal';
import UserRole from 'enums/UserRole';
import BaseTransferModal from 'modals/BaseTransferModal';
import { ReduxModalContext } from 'shared/Layout/context';

import { ROUTE_USER_DONATION, ROUTE_USER_GRANTS } from 'routes';
import './ProfileSidebar.scss';
import MessageModal from '../../../modals/MessageModal';

const bem = html.bem('ProfileSidebar');

@connect(state => ({
    isPhone: isPhone(state),
}))
export default class ProfileSidebar extends React.PureComponent {

    static propTypes = {
        isMe: PropTypes.bool,
        user: UserSchema,
    };

    constructor(props) {
        super(props);

        this._triggerSendFundsModal = this._triggerSendFundsModal.bind(this);
        this._getBalance = this._getBalance.bind(this);
        this._updateBalance = this._updateBalance.bind(this);
        this._handleWidthdraw = this._handleWidthdraw.bind(this);

        this.state = {
            sendFundsModal: {
                isOpened: false
            },
            internalBalance: 0
        };

        this.invoiceProps = {
            heading: 'Creating Invoice',
            initialView: 0,
            approveButton: {
                label: 'Create'
            }
        };
        this.transferProps = {
            heading: 'Transferring funds to a user',
            initialView: 0,
            approveButton: {
                label: 'Transfer'
            }
        };
    }

    async _getBalance () {
        const { address } = this.props.user;
        const balance = await dal.getIntenalDaoBalance(address) / 100000000;
        return balance;
    }

    async componentWillReceiveProps () {
        this._updateBalance();
    }

    async _updateBalance () {
        const internalBalance = await this._getBalance();
        this.setState({ internalBalance });
    }

    async componentDidMount () {
        await this._updateBalance();
    }

    _triggerSendFundsModal (isOpened) {
        this.setState(prevState => ({
            ...prevState,
            sendFundsModal: {
                ...prevState.sendFundsModal,
                isOpened
            }
        }));
    }

    async _handleWidthdraw () {
        const { address } = this.props.user;

        try {
            await dal.withdrawInternalBalance(address);
            await this._updateBalance();
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const avatarStub = this.props.user.profile.isWhale
            ? whaleAvatarStub
            : this.props.user.role === UserRole.REGISTERED ? userAvatarStub : anonymousAvatarStub;
        const { internalBalance, sendFundsModal } = this.state;
        const { isOpened } = sendFundsModal;
        const { invoiceProps, transferProps } = this;
        const { isPhone } = this.props;

        return (
            <div className={bem.block()}>
                {isOpened && ReactDOM.createPortal(
                    <BaseTransferModal
                        user={this.props.user}
                        onClose={() => this._triggerSendFundsModal(false)} 
                        isOpened={isOpened}
                        isInvoice={this.props.isMe}
                        modalProps={this.props.isMe ? invoiceProps : transferProps}
                    />,
                    document.body
                )}
                <img
                    className={bem.element('avatar')}
                    src={_.get(this.props, 'user.profile.avatar', avatarStub)}
                    alt={_.get(this.props, 'user.profile.name', '')}
                />
                {this.props.isMe && (
                    <div className={bem.element('you')}>
                        {__('You')}
                    </div>
                )}
                <div className={bem.element('inner')}>
                    <span className={bem.element('name')}>
                        {this.props.user.profile.name}
                    </span>
                    <span className={bem.element('description')}>
                        {[UserRole.ANONYMOUS, UserRole.INVITED].includes(this.props.user.role)
                            ? this.props.user.address
                            : this.props.user.profile.title
                        }
                    </span>
                    {!isPhone && (
                        <div className={bem.element('send-funds')}>
                            <Button
                                outline
                                color='primary'
                                label={!this.props.isMe ? 'Send funds' : 'Create an invoice'}
                                onClick={() => this._triggerSendFundsModal(true)}
                            />
                        </div>
                    )}
                    {this.props.user.profile.socials && (
                        <div className={bem.element('social-links')}>
                            <SocialLinks urls={this.props.user.profile.socials}/>
                        </div>
                    )}
                    {this.props.user.activity && (
                        <div className={bem.element('activity')}>
                            <span>{__('Activity')}:</span>
                            <span>
                                {this.props.user.activity}
                            </span>
                        </div>
                    )}
                    {this.props.user.profile.location && (
                        <div className={bem.element('country')}>
                            <span className={'MaterialIcon'}>location_on</span>
                            &nbsp;
                            <span>{this.props.user.profile.location}</span>
                        </div>
                    )}
                    {this.props.user.invitedBy && this.props.user.invitedBy.profile.name && (
                        <div className={bem.element('invited-by')}>
                            <span>{__('Invited by')}</span>
                            &nbsp;
                            <Link
                                toRoute={this.props.user.invitedBy.role === UserRole.WHALE ? ROUTE_USER_GRANTS : ROUTE_USER_DONATION}
                                toRouteParams={{
                                    address: this.props.user.invitedBy.address,
                                }}
                                noStyles
                            >
                                {this.props.user.invitedBy.profile.name}
                            </Link>
                        </div>
                    )}
                    {this.props.user.profile.tags && this.props.user.profile.tags.length > 0 && (
                        <div className={bem.element('tags')}>
                            <Tags
                                items={this.props.user.profile.tags}
                            />
                        </div>
                    )}
                    {this.props.isMe && (
                        <>
                            <div className={bem.element('balance')}>
                                <span>{__('DAO Balance')}: </span>
                                <span>
                                    {internalBalance} 🔹
                                </span>
                                <Hint text='This is your funds on DAO dApp.  You can withdraw it on your  Waves Keeper account at any time.'/>
                            </div>
                            <div className={bem.element('withdraw-btn')}>
                                <Button
                                    color='primary'
                                    label='Withdraw'
                                    onClick={() => this._handleWidthdraw()}
                                />
                            </div>
                            <ReduxModalContext.Consumer>
                                {({ openLoginModal }) => (
                                    ![UserRole.ANONYMOUS, UserRole.INVITED].includes(this.props.user.role) && (
                                        <Link
                                            className={bem.element('edit')}
                                            onClick={() => {
                                                if (this.props.isPhone) {
                                                    openLoginModal();
                                                } else {
                                                    this.props.dispatch(openModal(ProfileWizardModal));
                                                }
                                            }}
                                            noStyles
                                        >
                                            <svg className={bem.element('edit-icon')} width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M13.7725 3.14373C14.0758 2.84044 14.0758 2.33495 13.7725 2.04722L11.9528 0.227468C11.665 -0.0758228 11.1596 -0.0758228 10.8563 0.227468L9.42536 1.6506L12.3416 4.56687L13.7725 3.14373ZM0 11.0837V14H2.91626L11.5173 5.3912L8.60103 2.47493L0 11.0837Z' />
                                            </svg>
                                            {__('Edit profile')}
                                        </Link>
                                    )
                                )}
                            </ReduxModalContext.Consumer>
                            <CopyToClipboard copyText={`${location.origin}/users/${this.props.user.address}`}>
                                <button className={bem.element('share-link')}>{__('Share Profile')}</button>
                            </CopyToClipboard>
                        </>
                    )}
                </div>
            </div>
        );
    }
}
