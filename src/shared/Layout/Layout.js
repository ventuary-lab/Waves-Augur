import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _get from 'lodash-es/get';
import ModalWrapper from 'yii-steroids/ui/modal/ModalWrapper';
import layoutHoc, { STATUS_ACCESS_DENIED, STATUS_LOADING, STATUS_RENDER_ERROR } from 'yii-steroids/ui/layoutHoc';
import screenWatcherHoc from 'yii-steroids/ui/screenWatcherHoc';

import {html, dal, store, ws} from 'components';
import {apiWsHandler} from 'actions/api';
import Header from 'shared/Header';
import Footer from 'shared/Footer';
import coverStub from 'static/images/cover-stub.jpg';

import './Layout.scss';
import TransactionApproveModal from 'shared/TransactionApproveModal';
import KeeperCreateModal from 'shared/KeeperCreateModal';
import { openModal } from 'yii-steroids/actions/modal';
import ProfileWizardModal from 'modals/ProfileWizardModal';
import { getUser } from 'yii-steroids/reducers/auth';
import MessageModal from 'modals/MessageModal';
import UserRole from 'enums/UserRole';
import { getCurrentItemParam } from 'yii-steroids/reducers/navigation';
import ModalsContext, { initialContextState } from './context';

const bem = html.bem('Layout');

@layoutHoc(
    async () => {
        // TODO ws.wsUrl = process.env.APP_WS_URL || 'ws://localhost:5000';
        ws.wsUrl = location.port ? 'ws://localhost:5000' : location.origin.replace('http', 'ws');
        ws.onMessage = event => store.dispatch(apiWsHandler(event));
        ws.open();

        const response = await axios.get('/api/v1/init');
        const user = await dal.auth();

        return {
            ...response.data,
            user
        };
    }
)
@connect(
    state => ({
        isShowImageLine: getCurrentItemParam(state, 'isShowImageLine'),
        user: getUser(state),
        coverUrl: _get(state, 'layout.cover'),
        maxPhoneWidth: _get(state, 'screen.media.tablet'),
    })
)

@screenWatcherHoc()
export default class Layout extends React.PureComponent {
    constructor (props) {
        super(props);

        this.addConfirmationListener = this.addConfirmationListener.bind(this);
        this.getModalContextValue = this.getModalContextValue.bind(this);
        this._triggerNoKeeperModal = this._triggerNoKeeperModal.bind(this);
        this._triggerApproveModal = this._triggerApproveModal.bind(this);
        this._updateNestedState = this._updateNestedState.bind(this);

        this.state = {
            approveModalProps: {
                isVisible: false,
            },
            noKeeperModalProps: {
                isVisible: false,
                isInviteProvided: false
            }
        };
    }

    static propTypes = {
        status: PropTypes.string,
        user: PropTypes.object,
        isShowImageLine: PropTypes.bool,
    };

    addConfirmationListener () {
        dal.transport.noKeeper.onNodePublish = () => {
            this._updateNestedState('approveModalProps', { isVisible: true });
        };
    }

    async componentDidMount() {
        dal.voteReveralMonitor.start();

        this.addConfirmationListener();

        //not Phone
        if (window.innerWidth >= this.props.maxPhoneWidth) {
            //not installed keeper
            // const isKeeperInstalled = await dal.isKeeperInstalled();
            // if (!isKeeperInstalled) {
            // this.props.dispatch(openModal(MessageModal, {
            //     icon: 'Icon__waves-keeper',
            //     title: __('Install Waves Keeper'),
            //     color: 'success',
            //     description: __('You Need a WAVES Wallet to Join Us'),
            //     submitLabel: __('Install'),
            //     url: 'https://wavesplatform.com/products-keeper',
            // }));
            // no account
            // if (!_get(await dal.getAccount(), 'address')) {
            //     this.props.dispatch(openModal(MessageModal, {
            //         icon: 'Icon__keeper-no-account',
            //         title: __('Create your Waves wallet'),
            //         color: 'success',
            //         description: __('Click “Add account” in Waves Keeper extension in your browser'),
            //         submitLabel: __('Ok, I understand'),
            //     }));
            // }
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.status === STATUS_LOADING && nextProps.status !== STATUS_LOADING
            && nextProps.user && nextProps.user.role === UserRole.ANONYMOUS
        ) {
            //not Phone
            if (window.innerWidth >= this.props.maxPhoneWidth) {
                const invitation = await dal.resolveInvitation();

                if (invitation) {
                    this._updateNestedState('noKeeperModalProps', {
                        isVisible: true,
                        isInviteProvided: true
                    });
                    
                    // const isKeeperInstalled = await dal.isKeeperInstalled();
                    // if (isKeeperInstalled) {
                    //     this.props.dispatch(openModal(ProfileWizardModal, {
                    //         user: invitation.user,
                    //         hash2: invitation.hash2
                    //     }));
                    // } else {
                    //     this.setState({ 
                    //         noKeeperModalProps: {
                    //             isVisible: true,
                    //             isInviteProvided: true
                    //         }
                    //     });
                    // }
                }
            }
        }
    }

    _triggerApproveModal (isVisible) {
        this.setState(prevState => ({
            approveModalProps: {
                ...prevState.approveModalProps,
                isVisible
            }
        }));
    }

    _triggerNoKeeperModal (isVisible) {
        this.setState(prevState => ({
            noKeeperModalProps: {
                ...prevState.noKeeperModalProps,
                isVisible
            }
        }));
    }

    _updateNestedState (keyName, newState) {
        console.log({ keyName, newState });
        this.setState(prevState => ({ 
            [keyName]: {
                ...prevState[keyName],
                ...newState
            }
        }));
    }

    getModalContextValue () {
        const { 
            _triggerNoKeeperModal, 
            _triggerApproveModal,
            _updateNestedState
        } = this;

        return {
            approveModal: {
                ...initialContextState.approveModal,
                triggerModal: visible => _triggerApproveModal(visible),
                setState: state => _updateNestedState('approveModalProps', state)
            },
            noKeeperModal: {
                ...initialContextState.noKeeperModal,
                triggerModal: visible => _triggerNoKeeperModal(visible),
                setState: state => _updateNestedState('noKeeperModalProps', state)
            }
        };
    }

    render() {
        if (this.props.status === STATUS_RENDER_ERROR) {
            return null;
        }
        const {
            getModalContextValue,
            _triggerNoKeeperModal,
            _triggerApproveModal
        } = this;
        const {
            noKeeperModalProps,
            approveModalProps
        } = this.state;

        return (
            <div className={bem.block()}>
                <ModalsContext.Provider value={getModalContextValue()}>
                    <Header/>
                    <TransactionApproveModal {...approveModalProps} onModalTrigger={_triggerApproveModal}/>
                    <KeeperCreateModal {...noKeeperModalProps} onModalTrigger={_triggerNoKeeperModal}/>
                    <main className={bem.element('content')}>
                        {this.props.status === STATUS_ACCESS_DENIED && (
                            <div>
                                Access denied
                            </div>
                        ) || (
                            <>
                                {this.props.isShowImageLine && (
                                    <div
                                        className={bem.element('image-line')}
                                        style={{
                                            backgroundImage: `url(${this.props.coverUrl ? this.props.coverUrl : coverStub})`
                                        }}
                                    />
                                )}
                                {this.props.status !== STATUS_LOADING && this.props.children}
                            </>
                        )}
                    </main>
                    <Footer/>
                    <ModalWrapper/>
                </ModalsContext.Provider>
            </div>
        );
    }
}
