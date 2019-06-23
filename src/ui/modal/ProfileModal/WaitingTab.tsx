import React from 'react';
import { Field } from 'react-final-form'
// import { InputFormField } from 'ui/form/InputField/InputField';
// import Button from 'ui/form/Button/Button';
import SvgIcon from 'components/global/common/SvgIcon';

import {
    profileSvg,
    arrowDown
} from 'ui/icon/index';


const WaitingTab: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
    <div {...props}>
        <h3>We were waiting for you!</h3>
        <span>You was invited by Tinh Tran</span>
        <SvgIcon icon={profileSvg}/>
        <h3>Please Register to Continue</h3>
        <SvgIcon icon={arrowDown}/>
        <span>Your Nickname (Your Log In)</span>
        <Field name="name" component="input" />
    </div>
)

export default WaitingTab;