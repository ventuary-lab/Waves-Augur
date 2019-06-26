import React from 'react';
import {connect} from 'react-redux';
import Modal from 'yii-steroids/ui/modal/Modal';
import InputField from 'yii-steroids/ui/form/InputField';
import TextField from 'yii-steroids/ui/form/TextField';
import DateField from 'yii-steroids/ui/form/DateField';
import TagsField from 'ui/form/TagsField';
import ConnectImageField from 'ui/form/ConnectImageField';
import {isPhone} from 'yii-steroids/reducers/screen';

import {html} from 'components';

import './ProjectWizardModal.scss';
import FormWizard from 'ui/form/FormWizard';

const bem = html.bem('ProjectWizardModal');

@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class ProjectWizardModal extends React.PureComponent {

    constructor() {
        super(...arguments);

        this._onSubmit = this._onSubmit.bind(this);
    }

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <FormWizard
                    formId='ProjectWizardModal'
                    onSubmit={this._onSubmit}
                    items={[
                        {
                            id: 'name',
                            component: this._stepName,
                        },
                        {
                            id: 'campaign',
                            component: this._stepCampaign,
                        },
                        {
                            id: 'idea-problem',
                            component: this._stepIdeaProblem,
                        },
                        {
                            id: 'idea-mvp',
                            component: this._stepIdeaMvp,
                        },
                        {
                            id: 'idea-impact',
                            component: this._stepIdeaImpact,
                        },
                        {
                            id: 'idea-code',
                            component: this._stepIdeaCode,
                        },
                        {
                            id: 'contacts',
                            component: this._stepContacts,
                        },
                    ]}
                />
            </Modal>
        );
    }

    _onSubmit(values) {

    }

    _stepName(props) {
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
                            label={props.isPhone ? __('Project Name') : false}
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
                            label={props.isPhone ? __('Sort Description') : false}
                            attribute={'shortDescription'}
                            placeholder={__('Description')}
                        />
                    </div>
                </div>
            </>
        );
    }

    _stepCampaign(props) {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Campaign Details')}
                </div>

                <div className={bem.element('form-row')}>
                    <div className={bem.element('form-col-label')}>
                        <label>
                            {__('Logo URL')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <ConnectImageField
                            label={props.isPhone ? __('Logo URL') : false}
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
                            label={props.isPhone ? __('Cover URL') : false}
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
                                label={props.isPhone ? __('Waves') : false}
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
                            label={props.isPhone ? __('Your Country') : false}
                            attribute={'country'}
                            placeholder={__('Enter')}
                        />
                    </div>
                </div>
            </>
        );
    }

    _stepIdeaProblem(props) {
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

    _stepIdeaMvp() {
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

    _stepIdeaImpact(props) {
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

    _stepIdeaCode(props) {
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

    _stepContacts(props) {
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
                            label={props.isPhone ? __('Project Website') : false}
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
                            label={props.isPhone ? __('Twitter') : false}
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
                            label={props.isPhone ? __('Facebook') : false}
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
                            label={props.isPhone ? __('Linkedin') : false}
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
                            label={props.isPhone ? __('E-mail') : false}
                            placeholder={__('Enter URL')}
                        />
                    </div>
                </div>
            </>
        )
    }
}
