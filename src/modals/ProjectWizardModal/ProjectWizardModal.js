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

import FormWizard from 'ui/form/FormWizard';
import SocialEnum from 'enums/SocialEnum';
import ProjectContentEnum from 'enums/ProjectContentEnum';
import {goToPage} from 'yii-steroids/actions/navigation';
import {isPhone} from 'yii-steroids/reducers/screen';

import {ROUTE_PROJECT, ROUTE_PROJECT_FEED} from 'routes';

import './ProjectWizardModal.scss';
import ProjectSchema from 'types/ProjectSchema';

const bem = html.bem('ProjectWizardModal');
const FORM_ID = 'ProjectWizardModal';

@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class ProjectWizardModal extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    constructor() {
        super(...arguments);

        this._stepName = this._stepName.bind(this);
        this._stepProject = this._stepProject.bind(this);
        this._stepIdeaThreeContacts= this._stepIdeaThreeContacts.bind(this);
    }

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <FormWizard
                    formId={FORM_ID}
                    title={__('New Project')}
                    onSubmit={values => {
                        return dal.saveProject(values)
                            .then(project => {
                                this.props.dispatch(goToPage(ROUTE_PROJECT_FEED, {uid: project.uid}));
                            });
                    }}
                    onComplete={() => {
                        this.props.onClose();
                        AutoSaveHelper.remove(FORM_ID);
                    }}
                    initialValues={this.props.project
                        ? {
                            uid: this.props.project.uid,
                            name: this.props.project.name,
                            description: this.props.project.description,
                            logoUrl: this.props.project.logoUrl,
                            expireCrowd: this.props.project.expireCrowd,
                            targetWaves: this.props.project.targetWaves,
                            tags: this.props.project.tags,
                            contents: this.props.project.contents,
                            socials: this.props.project.socials,
                        }
                        : (
                            dal.isTestMode
                                ? {
                                    name: 'proj' + (new Date()).getTime(),
                                    description: 'Build Blockchain-related applications and uild applications ser',
                                    expireCrowd: moment().add(8, 'day').format('YYYY-MM-DD'),
                                    targetWaves: 10,
                                    tags: ['Consulting', 'RND', 'Analytics', 'Management', 'Research and Development'],
                                    socials: {
                                        url_twitter: 'https://twitter.com/MarsCuriosity',
                                    }
                                }
                                : undefined
                        )
                    }
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
                            validators: this.props.project ? [] : [
                                [['expireCrowd', 'targetWaves'], 'required'],
                                [['expireCrowd'], 'date'],
                                ['targetWaves', 'integer', {min: 1}],
                            ],
                        },
                        {
                            id: 'idea-one',
                            component: this._stepIdeaOne,
                        },
                        {
                            id: 'idea-two',
                            component: this._stepIdeaTwo,
                        },
                        {
                            id: 'idea-three-contacts',
                            component: this._stepIdeaThreeContacts,
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
                    {__('Please fill all necessary fields to add your awesome idea')}
                </div>
                <span className={bem(
                    bem.element('new-project-icon'),
                    'Icon Icon__new-project_lg')}
                />
                <InputField
                    layout={'default'}
                    topLabel={__('Your Project Name')}
                    attribute={'name'}
                    placeholder={__('Example: Coupon Bazaar')}
                />
                <TextField
                    layout={'default'}
                    topLabel={__('Sort Description')}
                    attribute={'description'}
                    placeholder={__('Example: Web3 coupon marketplace.  Coupon — is a digital asset which represents a special discount from ...')}
                />
            </>
        );
    }

    _stepProject() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Please fill all necessary fields to add your awesome idea')}
                </div>
                <ConnectImageField
                    topLabel={this.props.isPhone ? __('Logo URL') : ''}
                    label={!this.props.isPhone ? __('Logo URL') : ''}
                    attribute='logoUrl'
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
                                attribute='expireCrowd'
                                topLabel={__('Crowdfunding')}
                                disabled={!!this.props.project}
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
                                attribute='demoDay'
                                topLabel={__('Demo day')}
                            />
                        </div>
                    </div>
                </div>
                <TagsField
                    attribute='tags'
                    layoutClassName={bem.element('tags')}
                    topLabel={this.props.isPhone
                        ? __('Tags - Use ‘Enter’ to add a hashtag (5 tags max)')
                        : __('Use ‘Enter’ to add a hashtag (5 tags max)')
                    }
                    label={!this.props.isPhone ? __('Tags') : ''}
                    placeholder={__('Enter Tags')}
                    max={5}
                />
            </>
        );
    }

    _stepIdeaOne() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Please fill all necessary fields to add your awesome idea')}
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ProjectContentEnum.getLabel(ProjectContentEnum.PROBLEM)}
                        attribute={'contents.problem'}
                        placeholder={ProjectContentEnum.getPlaceholder(ProjectContentEnum.PROBLEM)}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ProjectContentEnum.getLabel(ProjectContentEnum.SOLUTION)}
                        attribute={'contents.solution'}
                        placeholder={ProjectContentEnum.getPlaceholder(ProjectContentEnum.SOLUTION)}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ProjectContentEnum.getLabel(ProjectContentEnum.X_FACTOR)}
                        attribute={'contents.xFactor'}
                        placeholder={ProjectContentEnum.getPlaceholder(ProjectContentEnum.X_FACTOR)}
                        layout={'default'}
                    />
                </div>
            </>
        );
    }

    _stepIdeaTwo() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Please fill all necessary fields to add your awesome idea')}
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ProjectContentEnum.getLabel(ProjectContentEnum.WHY_SMART_CONTRACTS)}
                        attribute={'contents.whySmartContracts'}
                        placeholder={ProjectContentEnum.getPlaceholder(ProjectContentEnum.WHY_SMART_CONTRACTS)}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ProjectContentEnum.getLabel(ProjectContentEnum.NEW_FEATURES_OR_MVP)}
                        attribute={'contents.newFeaturesOrMvp'}
                        placeholder={ProjectContentEnum.getPlaceholder(ProjectContentEnum.NEW_FEATURES_OR_MVP)}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ProjectContentEnum.getLabel(ProjectContentEnum.MARKET_STRATEGY)}
                        attribute={'contents.marketStrategy'}
                        placeholder={ProjectContentEnum.getPlaceholder(ProjectContentEnum.MARKET_STRATEGY)}
                        layout={'default'}
                    />
                </div>
            </>
        );
    }

    _stepIdeaThreeContacts() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Please fill all necessary fields to add your awesome idea')}
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ProjectContentEnum.getLabel(ProjectContentEnum.IMPACT_ON_COMMUNITY)}
                        attribute={'contents.impactOnCommunity'}
                        placeholder={ProjectContentEnum.getPlaceholder(ProjectContentEnum.IMPACT_ON_COMMUNITY)}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ProjectContentEnum.getLabel(ProjectContentEnum.CURRENT_STAGE)}
                        attribute={'contents.currentStage'}
                        placeholder={ProjectContentEnum.getPlaceholder(ProjectContentEnum.CURRENT_STAGE)}
                        layout={'default'}
                    />
                </div>
                <InputField
                    layoutClassName={bem.element('presentation')}
                    attribute={'presentationUrl'}
                    placeholder={__('https://medium.com/ma......')}
                    label={!this.props.isPhone ? __('Presentation') : ''}
                    topLabel={this.props.isPhone ? __('Presentation') : ''}
                />
                <InputField
                    attribute={'socials.url_twitter'}
                    placeholder={__('https://medium.com/ma......')}
                    topLabel={this.props.isPhone ? SocialEnum.getLabel(SocialEnum.TWITTER) : ''}
                    label={!this.props.isPhone ? SocialEnum.getLabel(SocialEnum.TWITTER) : ''}
                    labelIconClass={!this.props.isPhone ? SocialEnum.getCssClass(SocialEnum.TWITTER) : ''}
                />

            </>
        );
    }
}
