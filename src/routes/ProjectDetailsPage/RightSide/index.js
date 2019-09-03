import React from 'react';
import { html } from 'components';

import CopyToClipboard from 'shared/CopyToClipboard';
import SocialLinks from 'shared/SocialLinks';
import SvgIcon from 'ui/global/SvgIcon';

import rocketIcon from 'static/icons/rocket-icon-flying.svg';

import './index.scss';

function RightSide ({ parentName, socials }) {
    const bemRef = React.useRef(html.bem(`${parentName}RightSide`));
    const { current: bem } = bemRef;
 
    const rewardsExist = true;

    return (
        <div className={'col col_desk-reverse col_desk-count-5'}>
            <div className={bem.element('links')}>
                <div className={bem.element('social-links')}>
                    <SocialLinks
                        urls={socials}
                    />
                </div>
                <CopyToClipboard copyText={document.location.toString()}>
                    <button className={bem.element('share-link')}>{__('Share Project')}</button>
                </CopyToClipboard>
            </div>
            <div>
                <SvgIcon icon={rocketIcon} />
            </div>
        </div>
    )
}


export default React.memo(RightSide);