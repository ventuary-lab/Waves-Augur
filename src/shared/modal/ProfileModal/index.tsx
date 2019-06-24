import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from 'ui/form/Button/Button';
import { Form, Field } from 'react-final-form';
import DAL from 'dal/DataAccessLayer';

import AboutTab from './AboutTab';
import LinksTab from './LinksTab';
import WaitingTab from './WaitingTab';
import ProgressLine from './ProgressLine';

import { html } from 'components';
const bem: any = html.bem('ProfileModal');

import FormContext from './context';

import './ProfileModal.scss';

type InitialState = {
    isOpened: boolean;
    currentTab: number;
    formState: any;
    initialForm: any;
    isSendingAllowed: boolean;
}

class ProfilePopup extends React.Component {
    initialState: InitialState;
    state: InitialState;
    tabs: React.ReactNode[];

    constructor (props: any) {
        super(props);

        this.initialState = {
            isOpened: false,
            formState: {},
            initialForm: {},
            currentTab: 0,
            isSendingAllowed: false
        };

        this.state = { ...this.initialState };

        this.tabs = [
            <WaitingTab className={bem.element('body-inner')} />,
            <LinksTab className={bem.element('body-inner')} />,
            <AboutTab className={bem.element('body-inner')} />
        ];
    }

    async componentDidMount () {
        try {
            const onUnregistered = () => {
                console.log("OPENED");
                this.onOpen();
                this.setState({ initialForm: {} });
            };

            // @ts-ignore
            const userData = await DAL.getCheckStatusRegisteredUser(onUnregistered);

            // @ts-ignore
            this.setState({ initialForm: userData.bio });
        } catch (e) {
            // this.formState
        }
    }

    onClose = () => {
        this.setState({ ...this.initialState });
    }

    onOpen = () => {
        this.setState({ isOpened: true });
    }

    onNext = (tab: number) => {
        if (tab === 3) {
            this.setState({ isSendingAllowed: true });
        }

        if (tab < this.tabs.length) this.setState({ currentTab: tab });
    }

    onBack = (tab: number) => {
        if (tab >= 0) this.setState({ currentTab: tab });
    }

    onFormSubmit = (formState: any) => {
        if (this.state.isSendingAllowed) {
            console.log({ formState, tb: this.state.currentTab });

            (async () => {
                try {
                    // @ts-ignore
                    const tx = await window.DAL.setUserRegisterOrUpdate(formState);
                    // @ts-ignore
                    const signResponse = await window.WavesKeeper.signAndPublishTransaction(tx);
                    console.log({ signResponse });
                    window.alert(JSON.stringify({ signResponse }));
                    this.onClose();
                } catch (e) {}
            })();
        }
    }

    render () {
        const { onBack, onNext, onClose, onOpen, onFormSubmit } = this;
        const { isOpened, currentTab, initialForm } = this.state;

        const visibleTab: React.ReactNode = this.tabs
            .filter((tab: React.ReactNode, tabIndex: number) => tabIndex === currentTab)[0];

        return (
            <div className={bem.block()}>
                <button onClick={onOpen}>open modal</button>
                <Modal open={isOpened} onClose={onClose}>
                    <Form
                        onSubmit={onFormSubmit}
                        initialValues={initialForm}
                        render={({ handleSubmit, values }) => (
                            <FormContext.Provider value={values}>
                                <form onSubmit={handleSubmit}>
                                    <div className={bem.element('body')}>
                                        <ProgressLine index={currentTab}/>
                                        {visibleTab}
                                        <div className={bem.element('buttons-cont')}>
                                            {currentTab > 0 ? (
                                                <Button 
                                                    className="base-green outline" 
                                                    onClick={() => onBack(currentTab - 1)}>
                                                    Back
                                                </Button>
                                            ) : <div></div>}
                                            <Button
                                                type="submit"
                                                onClick={() => onNext(currentTab + 1)}
                                                className="base-green">
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </FormContext.Provider>
                        )}
                    />
                </Modal>
            </div>
        )
    }
}

export default ProfilePopup;