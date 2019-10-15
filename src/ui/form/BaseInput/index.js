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
        errorText = false,
        asTextArea = false,
        ...restProps
    } = props;

    const computeClassName = () => {
        return [
            icon ? 'with-icon' : '',
            errorText ? 'error' : ''
        ].join(' ');
    };

    const inputProps = {
        ...restProps,
        className: computeClassName()
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
            <span className={bem.element('error')}>{errorText || ''}</span>
        </div>
    );
}

export default BaseInput;