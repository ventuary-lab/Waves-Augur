import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getFormValues} from 'redux-form';
import _get from 'lodash/get';

import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';
import {getUser} from 'yii-steroids/reducers/auth';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';

import ProjectVoteEnum from 'enums/ProjectVoteEnum';
import {dal, html} from 'components';
import userAvatarStub from 'static/images/user-avatar-stub.png';

import './VotingForm.scss';

const FORM_ID = 'VotingForm';

const bem = html.bem('VotingForm');

@connect(
    state => ({
        route: getCurrentRoute(state),
        formValues: getFormValues(FORM_ID)(state),
        user: getUser(state),
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

                <div className={bem.element('user-info')}>
                    <img
                        className={bem.element('user-avatar')}
                        src={this.props.user.profile.avatar || userAvatarStub}
                        alt={this.props.user.profile.name}
                    />
                    <span className={bem.element('user-name')}>
                        {this.props.user.profile.name}
                    </span>
                    <span className={bem.element('vote-price')}>
                        1 W
                    </span>
                </div>
                <Form
                    className={bem.element('form')}
                    formId={FORM_ID}
                >
                    <div className={bem.element('text-field')}>
                        <TextField
                            attribute='review'
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
            comment: _get(this.props, 'formValues.review') || null,
        });
    }
}
