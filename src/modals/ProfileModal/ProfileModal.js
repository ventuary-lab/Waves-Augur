import React from 'react';
import Button from 'yii-steroids/ui/form/Button/Button';
import Modal from 'yii-steroids/ui/modal/Modal';
import Form from 'yii-steroids/ui/form/Form';
import Nav from 'yii-steroids/ui/nav/Nav';

import {html, dal} from 'components';
import AboutTab from './views/AboutTab';
import LinksTab from './views/LinksTab';
import WaitingTab from './views/WaitingTab';

const bem = html.bem('ProfileModal');

import './ProfileModal.scss';

export default class ProfilePopup extends React.Component {

    constructor() {
        super(...arguments);

        this.state = {
            activeTabIndex: 0,
        };

        this._tabs = [
            {
                id: 'waiting',
                component: WaitingTab,
            },
            {
                id: 'links',
                component: LinksTab,
            },
            {
                id: 'about',
                component: AboutTab,
            },
        ];
    }

    render() {
        return (
            <Modal
                {...this.props}
                className={bem.block()}
            >
                <Form
                    formId='ProfileModal'
                    onSubmit={this._onSubmit}
                >
                    <Nav
                        items={this._tabs.map(tab => ({
                            id: tab.id,
                        }))}
                        activeTab={this._tabs[this.state.activeTabIndex].id}
                    />
                    {this.renderContent()}
                    <div className={bem.element('buttons-cont')}>
                        {this.state.activeTabIndex > 0 && (
                            <Button
                                color='primary'
                                onClick={() => this.switchTab(-1)}
                                outline
                            >
                                {__('Back')}
                            </Button>
                        )}
                        <Button
                            type='submit'
                            color='primary'
                            onClick={() => this.switchTab(1)}
                            outline
                        >
                            {__('Next')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        );
    }

    renderContent() {
        const TabComponent = this._tabs[this.state.activeTabIndex].component;
        return (
            <TabComponent/>
        );
    }

    switchTab(direction) {
        const newIndex = Math.max(0, Math.min(this._tabs.length - 1, this.state.activeTabIndex + direction));
        this.setState({
            activeTab: this._tabs[newIndex].id,
        });
    }

    _onSubmit(values) {
        const isEndTab = this.state.activeTabIndex === this._tabs.length - 1;
        if (isEndTab) {
            (async () => {
                try {
                    const tx = await dal.setUserRegisterOrUpdate(values);
                    const signResponse = await window.WavesKeeper.signAndPublishTransaction(tx);
                    console.log({signResponse});
                    window.alert(JSON.stringify({signResponse}));
                    this.onClose();
                } catch (e) {
                }
            })();
        }
    }
}
