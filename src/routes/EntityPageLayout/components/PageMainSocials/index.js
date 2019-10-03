import React from 'react';
import SvgIcon from 'ui/global/SvgIcon';

const facebookIcon = require('!svg-inline-loader?classPrefix!static/icons/custom-outline/facebook.svg');
const linkedinIcon = require('!svg-inline-loader?classPrefix!static/icons/custom-outline/linkedin.svg');
const twitterIcon = require('!svg-inline-loader?classPrefix!static/icons/custom-outline/twitter.svg');


const socialsKeyToIconMapping = {
    facebook: facebookIcon,
    linkedin: linkedinIcon,
    twitter: twitterIcon,
};
function PageMainSocials (props) {
    const { links = {} } = props;
    const mappedIcons = [];
    const keys = Object.keys(links);

    for (const key of keys) {
        const val = links[key];
        const socialIcon = socialsKeyToIconMapping[key];

        if (!val || !socialIcon) {
            continue;
        };

        const comp = (
            <div>
                <a href={val}>
                    <SvgIcon icon={socialIcon}/>
                </a>
            </div>
        );

        mappedIcons.push(comp);
    }

    return (
        <>
            <span></span>
            <div>{mappedIcons}</div>
        </>
    );
}

export default PageMainSocials;