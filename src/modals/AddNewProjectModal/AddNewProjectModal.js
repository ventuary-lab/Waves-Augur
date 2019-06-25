import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'yii-steroids/ui/modal/Modal';
import Form from 'yii-steroids/ui/form/Form';
import InputField from 'yii-steroids/ui/form/InputField';
import TextField from 'yii-steroids/ui/form/TextField';
import Button from 'yii-steroids/ui/form/Button';
import FormProgress from 'shared/FormProgress';
import DateField from 'yii-steroids/ui/form/DateField';
import TagsField from 'ui/form/TagsField';
import ConnectImageField from 'ui/form/ConnectImageField';
import {isPhone} from 'yii-steroids/reducers/screen';

import {html} from 'components';

import './AddNewProjectModal.scss';

const bem = html.bem('AddNewProjectModal');
const FORM_ID = 'AddNewProject';
const STEPS_COUNT = 7;


@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class AddNewProjectModal extends React.PureComponent {

    static propTypes = {

    };

    constructor() {
        super(...arguments);

        this.state = {
          step: 1,
        };

        this.onBackStep = this.onBackStep.bind(this);
        this.onNextStep = this.onNextStep.bind(this);
    }

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block({
                    step: this.state.step,
                })}
            >
                <div className={bem.element('inner')}>
                    <div className={bem.element('container')}>
                        <div className={bem.element('form-progress')}>
                            <FormProgress
                                stepCount={STEPS_COUNT}
                                step={this.state.step}
                            />
                        </div>
                        <div className={bem.element('form')}>
                            <Form
                                action={''}
                                formId={FORM_ID}
                            >
                                <div className={bem.element('title')}>
                                    {__('You Are Creating New Project')}
                                </div>
                                <div className={bem.element('form-inner')}>
                                    {this.state.step === 1 && (
                                        <>
                                            {this.renderStepOne()}
                                        </>
                                    )}
                                    {this.state.step === 2 && (
                                        <>
                                            {this.renderStepTwo()}
                                        </>
                                    )}
                                    {this.state.step === 3 && (
                                        <>
                                            {this.renderStepThree()}
                                        </>
                                    )}
                                    {this.state.step === 4 && (
                                        <>
                                            {this.renderStepFour()}
                                        </>
                                    )}

                                    {this.state.step === 5 && (
                                        <>
                                            {this.renderStepFive()}
                                        </>
                                    )}

                                    {this.state.step === 6 && (
                                        <>
                                            {this.renderStepSix()}
                                        </>
                                    )}

                                    {this.state.step === 7 && (
                                        <>
                                            {this.renderStepSeven()}
                                        </>
                                    )}
                                </div>
                                <div className={bem.element('buttons')}>
                                    {this.state.step !== 1 && (
                                        <div className={bem.element('button', {
                                            back: true,
                                            'step-seven': this.state.step === 7
                                        })}>
                                            <Button
                                                label={__('Back')}
                                                onClick={this.onBackStep}
                                                likeString
                                            />
                                        </div>
                                    )}
                                    {this.state.step !== STEPS_COUNT && (
                                        <div className={bem.element('button', 'next')}>
                                            <Button
                                                label={__('Next')}
                                                onClick={this.onNextStep}
                                            />
                                        </div>
                                    )}
                                    {this.state.step === STEPS_COUNT && (
                                        <div className={bem.element('button','main-action')}>
                                            <Button
                                                type={'submit'}
                                                label={__('Create Project')}
                                                onClick={() => console.log('created')}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    onNextStep() {
        this.setState({
            step: this.state.step + 1
        })
    }

    onBackStep() {
        this.setState({
            step: this.state.step - 1
        })
    }


    renderStepOne() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('You Need To Give All Necessary Information About It')}
                </div>
                <span className={bem(
                    bem.element('new-project-icon'),
                    'Icon Icon__new-project_lg')}
                />
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Project Name')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <InputField
                            label={this.props.isPhone ? __('Project Name') : false}
                            attribute={'name'}
                            placeholder={__('Enter Your Project Name')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Srort Description')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={this.props.isPhone ? __('Srort Description') : false}
                            attribute={'shortDescription'}
                            placeholder={__('Description')}
                        />
                    </div>
                </div>
            </>
        );
    }

    renderStepTwo() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Campign Details')}
                </div>

                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Logo URL')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <ConnectImageField
                            label={this.props.isPhone ? __('Logo URL') : false}
                            attribute='logoUrl'
                            placeholder={__('Enter URL')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Cover URL')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <ConnectImageField
                            label={this.props.isPhone ? __('Cover URL') : false}
                            attribute='coverUrl'
                            placeholder={__('Enter URL')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Deadlines')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <div className={bem.element('deadlines')}>
                            <DateField
                                attribute='crowdfunding'
                                label={__('Crowdfunding')}
                            />
                            <DateField
                                attribute='grantDecision'
                                label={__('Grant decision')}
                            />
                        </div>
                    </div>
                </div>

                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Target (Waves)')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <div className={bem.element('targets')}>
                            <InputField
                                label={this.props.isPhone ? __('Waves') : false}
                                attribute={'target'}
                                placeholder={__('Enter Your Project Name')}
                            />
                            <DateField
                                attribute='demo-day'
                                label={__('Demo day')}
                            />
                        </div>
                    </div>
                </div>
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Tags')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <TagsField
                            attribute='tags'
                            label='Use ‘Enter’ to add a hashtag'
                            placeholder={__('Enter Tags')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Your Country')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <InputField
                            label={this.props.isPhone ? __('Your Country') : false}
                            attribute={'country'}
                            placeholder={__('Enter')}
                        />
                    </div>
                </div>
            </>
        );
    }

    renderStepThree() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Idea Canvas')}
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Problem'}
                            attribute={'problem'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>

                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Solution'}
                            attribute={'solution'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>

                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'X-Factor'}
                            attribute={'x-factor'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>

            </>
        );
    }

    renderStepFour() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Idea Canvas')}
                </div>

                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'MVP'}
                            attribute={'mvp'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Large Scale Adoption'}
                            attribute={'large-scale-adoption'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
            </>
        );
    }

    renderStepFive() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Idea Canvas')}
                </div>

                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Impact on User'}
                            attribute={'impact-on-user'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Impact on User Context'}
                            attribute={'impact-on-user-context'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Impact on User Society'}
                            attribute={'impact-on-user-society'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
            </>
        );
    }

    renderStepSix() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Idea Canvas')}
                </div>

                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Code Validation'}
                            attribute={'code-validation'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Legal Arrangements'}
                            attribute={'legal-arrangements'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Open-source strategy'}
                            attribute={'open-source-strategy'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Interconnectedness'}
                            attribute={'interconnectedness'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
            </>
        );
    }

    renderStepSeven() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Contacts')}
                </div>

                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Project Website')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <InputField
                            attribute={'website'}
                            label={this.props.isPhone ? __('Project Website') : false}
                            placeholder={__('Enter URL')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            <span className={bem.element('form-col-label-icon')}>
                                <span className={'Icon Icon__twitter'}/>
                            </span>
                            <span>{__('Twitter')}</span>
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <InputField
                            attribute={'twitter'}
                            label={this.props.isPhone ? __('Twitter') : false}
                            placeholder={__('Enter URL')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            <span className={bem.element('form-col-label-icon')}>
                                <span className={'Icon Icon__facebook'}/>
                            </span>
                            <span>{__('Facebook')}</span>
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <InputField
                            label={this.props.isPhone ? __('Facebook') : false}
                            attribute={'facebook'}
                            placeholder={__('Enter URL')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            <span className={bem.element('form-col-label-icon')}>
                                <span className={'Icon Icon__linkedin'}/>
                            </span>
                            <span>{__('Linkedin')}</span>
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <InputField
                            label={this.props.isPhone ? __('Linkedin') : false}
                            attribute={'linkedin'}
                            placeholder={__('Enter URL')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('E-mail')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <InputField
                            attribute={'email'}
                            label={this.props.isPhone ? __('E-mail') : false}
                            placeholder={__('Enter URL')}
                        />
                    </div>
                </div>
            </>
        )
    }
}
