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
import ProfileModal from 'modals/ProfileModal/ProfileModal';
import {getUser} from 'yii-steroids/reducers/auth';

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

    componentWillReceiveProps(nextProps) {
        if (this.props.status === STATUS_LOADING && nextProps.status !== STATUS_LOADING
            && (!nextProps.user || !nextProps.user.bio)
        ) {
            this.props.dispatch(openModal(ProfileModal));
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
                    {this.props.children}
                </main>
                <Footer/>
                <ModalWrapper/>
            </div>
        );
    }
}
