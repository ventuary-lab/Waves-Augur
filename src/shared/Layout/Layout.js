import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ModalWrapper from 'ui/modal/ModalWrapper';

import {html} from 'components';
import Header from 'shared/Header';
import Footer from 'shared/Footer';
import {getCurrentRoute} from 'reducers/routing';
import RoutesEnum from 'enums/RoutesEnum';

import './Layout.scss';

const bem = html.bem('Layout');

@connect(
    state => ({
        currentRoute: getCurrentRoute(state),
    })
)
export default class Layout extends React.PureComponent {

    static propTypes = {
        status: PropTypes.string,
        currentRoute: PropTypes.shape({
            id: PropTypes.string,
            path: PropTypes.string,
            url: PropTypes.string,
            isExact: PropTypes.bool,
            params: PropTypes.object,
        }),
    };

    render() {
        return (
            <div className={bem.block()}>
                <Header/>
                <main className={bem.element('content')}>
                    {this.props.currentRoute.id !== RoutesEnum.MAIN && (
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
