import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import InputField from 'yii-steroids/ui/form/InputField';
import TextField from 'yii-steroids/ui/form/TextField';
import DateField from 'yii-steroids/ui/form/DateField';
import TagsField from 'ui/form/TagsField';
import ImageField from 'ui/form/ImageField';
import ImagePreviewsField from 'ui/form/ImagePreviewsField';

import {dal, html} from 'components';

import FormWizard from 'ui/form/FormWizard';
import SocialEnum from 'enums/SocialEnum';
import ProjectContentEnum from 'enums/ProjectContentEnum';
import {goToPage} from 'yii-steroids/actions/navigation';
import {isPhone} from 'yii-steroids/reducers/screen';

import {ROUTE_PROJECT_FEED} from 'routes';

import './ProjectWizard.scss';
import ProjectSchema from 'types/ProjectSchema';

const bem = html.bem('ProjectWizard');
const FORM_ID = 'ProjectWizard';

const FORM_FIELD_PREVIEW = 'previews';
@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class ProjectWizard extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
        contest: PropTypes.string,
        onFirstBack: PropTypes.func,
    };

    constructor() {
        super(...arguments);

        this._stepName = this._stepName.bind(this);
        this._stepProject = this._stepProject.bind(this);
        this._stepIdeaThreeContacts= this._stepIdeaThreeContacts.bind(this);
        this._onNextClick = this._onNextClick.bind(this);
        this._getItems = this._getItems.bind(this);
        this._updateFormTitle = this._updateFormTitle.bind(this);

        this.defaultFormTitle = 'New Project';

        this.uniqueTabTitlesMap = new Map([
            [FORM_FIELD_PREVIEW, 'Upload your projects’s previews']
        ]);

        this.state = {
            formTitle: this._updateFormTitle(0)
        };
    } 

    _updateFormTitle (index) {
        const items = this._getItems();
        const currentTab = items[index];

        if (!currentTab) {
            return this.defaultFormTitle;
        };

        const tabTitle = this.uniqueTabTitlesMap.get(currentTab.id);

        if (!tabTitle) {
            return this.defaultFormTitle;
        };

        return tabTitle;
    }

    _onNextClick (newIndex) {
        const updatedTitle = this._updateFormTitle(newIndex);
        this.setState({ formTitle: updatedTitle });
    }

    _getItems () {
        return [

            {
                id: FORM_FIELD_PREVIEW,
                component: this._stepPreviews,
                validators: []
            },
            {
                id: 'name',
                component: this._stepName,
                validators: [
                    [['name', 'description'], 'required'],
                    [['name'], 'string', {min: 3, max: 150}],
                    [['description'], 'string', {min: 10, max: 250}],
                ],
            },
            {
                id: 'project',
                component: this._stepProject,
                validators: [
                    [['expireCrowd', 'demoDay', 'targetWaves', 'tags'], 'required'],
                    [['expireCrowd', 'demoDay'], 'date'],
                    ['targetWaves', 'integer', {min: 1}],
                ],
            },
            // {
            //     id: FORM_FIELD_PREVIEW,
            //     component: this._stepPreviews,
            //     validators: []
            // },
            {
                id: 'logo',
                component: this._stepLogo,
                validators: [
                    // ['logoUrl', 'required'],
                    ['logoUrl', 'string'],
                ],
            },
            {
                id: 'idea-one',
                component: this._stepIdeaOne,
                validators: [
                    [['contents.problem', 'contents.solution', 'contents.xFactor'], 'required'],
                    [['contents.problem', 'contents.solution', 'contents.xFactor'], 'string', {min: 20, max: 500}],
                ],
            },
            {
                id: 'idea-two',
                component: this._stepIdeaTwo,
                validators: [
                    [['contents.whySmartContracts', 'contents.newFeaturesOrMvp', 'contents.marketStrategy'], 'required'],
                    [['contents.whySmartContracts', 'contents.newFeaturesOrMvp'], 'string', {min: 20, max: 500}],
                    ['contents.marketStrategy', 'string', {min: 20, max: 250}],
                ],
            },
            {
                id: 'idea-three-contacts',
                component: this._stepIdeaThreeContacts,
                validators: [
                    [['contents.impactOnCommunity', 'contents.currentStage', 'socials.url_' + SocialEnum.WEBSITE, 'socials.url_' + SocialEnum.TWITTER], 'required'],
                    [['contents.impactOnCommunity', 'contents.currentStage'], 'string', {min: 20, max: 250}],
                    ['socials.url_' + SocialEnum.TWITTER, 'social'],
                    [['socials.url_' + SocialEnum.WEBSITE, 'socials.url_' + SocialEnum.TWITTER], 'string', {max: 250}],
                ],
            },
        ];
    }

    render() {
        const { formTitle } = this.state;

        return (
            <div className={bem.block()}>
                <FormWizard
                    formId={FORM_ID}
                    title={__(formTitle)}
                    onNextClick={this._onNextClick}
                    onSubmit={values => {
                        return dal.saveProject(values, this.props.contest)
                            .then(project => {
                                this.props.dispatch(goToPage(ROUTE_PROJECT_FEED, {uid: project.uid}));
                            });
                    }}
                    onFirstBack={this.props.onFirstBack}
                    onComplete={() => {
                        this.props.onClose();
                    }}
                    initialValues={this.props.project
                        ? {
                            uid: this.props.project.uid,
                            name: this.props.project.name,
                            description: this.props.project.description,
                            logoUrl: this.props.project.logoUrl,
                            expireCrowd: this.props.project.expireCrowd,
                            demoDay: this.props.project.demoDay,
                            targetWaves: this.props.project.targetWaves,
                            tags: this.props.project.tags,
                            contents: this.props.project.contents,
                            socials: this.props.project.socials,
                            previews: this.props.project.previews,
                        }
                        : undefined
                    }
                    layout={'horizontal'}
                    items={this._getItems()}
                />
            </div>
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
                                topLabel={__('Crowdfunding ends')}
                                disabled={!!this.props.project}
                            />
                            <DateField
                                layout={'default'}
                                attribute='demoDay'
                                topLabel={__('Demo day')}
                            />
                        </div>
                    </div>
                </div>
                <InputField
                    label={__('Target (Waves)')}
                    topLabel={__('Waves') }
                    attribute='targetWaves'
                    placeholder={7000}
                    disabled={!!this.props.project}
                />
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

    _stepPreviews () {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('10 images max. Recomended size 950x620 px, .jpg, .png, .svg')}
                </div>
                <ImagePreviewsField
                    layout={'default'}
                    uploadApi={'/upload?crop=false'}
                    attribute='previews'
                />
            </>
        );
    }

    _stepLogo() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Add Project Logo')}
                </div>
                <ImageField
                    layout={'default'}
                    uploadApi={'/upload?crop=true'}
                    attribute='logoUrl'
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
                    attribute={'socials.url_' + SocialEnum.WEBSITE}
                    placeholder={__('https://medium.com/ma......')}
                    label={!this.props.isPhone ? __('Presentation') : ''}
                    topLabel={this.props.isPhone ? __('Presentation') : ''}
                />
                <InputField
                    attribute={'socials.url_' + SocialEnum.TWITTER}
                    placeholder={__('https://twitter.com/ma......')}
                    topLabel={this.props.isPhone ? SocialEnum.getLabel(SocialEnum.TWITTER) : ''}
                    label={!this.props.isPhone ? SocialEnum.getLabel(SocialEnum.TWITTER) : ''}
                    labelIconClass={!this.props.isPhone ? SocialEnum.getCssClass(SocialEnum.TWITTER) : ''}
                />

            </>
        );
    }
}
