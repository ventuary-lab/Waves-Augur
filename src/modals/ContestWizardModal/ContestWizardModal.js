import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import Modal from 'yii-steroids/ui/modal/Modal';
import InputField from 'yii-steroids/ui/form/InputField';
import TextField from 'yii-steroids/ui/form/TextField';
import DateField from 'yii-steroids/ui/form/DateField';
import TagsField from 'ui/form/TagsField';

import {dal as Dal, html} from 'components';
const dal = Dal();

import FormWizard from 'ui/form/FormWizard';
import SocialEnum from 'enums/SocialEnum';
import ContestContentEnum from 'enums/ContestContentEnum';
import {goToPage} from 'yii-steroids/actions/navigation';
import {isPhone} from 'yii-steroids/reducers/screen';

import {ROUTE_CONTEST_DETAILS} from 'routes';

import './ContestWizardModal.scss';
import ContestSchema from 'types/ContestSchema';
import ImageField from '../../ui/form/ImageField';

const bem = html.bem('ContestWizardModal');
const FORM_ID = 'ContestWizardModal';

@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class ContestWizardModal extends React.PureComponent {

    static propTypes = {
        contest: ContestSchema,
    };

    constructor() {
        super(...arguments);

        this._stepContest = this._stepContest.bind(this);
        this._stepSocials = this._stepSocials.bind(this);
    }

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <FormWizard
                    formId={FORM_ID}
                    title={__('New Contest')}
                    onSubmit={values => {
                        return dal.saveContest(values)
                            .then(contest => {
                                this.props.dispatch(goToPage(ROUTE_CONTEST_DETAILS, {uid: contest.uid}));
                            });
                    }}
                    onComplete={() => {
                        this.props.onClose();
                    }}
                    initialValues={this.props.contest
                        ? {
                            uid: this.props.contest.uid,
                            name: this.props.contest.name,
                            description: this.props.contest.description,
                            logoUrl: this.props.contest.logoUrl,
                            coverUrl: this.props.contest.coverUrl,
                            coverSmallUrl: this.props.contest.coverSmallUrl,
                            expireEntries: this.props.contest.expireEntries,
                            expireImplementation: this.props.contest.expireImplementation,
                            rewardWaves: this.props.contest.rewardWaves,
                            tags: this.props.contest.tags,
                            contents: this.props.contest.contents,
                            socials: this.props.contest.socials,
                        }
                        : undefined
                    }
                    layout={'horizontal'}
                    items={[
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
                            id: 'images',
                            component: this._stepImages,
                            validators: [
                                [['logoUrl', 'coverUrl', 'coverSmallUrl'], 'required'],
                                [['logoUrl', 'coverUrl', 'coverSmallUrl'], 'string', {max: 250}],
                            ],
                        },
                        {
                            id: 'contest',
                            component: this._stepContest,
                            validators: [
                                [['expireEntries', 'expireImplementation', 'rewardWaves', 'tags'], 'required'],
                                [['expireEntries', 'expireImplementation'], 'date'],
                                ['rewardWaves', 'integer', {min: 1}],
                            ],
                        },
                        {
                            id: 'content',
                            component: this._stepContent,
                            validators: [
                                [['contents.appDescription', 'contents.theme', 'contents.screenDescription'], 'required'],
                                [['contents.appDescription', 'contents.theme', 'contents.screenDescription'], 'string', {min: 20, max: 500}],
                            ],
                        },
                        {
                            id: 'socials',
                            component: this._stepSocials,
                            validators: [
                                [['contents.links', 'socials.url_' + SocialEnum.WEBSITE, 'socials.url_' + SocialEnum.TWITTER], 'required'],
                                [['contents.links'], 'string', {min: 20, max: 250}],
                                ['socials.url_' + SocialEnum.TWITTER, 'social'],
                                [['socials.url_' + SocialEnum.WEBSITE, 'socials.url_' + SocialEnum.TWITTER], 'string', {max: 250}],
                            ],
                        },
                        {
                            id: 'platform',
                            component: this._stepPlatform,
                            validators: [
                                [['contents.deliverables', 'contents.platform'], 'required'],
                                [['contents.deliverables', 'contents.platform'], 'string', {min: 2, max: 250}],
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
                    {__('Please fill all necessary fields to add your contest')}
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

    _stepImages() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Please fill all necessary fields to add your contest')}
                </div>
                <ImageField
                    topLabel={__('Contest’s Logo')}
                    layout={'default'}
                    layoutClassName={bem.element('image')}
                    uploadApi={'/upload?crop=true'}
                    attribute='logoUrl'
                    title={__('Drop Your  Logo Here')}
                />
                <ImageField
                    topLabel={__('Full-size Cover')}
                    layout={'default'}
                    layoutClassName={bem.element('image')}
                    uploadApi={'/upload'}
                    attribute='coverUrl'
                    title={__('Drop Cover (1920x160 px)')}
                    isCover
                />
                <ImageField
                    topLabel={__('Small Cover (for preview cards)')}
                    layout={'default'}
                    layoutClassName={bem.element('image')}
                    uploadApi={'/upload'}
                    attribute='coverSmallUrl'
                    title={__('Drop Cover (190x67 px)')}
                    isCoverSmall
                />
            </>
        );
    }

    _stepContest() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Please fill all necessary fields to add your contest')}
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
                                attribute='expireEntries'
                                topLabel={__('End of the Period of Entires')}
                                disabled={!!this.props.contest}
                            />
                            <DateField
                                layout={'default'}
                                attribute='expireImplementation'
                                topLabel={__('Implementation Date')}
                                disabled={!!this.props.contest}
                            />
                        </div>
                    </div>
                </div>
                <InputField
                    label={__('Reward (WAVES)')}
                    topLabel={__('Waves') }
                    attribute='rewardWaves'
                    placeholder={7000}
                    disabled={!!this.props.contest}
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

    _stepContent() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Please fill all necessary fields to add your contest')}
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ContestContentEnum.getLabel(ContestContentEnum.APP_DESCRIPTION)}
                        attribute={'contents.appDescription'}
                        placeholder={ContestContentEnum.getPlaceholder(ContestContentEnum.APP_DESCRIPTION)}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ContestContentEnum.getLabel(ContestContentEnum.THEME)}
                        attribute={'contents.theme'}
                        placeholder={ContestContentEnum.getPlaceholder(ContestContentEnum.THEME)}
                        layout={'default'}
                    />
                </div>
                <div className={'form-row'}>
                    <TextField
                        topLabel={ContestContentEnum.getLabel(ContestContentEnum.SCREEN_DESCRIPTION)}
                        attribute={'contents.screenDescription'}
                        placeholder={ContestContentEnum.getPlaceholder(ContestContentEnum.SCREEN_DESCRIPTION)}
                        layout={'default'}
                    />
                </div>
            </>
        );
    }

    _stepSocials() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Please fill all necessary fields to add your awesome idea')}
                </div>
                <div className={bem.element('socials-block')}>
                    {[SocialEnum.FACEBOOK, SocialEnum.TWITTER, SocialEnum.TELEGRAM].map(socialId => (
                        <div key={socialId}>
                            <InputField
                                attribute={`socials.url_${socialId}`}
                                placeholder={__('Enter URL')}
                                layoutClassName={bem.element('socials')}
                                layoutProps={{
                                    align: 'left',
                                }}
                                topLabel={this.props.isPhone ? SocialEnum.getLabel(socialId) : ''}
                                label={!this.props.isPhone ? SocialEnum.getLabel(socialId) : ''}
                                labelIconClass={!this.props.isPhone ? SocialEnum.getCssClass(socialId) : ''}
                            />
                        </div>
                    ))}
                    <InputField
                        layoutClassName={bem.element('presentation')}
                        attribute={'socials.url_' + SocialEnum.WEBSITE}
                        placeholder={__('https://medium.com/ma......')}
                        layoutProps={{
                            align: 'left',
                        }}
                        label={!this.props.isPhone ? __('Presentation') : ''}
                        topLabel={this.props.isPhone ? __('Presentation') : ''}
                    />
                </div>
                <TextField
                    topLabel={__('Links / Files')}
                    attribute={'contents.links'}
                    placeholder={__('Paste URL to your Files, Peferences, etc. Use ‘Enter’ after each link')}
                    layout={'default'}
                />
            </>
        );
    }

    _stepPlatform() {
        return (
            <>
                <div className={bem.element('sub-title')}>
                    {__('Please fill all necessary fields to add your contest')}
                </div>
                <InputField
                    layout={'default'}
                    topLabel={__('Deliverables')}
                    attribute={'contents.deliverables'}
                    placeholder={__('Example: Full development or only UX/UI design, etc.')}
                />
                <InputField
                    layout={'default'}
                    topLabel={__('Platform')}
                    attribute={'contents.platform'}
                    placeholder={__('Example: Android, iOS')}
                />
            </>
        );
    }
}
