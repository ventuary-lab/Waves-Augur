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
                    title={__('')}
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
                                ['name', 'string', {min: 3, max: 150}],
                            ],
                        },
                        {
                            id: 'links',
                            component: LinksTab,
                            validators: [
                                [SocialEnum.getKeys().map(id => `socials.url_${id}`), 'string', {max: 250}],
                                [SocialEnum.getKeys().map(id => `socials.url_${id}`), 'social'],
                                ['socials.url_' + SocialEnum.TWITTER, function(values, attribute) {
                                    if (!_get(values, attribute) && !_get(values, 'socials.url_' + SocialEnum.TELEGRAM)) {
                                        return __('Twitter or telegram is required');
                                    }
                                }]
                            ],
                        },
                        {
                            id: 'about',
                            component: AboutTab,
                            validators: [
                                [['title', 'tags', 'location'], 'required'],
                                ['title', 'string', {min: 3, max: 250}],
                                ['avatar', 'string', {max: 250}],
                                ['location', 'string', {max: 150}],
                            ],
                        },
                    ]}
                />
            </Modal>
        );
    }

}
