import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from 'ui/modal/ModalWrapper';

import {html, http} from 'components';
import Header from 'shared/Header';
import Footer from 'shared/Footer';

import './Layout.scss';

const bem = html.bem('Layout');

export default class Layout extends React.PureComponent {

    static propTypes = {
        status: PropTypes.string,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Header/>
                <main className={bem.block()}>
                    {this.props.children}
                </main>
                <Footer/>
                <ModalWrapper/>
            </div>
        );
    }
}
