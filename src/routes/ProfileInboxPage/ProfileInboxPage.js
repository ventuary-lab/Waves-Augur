import React from 'react';
import PropTypes from 'prop-types';

import UserInboxCard from 'shared/UserInboxCard';
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

        const userItem = {
            profile: {
                name: 'Anton Semenov',
                title: 'Founder & CEO @Ventuary',
                location: 'Russia'
            },
        };

        const projectItem = {
            status: 'Voting',
            name: 'SmartChain Media',
            description: 'Build Blockchain-related applications and uild applications ser',
            location: 'Russia'
        };

        return (
            <div className={bem.block()}>

                <UserInboxCard
                    item={userItem}
                    type={InboxTypeEnum.INVITATION_ACCEPTED}
                />

                {InboxTypeEnum.getKeys()
                    .filter(type => type !== InboxTypeEnum.INVITATION_ACCEPTED)
                    .map(type => (
                        <ProjectInboxCard
                            item={projectItem}
                            type={type}
                        />
                    ))
                }

            </div>
        );
    }
}
