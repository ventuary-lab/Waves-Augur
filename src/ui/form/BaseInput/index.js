import React from 'react';
import { html } from 'components';
import SvgIcon from 'ui/global/SvgIcon';

import './index.scss';

const bem = html.bem('BaseInput');

function BaseInput (props) {
    const { 
        label,
        onChange,
        value,
        icon = false,
        warningText = false,
        ...restProps
    } = props;

    return (
        <div className={bem.element('root')}>
            <div>
                <label>{label}</label>
                <input className={icon ? 'with-icon' : ''} value={value} onChange={onChange} {...restProps}/>
                {icon && <SvgIcon icon={icon}/>}
            </div>
            {warningText && <span className={bem.element('warning')}>{warningText}</span>}
        </div>
    );
}

export default BaseInput;