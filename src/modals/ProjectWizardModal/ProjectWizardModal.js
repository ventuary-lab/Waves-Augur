import React from 'react';
import {connect} from 'react-redux';
import Modal from 'yii-steroids/ui/modal/Modal';
import InputField from 'yii-steroids/ui/form/InputField';
import TextField from 'yii-steroids/ui/form/TextField';
import DateField from 'yii-steroids/ui/form/DateField';
import TagsField from 'ui/form/TagsField';
import ConnectImageField from 'ui/form/ConnectImageField';
import {isPhone} from 'yii-steroids/reducers/screen';
import AutoSaveHelper from 'yii-steroids/ui/form/Form/AutoSaveHelper';

import {dal, html} from 'components';

import './ProjectWizardModal.scss';
import FormWizard from 'ui/form/FormWizard';
import SocialEnum from 'enums/SocialEnum';

const bem = html.bem('ProjectWizardModal');
const FORM_ID = 'ProjectWizardModal';

@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class ProjectWizardModal extends React.PureComponent {

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <FormWizard
                    formId={FORM_ID}
                    onSubmit={values => dal.addItem(values)}
                    onComplete={() => {
                        this.props.onClose();
                        AutoSaveHelper.remove(FORM_ID);
                    }}
                    autoSave
                    items={[
                        {
                            id: 'name',
                            component: this._stepName,
                            validators: [
                                ['name', 'required'],
                                [['name', 'description'], 'string'],
                            ],
                        },
                        {
                            id: 'campaign',
                            component: this._stepCampaign,
                            validators: [
                                [['expireVoting', 'expireCrowd', 'expireWhale', 'targetWaves'], 'required'],
                                [['expireVoting', 'expireCrowd', 'expireWhale'], 'date'],
                                ['targetWaves', 'integer', {min: 1}],
                                ['expireCrowd', function(values, attribute) {
                                    if (values[attribute] && values.expireVoting && values[attribute] <= values.expireVoting) {
                                        return __('Crowdfunding date must be more than Voting');
                                    }
                                }],
                                ['expireWhale', function(values, attribute) {
                                    if (values[attribute] && values.expireCrowd && values[attribute] <= values.expireCrowd) {
                                        return __('Whale date must be more than Crowdfunding');
                                    }
                                }],
                            ],
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
                            validators: [
                                [SocialEnum.getKeys().map(id => `socials.url_${id}`), 'social'],
                            ],
                        },
                    ]}
                />
            </Modal>
        );
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
                            {__('Short Description')}
                        </label>
                    </div>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={props.isPhone ? __('Sort Description') : false}
                            attribute={'description'}
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
                                attribute='expireVoting'
                                label={__('Voting')}
                            />
                            <DateField
                                attribute='expireCrowd'
                                label={__('Crowdfunding')}
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
                                attribute='targetWaves'
                                placeholder={__('Enter Your Project Name')}
                            />
                            <DateField
                                attribute='expireWhale'
                                label={__('Whale date')}
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
                            attribute={'location'}
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
                            attribute={'contents.problem'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>

                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Solution'}
                            attribute={'contents.solution'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>

                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'X-Factor'}
                            attribute={'contents.xFactor'}
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
                            attribute={'contents.mvp'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Large Scale Adoption'}
                            attribute={'contents.largeScaleAdoption'}
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
                            attribute={'contents.impactOnUser'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Impact on User Context'}
                            attribute={'contents.impactOnUserContext'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Impact on User Society'}
                            attribute={'contents.impactOnUserSociety'}
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
                            attribute={'contents.codeValidation'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Legal Arrangements'}
                            attribute={'contents.legalArrangements'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Open-source strategy'}
                            attribute={'contents.openSourceStrategy'}
                            placeholder={__('Text')}
                        />
                    </div>
                </div>
                <div className={bem.element('form-row', 'margin-bottom')}>
                    <div className={bem.element('form-col-field')}>
                        <TextField
                            label={'Interconnectedness'}
                            attribute={'contents.interconnectedness'}
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
                {SocialEnum.getKeys().map(id => (
                    <div className={bem.element('form-row')}>
                        <div className={bem.element('form-col-label')}>
                            <label>
                                <span className={bem.element('form-col-label-icon')}>
                                    <span className={SocialEnum.getCssClass(id)}/>
                                </span>
                                <span>{SocialEnum.getLabel(id)}</span>
                            </label>
                        </div>
                        <div className={bem.element('form-col-field')}>
                            <InputField
                                attribute={`socials.url_${id}`}
                                label={props.isPhone ? SocialEnum.getLabel(id) : false}
                                placeholder={__('Enter URL')}
                            />
                        </div>
                    </div>
                ))}
            </>
        );
    }
}
