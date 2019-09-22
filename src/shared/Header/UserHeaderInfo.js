import React from 'react';
import _ from 'lodash';
import './UserHeaderInfo.scss';
import Link from 'yii-steroids/ui/nav/Link';
import { html } from 'components';
import anonymousAvatarStub from 'static/images/anonymous-avatar-stub.jpeg';

const bem = html.bem('UserHeaderInfo');

import './UserHeaderInfo.scss';

function UserHeaderInfo (props) {
    const { user, altImg = anonymousAvatarStub, onAvatarClick } = props;

    const avatar = _.get(user, 'profile.avatar', altImg);
    const name = _.get(user, 'profile.name', 'Anonymous');
    const waves = user.balance;
    const imgClassName = !user || user.role === 'anonymous' ? 'no-drop' : '';
    const imgLink = imgClassName === '' ? '/profile/inbox' : '#';
    const onImgClick = () => {
        if (onAvatarClick) {
            onAvatarClick();
        }
    };

    return (
        <div className={bem.element('root')}>
            <div>
                <Link className={imgClassName} to={imgLink} noStyles onClick={onImgClick}>
                    <img src={avatar}/>
                </Link>
            </div>
            <div>
                <div>{name}</div>
                <div>{waves} WAVES 🔹</div>
            </div>
        </div>
    )
}

export default UserHeaderInfo;