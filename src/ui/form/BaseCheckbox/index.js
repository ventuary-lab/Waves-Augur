import React from 'react';
import { html } from 'components';
import checkboxIcon from 'static/icons/checkbox/checkbox.svg';
import {
    Input
} from './styled';

import './index.scss';

const bem = html.bem('BaseCheckbox');

function BaseCheckbox (props) {
    const {
        label,
        ...restProps
    } = props;

    return (
        <div className={bem.element('root')}>
            <label className={bem.element('container')}>
                <div>{label}</div>
                <Input {...restProps} type='checkbox' img={checkboxIcon}/>
                <span></span>
            </label>
        </div>
    );
}

export default BaseCheckbox;