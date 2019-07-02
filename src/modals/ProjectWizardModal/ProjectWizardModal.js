import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import Modal from 'yii-steroids/ui/modal/Modal';
import InputField from 'yii-steroids/ui/form/InputField';
import TextField from 'yii-steroids/ui/form/TextField';
import DateField from 'yii-steroids/ui/form/DateField';
import TagsField from 'ui/form/TagsField';
import ConnectImageField from 'ui/form/ConnectImageField';
import AutoSaveHelper from 'yii-steroids/ui/form/Form/AutoSaveHelper';

import {dal, html} from 'components';

import './ProjectWizardModal.scss';
import FormWizard from 'ui/form/FormWizard';
import SocialEnum from 'enums/SocialEnum';
import {goToPage} from 'yii-steroids/actions/navigation';
import {ROUTE_PROJECT} from 'routes';

const bem = html.bem('ProjectWizardModal');
const FORM_ID = 'ProjectWizardModal';

@connect()
export default class ProjectWizardModal extends React.PureComponent {

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <FormWizard
                    formId={FORM_ID}
                    onSubmit={values => {
                        return dal.saveProject(values)
                            .then(project => {
                                this.props.dispatch(goToPage(ROUTE_PROJECT, {uid: project.uid}));
                            });
                    }}
                    onComplete={() => {
                        this.props.onClose();
                        AutoSaveHelper.remove(FORM_ID);
                    }}
                    initialValues={!dal.isTestMode ? undefined : {
                        name: 'proj' + (new Date()).getTime(),
                        description: 'Build Blockchain-related applications and uild applications ser',
                        expireVoting: moment().add(4, 'day').format('YYYY-MM-DD'),
                        expireCrowd: moment().add(8, 'day').format('YYYY-MM-DD'),
                        expireWhale: moment().add(12, 'day').format('YYYY-MM-DD'),
                        targetWaves: 10,
                        tags: ['Consulting', 'RND', 'Analytics', 'Management', 'Research and Development'],
                        location: 'Russia',
                        socials: {
                            url_twitter: 'https://twitter.com/MarsCuriosity',
                        }
                    }}
                    autoSave
                    layout={'horizontal'}
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
                            id: 'project',
                            component: this._stepProject,
                            validators: [
                                [['expireVoting', 'expireCrowd', 'expireWhale', 'targetWaves'], 'required'],
                                [['expireVoting', 'expireCrowd', 'expireWhale'], 'date'],
                                ['targetWaves', 'integer', {min: 1}],
                                ['expireVoting', function(values, attribute) {
                                    if (values[attribute] && values[attribute] <= moment().format('YYYY-MM-DD')) {
                                        return __('Voting date must be in future');
                                    }
                                }],
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
                                ['socials.url_' + SocialEnum.TWITTER, 'required'],
                                [SocialEnum.getKeys().map(id => `socials.url_${id}`), 'social'],
                            ],
                        },
                    ]}
                />
            </Modal>
        );
    }

    _stepName() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('You Need To Give All Necessary Information About It')}
                </div>
                <span className={bem(
                    bem.element('new-project-icon'),
                    'Icon Icon__new-project_lg')}
                />
                <InputField
                    label={__('Project Name')}
                    attribute={'name'}
                    placeholder={__('Enter Your Project Name')}
                />
                <TextField
                    label={__('Sort Description')}
                    attribute={'description'}
                    placeholder={__('Description')}
                />
            </>
        );
    }

    _stepProject() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Project Details')}
                </div>
                <ConnectImageField
                    label={__('Logo URL')}
                    attribute='logoUrl'
                    placeholder={__('Enter URL')}
                />
                <ConnectImageField
                    label={__('Cover URL')}
                    attribute='coverUrl'
                    placeholder={__('Enter URL')}
                />
                <div className={'form-row'}>
                    <div className={'form-label-col'}>
                        <label>
                            {__('Deadlines')}
                        </label>
                    </div>
                    <div className={'form-field-col'}>
                        <div className={bem.element('dates-fields')}>
                            <DateField
                                layout={'default'}
                                attribute='expireVoting'
                                topLabel={__('Voting')}
                            />
                            <DateField
                                layout={'default'}
                                attribute='expireCrowd'
                                topLabel={__('Crowdfunding')}
                            />
                        </div>
                    </div>
                </div>
                <div className={'form-row'}>
                    <div className={'form-label-col'}>
                        <label>
                            {__('Target (Waves)')}
                        </label>
                    </div>
                    <div className={'form-field-col'}>
                        <div className={bem.element('dates-fields')}>
                            <InputField
                                topLabel={__('Waves') }
                                attribute='targetWaves'
                                placeholder={__('Enter Your Project Name')}
                                layout={'default'}
                            />
                            <DateField
                                layout={'default'}
                                attribute='expireWhale'
                                topLabel={__('Whale date')}
                            />
                        </div>
                    </div>
                </div>
                <TagsField
                    attribute='tags'
                    label={__('Tags')}
                    topLabel={__('Use ‘Enter’ to add a hashtag')}
                    placeholder={__('Enter Tags')}
                />
                <InputField
                    label={__('Your Country')}
                    attribute={'location'}
                    placeholder={__('Enter')}
                />
            </>
        );
    }

    _stepIdeaProblem() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Project Details')}
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Problem'}
                        attribute={'contents.problem'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Solution'}
                        attribute={'contents.solution'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'X-Factor'}
                        attribute={'contents.xFactor'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
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
                <div className={'form-row'}>
                    <TextField
                        topLabel={'MVP'}
                        attribute={'contents.mvp'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Large Scale Adoption'}
                        attribute={'contents.largeScaleAdoption'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
            </>
        );
    }

    _stepIdeaImpact() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Idea Canvas')}
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Impact on User'}
                        attribute={'contents.impactOnUser'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Impact on User Context'}
                        attribute={'contents.impactOnUserContext'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Impact on User Society'}
                        attribute={'contents.impactOnUserSociety'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
            </>
        );
    }

    _stepIdeaCode() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Idea Canvas')}
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Code Validation'}
                        attribute={'contents.codeValidation'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Legal Arrangements'}
                        attribute={'contents.legalArrangements'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Open-source strategy'}
                        attribute={'contents.openSourceStrategy'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={'Interconnectedness'}
                        attribute={'contents.interconnectedness'}
                        placeholder={__('Text')}
                        layout={'default'}
                    />
                </div>
            </>
        );
    }

    _stepContacts() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Contacts')}
                </div>
                {SocialEnum.getKeys().map(id => (
                    <InputField
                        key={id}
                        attribute={`socials.url_${id}`}
                        label={SocialEnum.getLabel(id)}
                        labelIconClass={SocialEnum.getCssClass(id)}
                        placeholder={__('Enter URL')}
                        layout={'horizontal'}
                    />
                ))}
            </>
        );
    }
}
