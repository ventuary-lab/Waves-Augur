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

function BaseButton ({ children, icon = '', ...restProps }) {

    return (
        <div className={bem.element('base-button')}>
            <SvgIcon icon={icon} /> 
            <button {...restProps}>{children}</button>
        </div>
    );
}

function EntityBadge ({ title, desc, icon }) {
    return (
        <div className={bem.element('ent-badge')}>
            <SvgIcon icon={icon} /> 
            <div>{title}</div>
            <div>{desc}</div>
        </div>
    )
}

class EntityPageLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme: 'dark',
            tabIndex: 0
        };
    }

    render () {
        return (
            <div className={bem.element('root')}>
                <div className={bem.element('heading')}>
                    <BaseButton icon={warningIcon}>Report</BaseButton>
                    <img src={coverImg}/>
                    <div className={bem.element('heading-cover')}></div>
                </div>
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
                            <EntityBadge icon={rocketIcon} title='1' desc='Lorem ipsum'/>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        );
    }
}


export default EntityPageLayout;