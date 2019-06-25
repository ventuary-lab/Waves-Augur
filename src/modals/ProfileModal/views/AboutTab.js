import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import Button from 'yii-steroids/ui/form/Button/Button';

import InputTag from 'shared/InputTag';
import { html } from 'components';
const bem = html.bem('AboutTab');

import FormContext from './context';
import InputField from 'yii-steroids/ui/form/InputField';
import AvatarField from 'yii-steroids/ui/form/AvatarField/AvatarField';

@connect(
    (state, props) => ({
        avatar: formValueSelector(props.formId)(state, 'avatar'),
    })
)
export default class AboutTab extends React.Component {

    static propTypes = {
        avatar: PropTypes.string,
    };

    render () {
        return (
            <div className={bem.block()}>
                <h3>About tab</h3>
                <span>Add More Information about yourself</span>
                <FormContext.Consumer>
                    {({ avatar }) => (
                        <div className={bem.element('grid')}>
                            <AvatarField
                                attribute='avatar'
                                label={__('Avatar URL')}
                            />
                            <InputField
                                attribute='title'
                                label={__('Your Occupation')}
                                placeholder={__('Enter')}
                            />

                            <div>
                                <span>Tags</span>
                                <div>
                                    <label>Use ‘Enter’ to add a hashtag (10 max)</label>
                                    <Field name='tags' placeholder='Enter' component='input'/>
                                    <div>
                                        {tags.map((tag) => <InputTag>{tag}</InputTag>)}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span>Your Country</span>
                                <Field name='location' placeholder='Enter' component='input'/>
                            </div>
                        </div>
                    )}
                </FormContext.Consumer>
            </div>
        );
    }
}
