import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getFormValues} from 'redux-form';
import _times from 'lodash-es/times';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import {getUser} from 'yii-steroids/reducers/auth';

import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';

import {dal, html} from 'components';
import userAvatarStub from 'static/images/user-avatar-stub.png';

import './DonateForm.scss';

const FORM_ID = 'DonateForm';

const bem = html.bem('DonateForm');
const POSITIVE_DIRECTION = 'positive';
const NEGATIVE_DIRECTION = 'negative';

@connect(
    state => ({
        route: getCurrentRoute(state),
        formValues: getFormValues(FORM_ID)(state),
        user: getUser(state),
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
            wavesValue: 0,
            wavesHovered: 0,
            directionValue: POSITIVE_DIRECTION,
            directionHovered: null,
        };
    }

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
                    <div className={bem.element('donate-control')}>
                        <div className={bem.element('donate-direction')}>
                            {_times(5).map((item, index) => (
                                <div
                                    className={bem.element('donate-count-container', {
                                        active: this.state.wavesValue >= (index + 1),
                                        hovered: this.state.wavesHovered >= (index + 1),
                                        direction: this.state.directionValue,
                                    })}
                                    key={index}
                                    onClick={() => {
                                        this.setState({
                                            wavesValue: this.state.wavesValue === (index + 1) ? 0 : (index + 1),
                                        });
                                    }}
                                    onMouseOver={() => {
                                        this.setState({
                                            wavesHovered: index + 1,
                                        });
                                    }}
                                    onMouseLeave={() => {
                                        this.setState({
                                            wavesHovered: 0,
                                        });
                                    }}
                                >
                                    <div className={bem.element('donate-count-item')}/>
                                </div>
                            ))}
                        </div>
                        <div className={bem.element('donate-direction-switcher')}>
                            <div
                                className={bem.element('donate-unlike')}
                                onClick={() => this.setState({
                                    directionValue: NEGATIVE_DIRECTION,
                                })}
                                onMouseOver={() => {
                                    this.setState({
                                        directionHovered: POSITIVE_DIRECTION,
                                    });
                                }}
                                onMouseLeave={() => {
                                    this.setState({
                                        directionHovered: null,
                                    });
                                }}
                            >
                                {this.state.directionValue === POSITIVE_DIRECTION && (
                                    <span className={'Icon Icon__unlike'}/>
                                ) || (
                                    <span className={'Icon Icon__unlike_filled_red'}/>
                                )}
                            </div>
                            <div
                                className={bem.element('donate-like')}
                                onClick={() => this.setState({
                                    directionValue: POSITIVE_DIRECTION,
                                })}
                                onMouseOver={() => {
                                    this.setState({
                                        directionHovered: NEGATIVE_DIRECTION,
                                    });
                                }}
                                onMouseLeave={() => {
                                    this.setState({
                                        directionHovered: null,
                                    });
                                }}
                            >
                                {this.state.directionValue === POSITIVE_DIRECTION && (
                                    <span className={'Icon Icon__like_filled_green'}/>
                                ) || (
                                    <span className={'Icon Icon__like'}/>
                                )}
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
