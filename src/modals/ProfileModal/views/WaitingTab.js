import React from 'react';
import InputField from 'yii-steroids/ui/form/InputField';

import {html} from 'components';
import SvgIcon from 'shared/SvgIcon';
import {profileSvg, arrowDown} from 'static/icons';

const bem = html.bem('LinksTab');

import './WaitingTab.scss';

export default class WaitingTab extends React.PureComponent {
    render () {
        return (
            <div className={bem.block()}>
                <h3>We were waiting for you!</h3>
                <span>You was invited by Tinh Tran</span>
                <SvgIcon icon={profileSvg}/>
                <h3>Please Register to Continue</h3>
                <SvgIcon icon={arrowDown}/>
                <span>Your Nickname (Your Log In)</span>
                <InputField
                    attribute='name'
                />
            </div>
        );
    }
}
