import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';

import {html} from 'components';

import './VotingForm.scss';
const FORM_ID = 'VotingForm';

const bem = html.bem('VotingForm');

export default class VotingForm extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                <Form
                    formId={FORM_ID}
                >
                    <div className={bem.element('text')}>
                        <TextField
                            attribute={'review'}
                        />
                    </div>
                    <div className={bem.element('actions')}>
                        <Button
                            type={'submit'}
                            label={__('Accept')}
                        />
                        <Button
                            color={'danger'}
                            type={'submit'}
                            label={__('Reject')}
                        />
                    </div>
                </Form>
            </div>
        );
    }
}
