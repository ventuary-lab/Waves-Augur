import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getFormValues} from 'redux-form';
import _times from 'lodash-es/times';

import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';

import {dal, html} from 'components';
import userAvatarStub from 'static/images/user-avatar-stub.png';

import './DonateForm.scss';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';

const FORM_ID = 'DonateForm';

const bem = html.bem('DonateForm');

@connect(
    state => ({
        route: getCurrentRoute(state),
        formValues: getFormValues(FORM_ID)(state),
    })
)
export default class DonateForm extends React.PureComponent {

    static propTypes = {
        route: PropTypes.object,
        formValues: PropTypes.object,
    };

    constructor() {
        super(...arguments);

        this.state = {
            donate: {
                count: 0,
                isPositive: true,
            }
        };
    }

    render() {
        return (
            <div className={bem.block()}>

                <div className={bem.element('user-info')}>
                    <img
                        className={bem.element('user-avatar')}
                        src={userAvatarStub}
                        alt='user-name'
                    />
                    <span className={bem.element('user-name')}>
                        Aleksey Pupyshev
                    </span>
                    <div className={bem.element('donate-control')}>
                        <div className={bem.element('donate-direction')}>
                            {_times(5).map(item => (
                                <div className={bem.element('donate-count-item', {
                                    positive: this.state.donate.isPositive,
                                    negative: !this.state.donate.isPositive,
                                })}/>
                            ))}
                        </div>
                        <div className={bem.element('donate-direction-switcher')}>
                            <div className={bem.element('donate-switch-positive', {
                                active: this.state.donate.isPositive,
                            })}>

                            </div>
                            <div className={bem.element('donate-switch-negative', {
                                active: !this.state.donate.isPositive,
                            })}>

                            </div>
                        </div>
                    </div>

                </div>
                <Form
                    className={bem.element('form')}
                    formId={FORM_ID}
                >
                    <div className={bem.element('text-field')}>
                        <TextField
                            attribute={'review'}
                        />
                    </div>
                    <div className={bem.element('actions')}>
                        <Button
                            label={__('Donate')}
                            // onClick={() => this._onSubmit(ProjectVoteEnum.FEATURED)}
                        />
                    </div>
                </Form>
            </div>
        );
    }

    // _onSubmit(vote) {
    //     dal.voteProject(this.props.route.params.uid, vote, {
    //         comment: this.props.formValues.review,
    //     });
    // }
}
