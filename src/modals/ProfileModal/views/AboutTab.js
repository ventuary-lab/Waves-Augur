import React from 'react';
import InputField from 'yii-steroids/ui/form/InputField';

import {html} from 'components';
import TagsField from 'ui/form/TagsField';
import ConnectImageField from 'ui/form/ConnectImageField';

const bem = html.bem('AboutTab');

export default class AboutTab extends React.Component {

    render() {
        return (
            <div className={bem.block()}>
                <h3>About tab</h3>
                <span>Add More Information about yourself</span>
                <div className={bem.element('grid')}>
                    <ConnectImageField
                        attribute='avatar'
                        label={__('Avatar URL')}
                    />
                    <InputField
                        attribute='title'
                        label={__('Your Occupation')}
                        placeholder={__('Enter')}
                    />
                    <TagsField
                        attribute='tags'
                        label={__('Tags')}
                        placeholder={__('Enter')}
                        hint={__('Use ‘Enter’ to add a hashtag (10 max)')}
                        max={10}
                    />
                    <InputField
                        attribute='location'
                        label={__('Your Country')}
                        placeholder={__('Enter')}
                    />
                </div>
            </div>
        );
    }
}
