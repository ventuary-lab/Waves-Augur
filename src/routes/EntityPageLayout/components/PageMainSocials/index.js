import React from 'react';
import { html } from 'components';

const bem = html.bem('PageMainSocials');

import './index.scss';

import facebookIcon from 'static/icons/custom-outline/facebook.svg';
import linkedinIcon from 'static/icons/custom-outline/linkedin.svg';
import twitterIcon from 'static/icons/custom-outline/twitter.svg';

const socialsKeyToIconMapping = {
    facebook: facebookIcon,
    linkedin: linkedinIcon,
    twitter: twitterIcon,
};
function PageMainSocials (props) {
    const { links = {}, url } = props;
    const keys = Object.keys(links);

    const mapFunc = key => {
        const val = links[key];
        const socialIcon = socialsKeyToIconMapping[key];

        return (
            <div>
                <a href={val}>
                    <img src={socialIcon}/>
                </a>
            </div>
        );
    };

    const mappedIcons = keys
        .filter(key => links[key])
        .map(mapFunc);

    return (
        <>
            <span className={bem.element('url')}>
                {url && <a href={url}>{url}</a>}
            </span>
            <div className={bem.element('icons')}>{mappedIcons}</div>
        </>
    );
}

export default PageMainSocials;