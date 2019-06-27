import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _get from 'lodash/get';
import Modal from 'yii-steroids/ui/modal/Modal';

import {html, dal} from 'components';
import AboutTab from './views/AboutTab';
import LinksTab from './views/LinksTab';
import WaitingTab from './views/WaitingTab';
import FormWizard from 'ui/form/FormWizard';

const bem = html.bem('ProfileWizardModal');

import './ProfileWizardModal.scss';
import {getUser} from 'yii-steroids/reducers/auth';
import SocialEnum from 'enums/SocialEnum';
import UserSchema from 'types/UserSchema';

@connect(
    state => ({
        user: getUser(state),
    })
)
export default class ProfileWizardModal extends React.Component {

    static propTypes = {
        user: UserSchema,
        isCreate: PropTypes.bool,
    };

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <FormWizard
                    formId='ProfileWizardModal'
                    onSubmit={values => dal.saveUser(values)}
                    onComplete={this.props.onClose}
                    initialValues={_get(this.props, 'user.profile')}
                    items={[
                        {
                            id: 'waiting',
                            component: WaitingTab,
                            componentProps: {
                                isCreate: this.props.isCreate,
                                invitedBy: this.props.user.invitedBy,
                            },
                            validators: [
                                ['name', 'required'],
                                ['name', 'string'],
                            ],
                        },
                        {
                            id: 'links',
                            component: LinksTab,
                            validators: [
                                [SocialEnum.getKeys().map(id => `socials.url_${id}`), 'social'],
                            ],
                        },
                        {
                            id: 'about',
                            component: AboutTab,
                            validators: [
                                [['avatar', 'title', 'location'], 'string'],
                            ],
                        },
                    ]}
                />
            </Modal>
        );
    }

}
