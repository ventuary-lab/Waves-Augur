import React from 'react';
import { html } from 'components';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';

const bem = html.bem('PageTeamMember');

import './index.scss';

function PageTeamMember (props) {
    const { 
        avatar = anonymousAvatarStub,
        isAdmin = false,
        title,
        desc,
        link
    } = props;

    return (
        <div className={bem.element('root')}>
            <div className={bem.element('avatar')}>
                <a href={link}>
                    <img src={avatar}/>
                </a>
            </div>
            <div className={bem.element('text')}>
                <div>
                    <a href={link}>
                        <h4>{title}</h4>
                    </a>
                    {isAdmin && <span>admin</span>}
                </div>
                <span>{desc}</span>
            </div>
        </div>
    )
}

export default PageTeamMember;
