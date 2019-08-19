import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getFormValues, change} from 'redux-form';
import {getUser} from 'yii-steroids/reducers/auth';
import _isFunction from 'lodash-es/isFunction';

import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';

import {dal, html} from 'components';


import userAvatarStub from 'static/images/user-avatar-stub.png';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';

import './DonateForm.scss';
import ProjectSchema from 'types/ProjectSchema';
import validate from 'shared/validate';
import UserRole from '../../enums/UserRole';

const FORM_ID = 'DonateForm';

const bem = html.bem('DonateForm');
const POSITIVE_DIRECTION = 'positive';
const NEGATIVE_DIRECTION = 'negative';

@connect(
    state => ({
        formValues: getFormValues(FORM_ID)(state),
        user: getUser(state),
    })
)
export default class DonateForm extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
        formValues: PropTypes.object,
    };

    constructor() {
        super(...arguments);

        this._onSubmit = this._onSubmit.bind(this);

        this._tiers = dal.contract.TIERS;

        this.state = {
            wavesValue: this._tiers[0],
            wavesHovered: null,
            directionValue: POSITIVE_DIRECTION,
            directionHovered: null,
        };
    }

    render() {
        const avatarStub = this.props.user.role === UserRole.REGISTERED
            ? userAvatarStub
            : anonymousAvatarStub;

        const isAnonReview = [UserRole.ANONYMOUS, UserRole.INVITED].includes(this.props.user.role);

        return (
            <div className={bem.block()}>
                <div className={bem.element('user-info')}>
                    <img
                        className={bem.element('user-avatar')}
                        src={this.props.user.profile.avatar || avatarStub}
                        alt={this.props.user.profile.name}
                    />
                    <span className={bem.element('user-name')}>
                        {this.props.user.profile.name}
                    </span>
                    <div className={bem.element('donate-control')}>
                        {this.renderDonateControl()}
                    </div>

                </div>
                <Form
                    className={bem.element('form')}
                    formId={FORM_ID}
                    onSubmit={this._onSubmit}
                >
                    <div className={bem.element('text-field')}>
                        <TextField
                            attribute={'review'}
                            placeholder={__('Donate comment...')}
                            disabled={isAnonReview}
                        />
                    </div>
                    <div className={bem.element('actions')}>
                        <Button
                            type='submit'
                            label={__('Donate')}
                        />
                    </div>
                </Form>
            </div>
        );
    }

    _onSubmit(values) {
        const isAnonReview = [UserRole.ANONYMOUS, UserRole.INVITED].includes(this.props.user.role);
        const anonReviewText = this.state.directionValue === POSITIVE_DIRECTION
            ? 'Anonymous donation...'
            : 'Anonymous bet...';

        validate(values,[
            !isAnonReview && ['review', 'required'],
        ]);

        const amount = (this.state.directionValue === POSITIVE_DIRECTION ? 1 : -1) * this.state.wavesValue;
        return dal.donateProject(this.props.project.uid, amount, {
            comment: isAnonReview
                ? anonReviewText
                : values.review,
        })
            .then(() => {
                this.props.dispatch(change(FORM_ID, 'review', ''));

                if (this.props.onComplete && _isFunction(this.props.onComplete)) {
                    this.props.onComplete();
                }
            });
    }

    renderDonateControl() {
        return (
            <>
                {(this.state.wavesHovered || this.state.wavesValue) && (
                    <span className={bem.element('value')}>
                        {this.state.wavesHovered || this.state.wavesValue} 🔹
                    </span>
                )}
                <div className={bem.element('direction')}>
                    {this._tiers.map((tier, index) => (
                        <div
                            className={bem.element('count-container', {
                                active: this.state.wavesValue && this.state.wavesValue >= tier,
                                hovered: this.state.wavesHovered && this.state.wavesHovered >= tier,
                                direction: this.state.directionValue,
                                'direction-hovered': this.state.directionHovered,
                            })}
                            key={index}
                            onClick={() => {
                                this.setState({
                                    wavesValue: this.state.wavesValue === tier ? this._tiers[0] : tier,
                                });
                            }}
                            onMouseOver={() => {
                                this.setState({
                                    wavesHovered: tier,
                                });
                            }}
                            onMouseLeave={() => {
                                this.setState({
                                    wavesHovered: null,
                                });
                            }}
                        >
                            <div className={bem.element('count-item')}/>
                        </div>
                    ))}
                </div>
                <div className={bem.element('direction-switcher')}>
                    <div
                        className={bem.element('unlike', {
                            hovered: this.state.directionHovered,
                        })}
                        onClick={() => this.setState({
                            directionValue: NEGATIVE_DIRECTION,
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
                            <span className={'Icon Icon__unlike'}/>
                        ) || (
                            <>
                                {this.state.directionHovered === POSITIVE_DIRECTION
                                    ? <span className={'Icon Icon__unlike_filled'}/>
                                    : <span className={'Icon Icon__unlike_filled_red'}/>
                                }
                            </>
                        )}
                    </div>
                    <div
                        className={bem.element('like', {
                            hovered: this.state.directionHovered,
                        })}
                        onClick={() => this.setState({
                            directionValue: POSITIVE_DIRECTION,
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
                            <>
                                {this.state.directionHovered === NEGATIVE_DIRECTION
                                    ? <span className={'Icon Icon__like_filled'}/>
                                    : <span className={'Icon Icon__like_filled_green'}/>
                                }
                            </>
                        ) || (
                            <span className={'Icon Icon__like'}/>
                        )}
                    </div>
                </div>
            </>
        );
    }
}
