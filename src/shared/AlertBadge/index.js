import React from 'react';
import checkedIcon from 'static/icons/checked-icon.svg';
import stopSignIcon from 'static/icons/stop-sign.svg';
import { html } from 'components';

const bem = html.bem('AlertBadge');

import './index.scss';

function AlertBadge ({ text, type = 'success' }) {
    let icon = checkedIcon;
    let className = [
        bem.element('root')
    ];

    switch (type) {
        case 'fail':
            icon = stopSignIcon;
            className.push('fail');
            break;
    }

    className = className.join(' ');

    return (
        <div className={className}>
            <img src={icon}/>
            <span>{text}</span>
        </div>
    )
}

export default AlertBadge;