
import React from 'react';
import { html } from 'components';
import SvgIcon from 'ui/global/SvgIcon';

import './index.scss';

const bem = html.bem('BaseButton');

function BaseButton ({ children, icon, className, ...restProps }) {
    const classList = [bem.element('root'), className].filter(Boolean).join(' ');

    return (
        <button {...restProps} className={classList}>
            {icon && <SvgIcon icon={icon} />}
            <span className={bem.element('title')}>{children}</span>
        </button>
    );
}


export default BaseButton;

