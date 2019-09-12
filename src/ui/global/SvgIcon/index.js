import React from 'react';

import { html } from 'components';

const bem = html.bem('SvgIcon');
import './index.scss';

function SvgIcon ({ icon, children, style = {}, svgStyle = {}, ...restProps }) {
    const computedStyle = {
        width: 50,
        height: 50,
        fill: 'grey',
        display: 'block',
        ...style
    };

    return (
        <span
            {...restProps}
            style={computedStyle}
            className={bem.element('root')}
            dangerouslySetInnerHTML={{ __html: icon }}>
            {children}
        </span>
    )
}

export default SvgIcon;