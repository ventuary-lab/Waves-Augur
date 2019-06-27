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
                <h3 className={bem.element('title')}>{__('Links')}</h3>
                <div className={bem.element('sub-title')}>
                    {__('Connect With Your Social Media To Get More Coverage')}
                </div>
                {SocialEnum.getKeys().map(socialId => (
                    <div key={socialId}>
                        <InputField
                            attribute={`socials.url_${socialId}`}
                            label={SocialEnum.getLabel(socialId)}
                            labelIconClass={SocialEnum.getCssClass(socialId)}
                            placeholder={__('Enter URL')}
                            layout={'horizontal'}
                        />
                    </div>
                ))}
            </div>
        );
    }
}
