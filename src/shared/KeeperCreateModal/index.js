import React from 'react';
import { html } from 'components';
import BaseModal from 'ui/modal/BaseModal';
import logoSvg from 'static/icons/dao-logo-white.svg';
import Button from 'yii-steroids/ui/form/Button';

const bem = html.bem('KeeperCreateModal');

import './index.scss';

class KeeperCreateModal extends React.Component {
    constructor(props) {
        super(props);

        this._triggerModal = this._triggerModal.bind(this);
        this._setTabIndex = this._setTabIndex.bind(this);
        this._getInviteStartView = this._getInviteStartView.bind(this);
        this._getLeftSideView = this._getLeftSideView.bind(this);
        this._getView = this._getView.bind(this);

        this.state = {
            isVisible: true,
            inviteStart: {
                tabIndex: 0
            }
        };
    }

    _triggerModal () {
        this.setState(prevState => ({ ...prevState, isVisible: !prevState.isVisible }))
    }

    _setTabIndex (tabIndex) {
        this.setState(prevState => (
            {
                ...prevState,
                inviteStart: {
                    ...prevState.inviteStart,
                    tabIndex
                }
            }
        ));
    }

    _getLeftSideView () {
        return (
            <div className={bem.element('left')}>
                <img src={logoSvg}/>
                <h4>Welcome to the DAO</h4>
                <p>
                    Congratulations, you have received an invitation from a DAO’s member.
                    Now, we will guide you step-by-step as you register.
                    To use our platform, you require a Waves account — let’s set it up first.
                </p>
            </div>
        )
    }

    _getInviteStartView () {
        const createWavesAccount = () => this._setTabIndex(0);
        const importWavesAccount = () => this._setTabIndex(1);
        const { tabIndex = 0 } = this.state.inviteStart;

        const mapButton = ({ label, onClick }, btnIndex) => (
            <div className={btnIndex === tabIndex ? 'selected' : ''}>
                <a onClick={onClick}>{label}</a>
            </div>
        );

        const buttons = [
            { label: 'Create Waves account', onClick: createWavesAccount },
            { label: 'Import Waves account', onClick: importWavesAccount },
        ].map(mapButton);

        return (
            <div className={bem.element('base-view')}>
                {this._getLeftSideView()}
                <div className={bem.element('right')}>
                    <div className={bem.element('import-create')}>
                        <div>
                            {buttons}
                        </div>
                        <p>
                            If you do not own a Waves account yet, create it right now in a matter of minutes.
                        </p>
                        <Button
                            type='submit'
                            color='primary'
                            label='Create new account'
                        />
                    </div>
                </div>
            </div>
        );
    }

    _getView () {
        return this._getInviteStartView();
    }

    render () {
        const { isVisible } = this.state;

        return (
            <div className={bem.element('root')}>
                <button onClick={this._triggerModal}>1</button>
                <BaseModal isVisible={isVisible}>
                    {this._getView()}
                </BaseModal>
            </div>
        )
    }
}

export default KeeperCreateModal;