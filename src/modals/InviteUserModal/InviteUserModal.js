import React from 'react';
import PropTypes from 'prop-types';

import {html, dal} from 'components';
import Modal from 'yii-steroids/ui/modal/Modal';
import Form from 'yii-steroids/ui/form/Form';
import InputField from 'yii-steroids/ui/form/InputField';
import CheckboxField from 'yii-steroids/ui/form/CheckboxField';
import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import validate from 'shared/validate';

import './InviteUserModal.scss';

const bem = html.bem('InviteUserModal');
const FORM_ID = 'invite_user';

export default class InviteUserModal extends React.PureComponent {

    static propTypes = {
        modalProps: PropTypes.object,
        isWhale: PropTypes.bool,
    };

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <div className={bem.element('content')}>
                    <h1 className={bem.element('title')}>
                        {__('Invite User')}
                    </h1>
                    <div className={bem.element('invited-by')}>
                        {__('You can invite users by sending them an invitation')}
                    </div>
                    <Form
                        className={bem.element('form')}
                        formId={FORM_ID}
                        layout='default'
                        onSubmit={values => {
                            validate(values,[
                                ['address', 'required'],
                                [['name', 'message'], 'string'],
                            ]);

                            dal.invite(values);
                        }}
                        onComplete={this.props.onClose}
                    >
                        <div className={bem.element('form-inner')}>
                            <div className={bem.element('group')}>
                                <InputField
                                    className={bem.element('nickname')}
                                    attribute='name'
                                    topHint={__('User’s Nickname (Optional)')}
                                    placeholder={__('Nickname')}
                                />
                                <CheckboxField
                                    className={bem.element('is-wale')}
                                    attribute='isWhale'
                                    label={__('It’s a Whale')}
                                />
                            </div>
                            <div className={bem(
                                bem.element('icon'), this.props.isWhale ? 'Icon__invite-whale' : 'Icon__invite-user'
                            )}/>
                        </div>
                        <InputField
                            className={bem.element('address')}
                            attribute='address'
                            label={__('Waves Address')}
                            placeholder={__('Enter New User’s Waves Adress')}
                        />
                        <TextField
                            className={bem.element('message')}
                            attribute='message'
                            label={__('Your Message')}
                            placeholder={__('Enter Your Message for New User')}
                        />
                        <div className={bem.element('action')}>
                            <Button
                                className={bem.element('action')}
                                label={__('Invite')}
                                color='primary'
                                type={'submit'}
                            />
                        </div>
                    </Form>
                </div>
            </Modal>
        );
    }
}
