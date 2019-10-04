import React from 'react';
import { html } from 'components';
import SvgIcon from 'ui/global/SvgIcon';
import coverAvatar from 'static/images/default/campaign_avt.png';
import coverImg from 'static/images/default/campaign_cover.png';
import campaignDetailsImgOne from 'static/images/default/campaign_details-1.png';
import campaignDetailsImgTwo from 'static/images/default/campaign_details-2.png';

const warningIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/warning.svg');
const rocketIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/rocket.svg');
const starIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/star.svg');
const cupIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/cup.svg');
const bookmarkIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/bookmark.svg');
const shareIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/share.svg');

const bem = html.bem('EntityPageLayout');

import CampaignItem from './components/CampaignItem';
import InfoBlock from './components/InfoBlock';
import PageTeamMember from './components/PageTeamMember';
import PageMainSocials from './components/PageMainSocials';

import './index.scss';

function BaseButton ({ children, icon, className, ...restProps }) {
    const classList = [bem.element('base-button'), className].filter(Boolean).join(' ');

    return (
        <div className={classList}>
            {icon && <SvgIcon icon={icon} />}
            <button {...restProps}>{children}</button>
        </div>
    );
}

function EntityBadge ({ title, desc, icon }) {
    return (
        <div className={bem.element('ent-badge')}>
            <div>
                <SvgIcon icon={icon} /> 
            </div>
            <div>
                <div>{title}</div>
                <div>{desc}</div>
            </div>
        </div>
    );
}

function SmallTag ({ text, ...restProps }) {
    return (
        <div {...restProps} className={bem.element('small-tag')}>
            {text}
        </div>
    );
}


function PageMainInfo (props) {
    const { foundDate, location } = props;

    return (
        <>
            <div className={bem.element('page-info-li')}>
                <h4>Location</h4>
                <span>{location}</span>
            </div>
            <div className={bem.element('page-info-li')}>
                <h4>Founded</h4>
                <span>{foundDate}</span>
            </div>
            <div className={bem.element('page-info-tags')}>
                <SmallTag text='stablecoin'/>
                <SmallTag text='collaterization'/>
                <SmallTag text='bonds usd'/>
                <SmallTag text='token'/>
                <SmallTag text='WAVES'/>
            </div>
        </>
    );
}


export const DETAILS_TAB = 0;
export const CAMPAIGN_TAB = 1;
export const NEWS_TAB = 2;

class EntityPageLayout extends React.Component {
    constructor(props) {
        super(props);

        this._mapTab = this._mapTab.bind(this);
        this._setTab = this._setTab.bind(this);
        this._getTeamMembers = this._getTeamMembers.bind(this);
        this._getCampaignView = this._getCampaignView.bind(this);
        this._getDetailsView = this._getDetailsView.bind(this);
        this._getNewsView = this._getNewsView.bind(this);
        this._getCurrentView = this._getCurrentView.bind(this);

        this.tabs = [
            { label: 'Details' },
            { label: 'Campaign' },
            { label: 'News' }
        ];

        this.state = {
            // theme: 'dark',
            theme: 'light',
            tabIndex: 0
        };
    }

    _setTab (tabIndex) {
        this.setState({ tabIndex });
    }

    _mapTab (tabItem, tabIndex) {
        const isCurrent = this.state.tabIndex === tabIndex ? 'selected' : '';

        return (
            <div key={tabItem.label} onClick={() => this._setTab(tabIndex)} className={isCurrent}>
                <a>{tabItem.label}</a>
            </div>
        );
    }

    _getTeamMembers () {
        return [
            { title: 'James May', desc: 'Node Developer' },
            { title: 'James May', desc: 'Node Developer' },
            { title: 'James May', desc: 'Node Developer' },
            { title: 'James May', desc: 'Node Developer' },
        ].map(item => (
            <PageTeamMember
                isAdmin={true}
                title={item.title}
                desc={item.desc}
            />
        ));
    };

    _getCampaignView () {
        return (
            <>
                <CampaignItem/>
                <CampaignItem/>
                <CampaignItem/>
            </>
        );
    }

    _getNewsView () {
        return null;
    }

    _getDetailsView () {
        const text = (
            <>
                <h4>Who we are</h4>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
                    mollit anim id est laborum.
                </p>
            </>
        );

        return (
            <div className={bem.element('details')}>
                <InfoBlock title='ABOUT'>
                    <div>
                        {text}
                        {text}
                        <div>
                            <img src={campaignDetailsImgOne}/>
                        </div>
                        {text}
                        <div>
                            <img src={campaignDetailsImgTwo}/>
                        </div>
                    </div>
                </InfoBlock>
            </div>
        )
    }

    _getCurrentView () {
        const { tabIndex } = this.state;

        switch (tabIndex) {
            case 0:
                return this._getDetailsView();
            case 1:
                return this._getCampaignView();
            case 2:
                return this._getNewsView();
            default:
                return null;
        }
    }

    render () {
        const pageTabs = this.tabs.map(this._mapTab);
        const teamMembers = this._getTeamMembers();
        const associatedPages = this._getTeamMembers();

        return (
            <div className={bem.element('root')}>
                <div className={bem.element('heading')}>
                    <BaseButton icon={warningIcon}>Report</BaseButton>
                    <img src={coverImg}/>
                    <div className={bem.element('heading-cover')}></div>
                </div>
                <div className={bem.element('head-cont')}>
                    <div className={bem.element('head-info')}>
                        <div>
                            <img src={coverAvatar} />
                        </div>
                        <div>
                            <span>Ventuary LAB</span>
                            <span>LIGA is a platform with tokenized sport events, 
                                enabling you to deal with real-time rates and 
                                to trade your personal predictions with others
                            </span>
                            <div>
                                <EntityBadge icon={rocketIcon} title='1' desc='grans won'/>
                                <EntityBadge icon={cupIcon} title='51' desc='cups won'/>
                                <EntityBadge icon={starIcon} title='231' desc='reviews'/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <BaseButton className='green'>Contribute</BaseButton>
                    </div>
                </div>

                <div className={bem.element('actions-tab')}>
                    <div className={bem.element('tabs-flex')}>
                        {pageTabs}
                    </div>
                    <div>
                        <BaseButton icon={bookmarkIcon} className='grey'>Save</BaseButton>
                        <BaseButton icon={shareIcon} className='grey'>Share</BaseButton>
                    </div>
                </div>

                <div className={bem.element('page-body')}>
                    <div className={bem.element('body-flex')}>
                        <div className={bem.element('main-body')}>
                            {this._getCurrentView()}
                        </div>
                        <div className={bem.element('side-body')}>
                            <InfoBlock title='INFO'>
                                <PageMainInfo
                                    location='Moscow'
                                    foundDate='27.04.22'
                                />
                            </InfoBlock>
                            <InfoBlock title='CONTACTS'>
                                <PageMainSocials
                                    url='https://ventuary.com/profiles/immla/'
                                    links={{
                                        twitter: '#',
                                        facebook: '#',
                                        linkedin: '#',
                                    }}
                                />
                            </InfoBlock>
                            <InfoBlock title='TEAM MEMBERS'>
                                {teamMembers}
                            </InfoBlock>
                            <InfoBlock title='ASSOCIATED PAGES'>
                                {associatedPages}
                            </InfoBlock>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default EntityPageLayout;