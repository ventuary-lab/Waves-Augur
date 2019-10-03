import React from 'react';
import { html } from 'components';

const bem = html.bem('InfoBlock');

import './index.scss';

function InfoBlock (props) {
    const { children, title, ...restProps } = props;

    return (
        <div {...restProps} className={bem.element('root')}>
            <span>{title}</span>
            <div>{children}</div>
        </div>
    );
}

export default InfoBlock;