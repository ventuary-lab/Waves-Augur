import React from 'react';
import PropTypes from 'prop-types';

import ProjectInboxCard from 'shared/ProjectInboxCard';
import InboxTypeEnum from 'enums/InboxTypeEnum';

import {html} from 'components';

import './ProfileInboxPage.scss';

const bem = html.bem('ProfileInboxPage');

export default class ProfileInboxPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.array,
    };

    render() {
        const projectItem = {
            status: 'voting',
            name: 'SmartChain Media',
            description: 'Build Blockchain-related applications and uild applications ser',
            location: 'Russia',
            expireVoting: '2019-07-18 11:37:16',
            uid: '638df850-71e6-469b-9278-cd7a5bab790b',
        };

        return (
            <div className={bem.block()}>
                {InboxTypeEnum.getKeys()
                    .filter(type => type !== InboxTypeEnum.INVITATION_ACCEPTED)
                    .map((type, index) => (
                        <ProjectInboxCard
                            item={projectItem}
                            type={type}
                            key={index}
                        />
                    ))
                }
            </div>
        );
    }
}
