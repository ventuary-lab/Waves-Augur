import React from 'react';
import { html } from 'components';
import SvgIcon from 'ui/global/SvgIcon';

import './index.scss';

const bem = html.bem('BaseInput');

function BaseInput (props) {
    const { 
        label,
        // onChange,
        // value,
        icon = false,
        warningText = false,
        asTextArea = false,
        ...restProps
    } = props;

    const inputProps = {
        ...restProps,
        className: icon ? 'with-icon' : '',
    };
    const inputComponent = asTextArea ? <textarea {...inputProps}/> : <input {...inputProps}/>;

    return (
        <div className={bem.element('root')}>
            <div>
                <label>{label}</label>
                {inputComponent}
                {icon && <SvgIcon icon={icon}/>}
            </div>
            {warningText && <span className={bem.element('warning')}>{warningText}</span>}
        </div>
    );
}

export default BaseInput;