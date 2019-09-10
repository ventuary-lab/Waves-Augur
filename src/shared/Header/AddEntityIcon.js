import React from 'react';
import { html } from 'components';
import dottedAddIcon from 'static/icons/dotted-add-icon.svg';
import Hint from 'shared/Hint';
import './AddEntityIcon.scss';

const bem = html.bem('AddEntityIcon');

export default function AddEntityIcon ({ item, adaptive, isActive }) {
    const { placeholder } = item;

    return (
        <div className={bem.element('root', { active: isActive })}>
            <Hint
                adaptive={adaptive}
                text={placeholder}
                icon={dottedAddIcon}
            />
        </div>
    );
}
