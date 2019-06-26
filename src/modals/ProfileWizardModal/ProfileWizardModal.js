import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Modal from 'yii-steroids/ui/modal/Modal';

import {html, dal} from 'components';
import AboutTab from './views/AboutTab';
import LinksTab from './views/LinksTab';
import WaitingTab from './views/WaitingTab';
import FormWizard from 'ui/form/FormWizard';

const bem = html.bem('ProfileWizardModal');

import './ProfileWizardModal.scss';
import {getUser} from 'yii-steroids/reducers/auth';

@connect(
    state => ({
        user: getUser(state),
    })
)
export default class ProfileWizardModal extends React.Component {

    static propTypes = {
        user: PropTypes.object,
    };

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <FormWizard
                    formId='ProfileWizardModal'
                    onSubmit={values => dal.signup(values)}
                    onComplete={this.props.onClose}
                    initialValues={{
                        name: this.props.user ? this.props.user.name : null,
                    }}
                    items={[
                        {
                            id: 'waiting',
                            component: WaitingTab,
                            componentProps: {
                                invitedBy: this.props.user.invitedBy,
                            },
                        },
                        {
                            id: 'links',
                            component: LinksTab,
                        },
                        {
                            id: 'about',
                            component: AboutTab,
                        },
                    ]}
                />
            </Modal>
        );
    }

}
