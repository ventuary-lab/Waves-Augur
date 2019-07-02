import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getFormValues} from 'redux-form';
import {getUser} from 'yii-steroids/reducers/auth';

import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import Form from 'yii-steroids/ui/form/Form';

import {dal, html} from 'components';
import userAvatarStub from 'static/images/user-avatar-stub.png';

import './GrantForm.scss';
import ProjectSchema from 'types/ProjectSchema';
import _get from 'lodash/get';
import validate from 'shared/validate';

const FORM_ID = 'GrantForm';

const bem = html.bem('GrantForm');

@connect(
    state => ({
        formValues: getFormValues(FORM_ID)(state),
        user: getUser(state),
    })
)
export default class GrantForm extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
        formValues: PropTypes.object,
    };

    constructor() {
        super(...arguments);

        this._onSubmit = this._onSubmit.bind(this);

        this._tiers = dal.contract.TIERS;

        this.state = {
            tierValue: 0,
            tierHovered: null,
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
                            placeholder={__('Sponsor comment...')}
                        />
                    </div>
                    <div className={bem.element('actions')}>
                        <Button
                            type='submit'
                            label={__('Grant Sponsor')}
                        />
                    </div>
                </Form>
            </div>
        );
    }

    _onSubmit(values) {
        validate(values,[
            ['review', 'required'],
        ]);

        return dal.whaleProject(this.props.project.uid, this.state.tierValue, {
            comment: values.review,
        });
    }

    renderDonateControl() {
        return (
            <div className={bem.element('direction')}>
                {this._tiers.map((tier, index) => (
                    <div
                        className={bem.element('count-container', {
                            active: this.state.tierValue >= index,
                            hovered: this.state.tierHovered >= index,
                        })}
                        key={index}
                        onClick={() => {
                            this.setState({
                                tierValue: this.state.tierValue === index ? 0 : index,
                            });
                        }}
                        onMouseOver={() => {
                            this.setState({
                                tierHovered: index,
                            });
                        }}
                        onMouseLeave={() => {
                            this.setState({
                                tierHovered: null,
                            });
                        }}
                    >
                        <div className={bem.element('count-item')}/>
                    </div>
                ))}
            </div>
        );
    }
}
