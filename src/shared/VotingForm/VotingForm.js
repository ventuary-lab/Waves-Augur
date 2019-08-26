import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getFormValues} from 'redux-form';
import _get from 'lodash/get';

import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';
import {getUser} from 'yii-steroids/reducers/auth';

import ProjectVoteEnum from 'enums/ProjectVoteEnum';
import {dal, html} from 'components';
import userAvatarStub from 'static/images/user-avatar-stub.png';

import './VotingForm.scss';
import ProjectSchema from 'types/ProjectSchema';
import {goToPage} from 'yii-steroids/actions/navigation';
import {ROUTE_PROFILE_INBOX} from 'routes';

const FORM_ID = 'VotingForm';

const bem = html.bem('VotingForm');

@connect(
    state => ({
        formValues: getFormValues(FORM_ID)(state),
        user: getUser(state),
    })
)
export default class VotingForm extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
        formValues: PropTypes.object,
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('user-info')}>
                    <img
                        className={bem.element('user-avatar')}
                        src={_get(this.props, 'user.profile.avatar', userAvatarStub)}
                        alt={_get(this.props, 'user.profile.name', '')}
                    />
                    <span className={bem.element('user-name')}>
                        {_get(this.props, 'user.profile.name', '')}
                    </span>
                    <span className={bem.element('vote-price')}>
                        {dal.getVotePayment()} 🔹
                    </span>
                </div>
                <Form
                    className={bem.element('form')}
                    formId={FORM_ID}
                >
                    <div className={bem.element('text-field')}>
                        <TextField
                            attribute='review'
                            placeholder={__('Vote comment...')}
                        />
                    </div>
                    <div className={bem.element('actions')}>
                        <Button
                            label={__('Accept')}
                            onClick={() => this._onSubmit(ProjectVoteEnum.FEATURED)}
                        />
                        <Button
                            label={__('Reject')}
                            onClick={() => this._onSubmit(ProjectVoteEnum.DELISTED)}
                            color={'danger'}
                        />
                    </div>
                </Form>
            </div>
        );
    }

    _onSubmit(vote) {
        // TODO validation
        /*validate(_get(this.props, 'formValues', {}),[
            ['review', 'required'],
        ]);*/

        return dal.voteProject(this.props.project.uid, this.props.user.address, vote, {
            comment: _get(this.props, 'formValues.review') || null,
        })
            .then(() => this.props.dispatch(goToPage(ROUTE_PROFILE_INBOX)));
    }
}
