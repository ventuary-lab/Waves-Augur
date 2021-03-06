import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import {html} from 'components';
import './ModalView.scss';

const bem = html.bem('ModalView');

export default class ModalView extends React.PureComponent {

    static propTypes = {
        onClose: PropTypes.func,
        children: PropTypes.node,
    };

    componentDidMount() {
        html.addClass(document.body, 'overflow-hidden');
    }

    componentWillUnmount() {
        html.removeClass(document.body, 'overflow-hidden');
    }

    render() {
        return (
            <div className={bem.block()}>
                <Modal
                    isOpen={true}
                    overlayClassName={bem.element('overlay')}
                    ariaHideApp={false}
                    {...this.props}
                    className={bem(
                        bem.element('modal'),
                        this.props.className
                    )}
                >
                    <div className={bem.element('inner')}>
                        <a
                            className={bem.element('close')}
                            href='javascript:void(0)'
                            onClick={this.props.onClose}
                        />
                        <div className={bem.element('content')}>
                            {this.props.children}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

}
