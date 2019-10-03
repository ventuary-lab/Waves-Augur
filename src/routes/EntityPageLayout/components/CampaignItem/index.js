import React from 'react';
import SvgIcon from 'ui/global/SvgIcon';
import { html } from 'components';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';

const usdnIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/usdn.svg');
const bookmarkIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/bookmark.svg');
const cupIcon = require('!svg-inline-loader?classPrefix!static/icons/campaign/cup.svg');

const bem = html.bem('CampaignItem');

import './index.scss';

function AchievementBadge ({ icon, title, desc, ...restProps }) {
    return (
        <div {...restProps} className={bem.element('achievement-badge')}>
            <div>
                <h3>{title}</h3>
                <SvgIcon icon={icon}/>
            </div>
            <span>{desc}</span>
        </div>
    )
}

function CampaignItem () {
    return (
        <div className={bem.element('root')}>
            <div className={bem.element('avatar')}>
                <img src={anonymousAvatarStub}/>
            </div>
            <div className={bem.element('info')}>
                <span>Ended</span>
                <h4>Cryptopolis ('Monopoly' game)</h4>
                <span>This is a blockchain game based on Waves smart contracts.</span>
                <div className={bem.element('achievements-cont')}>
                    <AchievementBadge icon={usdnIcon} title='12k+' desc='funded'/>
                </div>
            </div>
            <div className={bem.element('bookmark')}>
                <SvgIcon icon={bookmarkIcon}/>
            </div>
        </div>
    );
}

export default CampaignItem;