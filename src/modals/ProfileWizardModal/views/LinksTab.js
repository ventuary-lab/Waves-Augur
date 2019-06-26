import React from 'react';
import InputField from 'yii-steroids/ui/form/InputField';

import {html} from 'components';
import SocialEnum from 'enums/SocialEnum';

const bem = html.bem('LinksTab');

import './LinksTab.scss';

export default class LinksTab extends React.PureComponent {
    render() {
        return (
            <div className={bem.block()}>
                <h3>Links</h3>
                <span>Connect With Your Social Media To Get More Coverage</span>
                <div className={bem.element('grid')}>
                    {SocialEnum.getKeys().map(socialId => (
                        <div key={socialId}>
                            <span>{SocialEnum.getLabel(socialId)}</span>
                            <InputField
                                attribute={`socials.url_${socialId}`}
                                placeholder={__('Enter URL')}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
