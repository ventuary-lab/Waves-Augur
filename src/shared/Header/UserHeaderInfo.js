import React from 'react';
import _ from 'lodash';
import './UserHeaderInfo.scss';
import { html } from 'components';

const bem = html.bem('UserHeaderInfo');

import './UserHeaderInfo.scss';

function UserHeaderInfo (props) {
    const { user, altImg } = props;

    const avatar = _.get(user, 'profile.avatar', altImg);
    const name = _.get(user, 'profile.name', 'Anonymous');
    const waves = user.balance;

    return (
        <div className={bem.element('root')}>
            <div>
                <img src={avatar} />
            </div>
            <div>
                <div>{name}</div>
                <div>{waves} WAVES 🔹</div>
            </div>
        </div>
    )
}

export default UserHeaderInfo;