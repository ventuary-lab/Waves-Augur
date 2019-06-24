import React from 'react';
import SvgIcon from 'components/global/common/SvgIcon';

import { html } from 'components';
const bem: any = html.bem('InputTag');

import {
    cross
} from 'ui/icon/index';

import "./InputTag.scss";

const InputTag: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    const className = props.className || '';

    return (
        <div {...props} className={`${bem.block()} ${className}`}>
            <div>{props.children}</div>
            <SvgIcon icon={cross}/>
        </div>
    )
}

export default InputTag;