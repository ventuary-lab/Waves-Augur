import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from 'yii-steroids/ui/modal/ModalWrapper';
import layoutHoc from 'yii-steroids/ui/layoutHoc';

import {html, dal} from 'components';
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
export default class Layout extends React.PureComponent {

    static propTypes = {
        status: PropTypes.string,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Header/>
                <main className={bem.element('content')}>
                    <div className={bem.element('image-line')}/>
                    {this.props.children}
                </main>
                <Footer/>
                <ModalWrapper/>
            </div>
        );
    }
}
