import React from 'react';
import { html } from 'components';
import SvgIcon from 'ui/global/SvgIcon';

const bem = html.bem('CustomHint');

import './index.scss';

function CustomHint (props) {
    const {
        text,
        icon,
        isHovered
    } = props;

    const color = isHovered ? '#0BC91F' : 'grey';
    const svgStyle = { size: 30, transform: 'scale(1.5)', cursor: 'pointer' };
    const svgProps = { fillColor: color };

    return (
        <div className={bem.element('root')}>
            {icon ? <SvgIcon icon={icon} {...svgProps} style={svgStyle}/> : <span className={'Icon Icon__question-in-circle'}/>}
            <div className={bem.element('tooltip', { 'is-hovered': isHovered })}>
                <div></div>
                <span>{text}</span>
            </div>
        </div>
    );
}

export default CustomHint;