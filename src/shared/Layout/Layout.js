import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ModalWrapper from 'yii-steroids/ui/modal/ModalWrapper';
import layoutHoc from 'yii-steroids/ui/layoutHoc';
import screenWatcherHoc from 'yii-steroids/ui/screenWatcherHoc';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';

import {html, dal} from 'components';
import {ROUTE_ROOT} from 'routes';
import Header from 'shared/Header';
import Footer from 'shared/Footer';

import './Layout.scss';

const bem = html.bem('Layout');

@layoutHoc(
    () => dal.auth()
        .then(user => ({
            user,
        }))
        .catch(() => ({
            user: null,
        }))
)
@connect(
    state => ({
        routeId: getCurrentRoute(state).id,
    })
)
@screenWatcherHoc()
export default class Layout extends React.PureComponent {

    static propTypes = {
        status: PropTypes.string,
    };

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
