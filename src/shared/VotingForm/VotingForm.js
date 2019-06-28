import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getFormValues} from 'redux-form';

import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';

import {dal, html} from 'components';

import './VotingForm.scss';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import ProjectVoteEnum from 'enums/ProjectVoteEnum';

const FORM_ID = 'VotingForm';

const bem = html.bem('VotingForm');

@connect(
    state => ({
        route: getCurrentRoute(state),
        formValues: getFormValues(FORM_ID)(state),
    })
)
export default class VotingForm extends React.PureComponent {

    static propTypes = {
        route: PropTypes.object,
        formValues: PropTypes.object,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Form
                    formId={FORM_ID}
                >
                    <div className={bem.element('sub-title')}>
                        {__('Vote for project')}
                    </div>
                    <div className={bem.element('text')}>
                        <TextField
                            attribute={'review'}
                        />
                    </div>
                    <div className={bem.element('actions')}>
                        <Button
                            label={__('Accept')}
                            onClick={() => this._onSubmit(ProjectVoteEnum.FEATURED)}
                        />
                        <Button
                            label={__('Reject')}
                            onClick={() => this._onSubmit(ProjectVoteEnum.FEATURED)}
                            color={'danger'}
                        />
                    </div>
                </Form>
            </div>
        );
    }

    _onSubmit(vote) {
        dal.voteProject(this.props.route.params.uid, vote, {
            comment: this.props.formValues.review,
        });
    }
}
