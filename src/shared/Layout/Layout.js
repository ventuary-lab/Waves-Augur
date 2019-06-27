import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ModalWrapper from 'yii-steroids/ui/modal/ModalWrapper';
import layoutHoc, {STATUS_LOADING} from 'yii-steroids/ui/layoutHoc';
import screenWatcherHoc from 'yii-steroids/ui/screenWatcherHoc';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';

import {html, dal} from 'components';
import {ROUTE_ROOT} from 'routes';
import Header from 'shared/Header';
import Footer from 'shared/Footer';

import './Layout.scss';
import {openModal} from 'yii-steroids/actions/modal';
import ProfileWizardModal from 'modals/ProfileWizardModal';
import {getUser} from 'yii-steroids/reducers/auth';
import MessageModal from 'modals/MessageModal';
import UserRole from 'enums/UserRole';

const bem = html.bem('Layout');

@layoutHoc(
    () => dal.auth()
        .then(user => ({
            user,
        }))
        .catch(e => console.error(e) || ({
            user: null,
        }))
)
@connect(
    state => ({
        routeId: getCurrentRoute(state).id,
        user: getUser(state),
    })
)
@screenWatcherHoc()
export default class Layout extends React.PureComponent {

    static propTypes = {
        status: PropTypes.string,
        user: PropTypes.object,
    };

    async componentDidMount() {
        if (!await dal.isKeeperInstalled()) {
            this.props.dispatch(openModal(MessageModal, {
                title: __('Install Waves Keeper'),
                description: __('You Need a WAVES Wallet to Join Us'),
                submitLabel: __('Install'),
                onSubmit: () => location.href = 'https://wavesplatform.com/products-keeper',
            }));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.status === STATUS_LOADING && nextProps.status !== STATUS_LOADING
            && nextProps.user && nextProps.user.role === UserRole.INVITED && nextProps.user.invitedBy
        ) {
            this.props.dispatch(openModal(ProfileWizardModal));
        }
    }

    render() {
        return (
            <div className={bem.block()}>
                <Header/>
                <main className={bem.element('content')}>
                    {this.props.routeId !== ROUTE_ROOT && (
                        <div className={bem.element('image-line')}/>
                    )}
                    {this.props.status !== STATUS_LOADING && this.props.children}
                </main>
                <Footer/>
                <ModalWrapper/>
            </div>
        );
    }
}
