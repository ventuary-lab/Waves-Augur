import React from 'react';
import PropTypes from 'prop-types';
import InputField from 'yii-steroids/ui/form/InputField';

import {html} from 'components';
import SvgIcon from 'shared/SvgIcon';
import {profileSvg, arrowDown} from 'static/icons';


const bem = html.bem('WaitingTab');

import './WaitingTab.scss';
import UserSchema from 'types/UserSchema';


export default class WaitingTab extends React.PureComponent {

    static propTypes = {
        invitedBy: UserSchema,
        isCreate: PropTypes.bool,
    };

    render () {
        return (
            <div className={bem.block()}>
                {this.props.isCreate && (
                    <>
                        <h3>We were waiting for you!</h3>
                        <span>You was invited by <b>{this.props.invitedBy.profile.name}</b></span>
                        <SvgIcon icon={profileSvg}/>
                        <h3>Please Register to Continue</h3>
                        <SvgIcon icon={arrowDown}/>
                    </>
                ) || (
                    <div className={bem.element('title')}>
                        {__('Edit profile')}
                    </div>
                )}

                <InputField
                    attribute='name'
                    topLabel={__('Your Nickname (Your Log In)')}
                    placeholder={__('Enter Your Name')}
                />
            </div>
        );
    }
}
