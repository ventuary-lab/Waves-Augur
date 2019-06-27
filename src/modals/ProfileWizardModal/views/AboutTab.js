import React from 'react';
import InputField from 'yii-steroids/ui/form/InputField';

import {html} from 'components';
import TagsField from 'ui/form/TagsField';
import ConnectImageField from 'ui/form/ConnectImageField';


import './AboutTab.scss';
const bem = html.bem('AboutTab');

export default class AboutTab extends React.Component {

    render() {
        return (
            <div className={bem.block()}>
                <h3 className={bem.element('title')}>{__('About tab')}</h3>
                <div className={bem.element('sub-title')}>
                    {__('Add More Information about yourself')}
                </div>
                <div className={bem.element('grid')}>
                    <ConnectImageField
                        attribute='avatar'
                        label={__('Avatar URL')}
                        layout={'horizontal'}
                    />
                    <InputField
                        attribute='title'
                        label={__('Your Occupation')}
                        placeholder={__('Enter')}
                        layout={'horizontal'}
                    />
                    <TagsField
                        attribute='tags'
                        label={__('Tags')}
                        placeholder={__('Enter')}
                        hint={__('Use ‘Enter’ to add a hashtag (10 max)')}
                        max={10}
                        layout={'horizontal'}
                    />
                    <InputField
                        attribute='location'
                        label={__('Your Country')}
                        placeholder={__('Enter')}
                        layout={'horizontal'}
                    />
                </div>
            </div>
        );
    }
}
