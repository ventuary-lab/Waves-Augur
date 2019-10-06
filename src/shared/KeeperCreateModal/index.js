import React from 'react';
import { html } from 'components';
import BaseModal from 'ui/modal/BaseModal';

const bem = html.bem('KeeperCreateModal');

import './index.scss';

class KeeperCreateModal extends React.Component {
    constructor(props) {
        super(props);

        this._triggerModal = this._triggerModal.bind(this);

        this.state = {
            isVisible: true
        }
    }

    _triggerModal () {
        this.setState(prevState => ({ ...prevState, isVisible: !prevState.isVisible }))
    }

    render () {
        const { isVisible } = this.state;

        return (
            <div className={bem.element('root')}>
                <button onClick={this._triggerModal}>1</button>
                <BaseModal isVisible={isVisible}>
                    <div>
                        '7777'
                    </div>
                </BaseModal>
            </div>
        )
    }
}

export default KeeperCreateModal;