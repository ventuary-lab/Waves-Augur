import React from 'react';
import checkedIcon from 'static/icons/checked-icon.svg';
import { html } from 'components';

const bem = html.bem('AlertBadge');

import './index.scss';

function AlertBadge ({ text }) {
    return (
        <div className={bem.element('root')}>
            <img src={checkedIcon}/>
            <span>{text}</span>
        </div>
    )
}

export default AlertBadge;