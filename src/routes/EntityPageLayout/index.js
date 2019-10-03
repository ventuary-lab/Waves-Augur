import React from 'react';
import { html } from 'components';
import SvgIcon from 'ui/global/SvgIcon';
import coverAvatar from 'static/images/default/campaign_avt.png';
import coverImg from 'static/images/default/campaign_cover.png';
// const dottedAddIcon = require('!svg-inline-loader?classPrefix!static/icons/dotted-add-icon.svg');
const warningIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/warning.svg');
const rocketIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/rocket.svg');
const starIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/star.svg');
const cupIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/cup.svg');

const bem = html.bem('EntityPageLayout');

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

export const DETAILS_TAB = 0;
export const CAMPAIGN_TAB = 1;
export const NEWS_TAB = 2;

class EntityPageLayout extends React.Component {
    constructor(props) {
        super(props);

        this._mapTab = this._mapTab.bind(this);
        this._setTab = this._setTab.bind(this);

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
        )
    }

    render () {
        const pageTabs = this.tabs.map(this._mapTab);

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
                        <BaseButton icon={warningIcon} className='grey'>Save</BaseButton>
                        <BaseButton icon={warningIcon} className='grey'>Share</BaseButton>
                    </div>
                </div>

                <div></div>
            </div>
        );
    }
}


export default EntityPageLayout;