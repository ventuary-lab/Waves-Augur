import React from 'react';
import { createPortal } from 'react-dom';
import { html } from 'components';

const bem = html.bem('BaseModal');

import './index.scss';

function BaseModal ({ renderNode, isVisible, children, ...restProps }) {
    const mountNode = renderNode || document.body;

    return (
        createPortal(
            isVisible && <div {...restProps} className={bem.element('root')}>
                {children}
            </div>,
            mountNode
        )
    );
}

export default BaseModal;