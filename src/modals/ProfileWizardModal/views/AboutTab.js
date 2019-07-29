import React from 'react';
import {connect} from 'react-redux';
import InputField from 'yii-steroids/ui/form/InputField';
import {isPhone} from 'yii-steroids/reducers/screen';

import {html} from 'components';
import TagsField from 'ui/form/TagsField';
import ConnectImageField from 'ui/form/ConnectImageField';


import './AboutTab.scss';

const bem = html.bem('AboutTab');

@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class AboutTab extends React.Component {

    render() {
        return (
            <div className={bem.block()}>
                <h3 className={bem.element('title')}>{__('About')}</h3>
                <div className={bem.element('sub-title')}>
                    {__('Add More Information about yourself')}
                </div>
                <div className={bem.element('grid')}>
                    <InputField
                        attribute='title'
                        topLabel={this.props.isPhone ? __('Your Occupation') : ''}
                        label={!this.props.isPhone ? __('Your Occupation') : ''}
                        placeholder={__('Enter Your Occupation / Specialty')}
                        layout={'horizontal'}
                    />
                    <TagsField
                        attribute='tags'
                        label={!this.props.isPhone ? __('Tags') : ''}
                        topLabel={this.props.isPhone
                            ? __('Tags - Use ‘Enter’ to add a hashtag (5 tags max)')
                            : __('Use ‘Enter’ to add a hashtag (5 tags max)')
                        }
                        placeholder={__('Enter Tags')}
                        max={5}
                        layout={'horizontal'}
                    />
                    <InputField
                        attribute='location'
                        topLabel={this.props.isPhone ? __('Your Country') : ''}
                        label={!this.props.isPhone ? __('Your Country') : ''}
                        placeholder={__('Enter')}
                        layout={'horizontal'}
                    />
                </div>
            </div>
        );
    }
}
