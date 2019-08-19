import React from 'react';
import {connect} from 'react-redux';
import {getFormValues} from 'redux-form';
import _get from 'lodash-es/get';
import PropTypes from 'prop-types';


import {dal as Dal, html} from 'components';
const dal = Dal();
import Modal from 'yii-steroids/ui/modal/Modal';
import Form from 'yii-steroids/ui/form/Form';
import InputField from 'yii-steroids/ui/form/InputField';
import CheckboxField from 'yii-steroids/ui/form/CheckboxField';
import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import validate from 'shared/validate';

import './InviteUserModal.scss';
import CopyToClipboard from '../../shared/CopyToClipboard';

const bem = html.bem('InviteUserModal');
const FORM_ID = 'invite_user';


@connect(
    state => ({
        formValues: getFormValues(FORM_ID)(state),
    })
)
export default class InviteUserModal extends React.PureComponent {

    static propTypes = {
        modalProps: PropTypes.object,
    };

    constructor() {
        super(...arguments);

        this.state = {
            invitationLink: '',
        };
    }

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <div className={bem.element('content')}>
                    <h1 className={bem.element('title')}>
                        {__('Invite New Member')}
                    </h1>
                    <div className={bem.element('invited-by')}>
                        {__('You can invite new users to the platform by sending them an invitation')}
                    </div>
                    <Form
                        className={bem.element('form')}
                        formId={FORM_ID}
                        layout='default'
                        onSubmit={values => {
                            if (!this.state.invitationLink) {
                                validate(values,[
                                    [['name', 'message'], 'string'],
                                ]);

                                return Promise.resolve(dal.invite(values))
                                    .then((result) => {
                                        this.setState({
                                            invitationLink: result.url,
                                        });
                                    });
                            }
                        }}
                    >
                        <div className={bem.element('form-inner')}>
                            <div className={bem.element('group')}>
                                <InputField
                                    layoutClassName={bem.element('nickname')}
                                    attribute='name'
                                    topLabel={__('User’s Nickname (Optional)')}
                                    placeholder={__('Nickname')}
                                    disabled={!!this.state.invitationLink}
                                />
                                {/* <CheckboxField
                                    layoutClassName={bem.element('is-wale')}
                                    attribute='isWhale'
                                    label={__('It’s a Whale')}
                                    disabled={!!this.state.invitationLink}
                                /> */}
                            </div>
                            <div className={bem(
                                bem.element('icon'), _get(this.props, 'formValues.isWhale') ? 'Icon__invite-whale' : 'Icon__invite-user'
                            )}/>
                        </div>

                        {this.state.invitationLink && (
                            <InputField
                                attribute='address'
                                topLabel={__('Invitation link')}
                                placeholder={__('Enter New User’s Waves Address')}
                                disabled={true}
                                inputProps={{
                                    value: this.state.invitationLink,
                                }}
                            />
                        )}

                        <TextField
                            layoutClassName={bem.element('message')}
                            attribute='message'
                            topLabel={__('Your Message')}
                            placeholder={__('Enter Your Message for New User')}
                            disabled={!!this.state.invitationLink}
                        />

                        <div className={bem.element('action')}>
                            {this.state.invitationLink && (
                                <CopyToClipboard copyText={this.state.invitationLink}>
                                    <Button
                                        label={__('Copy link')}
                                        color='primary'
                                    />
                                </CopyToClipboard>
                            ) || (
                                <Button
                                    label={__('Invite')}
                                    color='primary'
                                    type={'submit'}
                                />
                            )}
                        </div>
                    </Form>
                </div>
            </Modal>
        );
    }
}
