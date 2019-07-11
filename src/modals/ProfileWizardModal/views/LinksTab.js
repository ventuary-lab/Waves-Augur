import React from 'react';
import {connect} from 'react-redux';

import InputField from 'yii-steroids/ui/form/InputField';
import {isPhone} from 'yii-steroids/reducers/screen';

import {html} from 'components';

import SocialEnum from 'enums/SocialEnum';
const bem = html.bem('LinksTab');
import './LinksTab.scss';

@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
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
                            placeholder={__('Enter URL')}
                            layout={'horizontal'}
                            layoutProps={{
                                align: 'left',
                            }}
                            topLabel={this.props.isPhone ? SocialEnum.getLabel(socialId) : ''}
                            label={!this.props.isPhone ? SocialEnum.getLabel(socialId) : ''}
                            labelIconClass={!this.props.isPhone ? SocialEnum.getCssClass(socialId) : ''}
                        />
                    </div>
                ))}
            </div>
        );
    }
}
