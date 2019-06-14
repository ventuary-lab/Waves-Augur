import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from 'yii-steroids/ui/modal/ModalWrapper';
import layoutHoc, {STATUS_LOADING, STATUS_OK} from 'yii-steroids/ui/layoutHoc';

import {html, http} from 'components';
import Header from 'shared/Header';
import Footer from 'shared/Footer';

import './Layout.scss';

const bem = html.bem('Layout');

@layoutHoc()
export default class Layout extends React.PureComponent {

    static propTypes = {
        status: PropTypes.string,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Header/>
                <main className={bem.block()}>
                    {this.renderContent()}
                </main>
                <Footer/>
                <ModalWrapper/>
            </div>
        );
    }

    renderContent() {
        switch (this.props.status) {
            case STATUS_LOADING:
                return (
                    <div>{__('Загрузка...')}</div>
                );

            case STATUS_OK:
                return this.props.children;
        }

        // TODO other statuses
        return this.props.status;
    }
}
