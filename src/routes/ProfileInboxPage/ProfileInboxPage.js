import React from 'react';
import PropTypes from 'prop-types';

import ProjectInboxCard from 'shared/ProjectInboxCard';
import InboxTypeEnum from 'enums/InboxTypeEnum';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import ProjectSchema from 'types/ProjectSchema';

import {dal, html} from 'components';
import './ProfileInboxPage.scss';

const bem = html.bem('ProfileInboxPage');


@dal.hoc(
    () => dal.getProjects()
        .then(items => {
            return {
                items: items.filter(item => item.status === ProjectStatusEnum.VOTING && !item.isImVoted && item.isVotingAvailable),
            };
        }))
export default class ProfileInboxPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(ProjectSchema),
    };

    render() {
        if (!this.props.items) {
            return null;
        }

        return (
            <div className={bem.block()}>
                {this.props.items.map(item => (
                    <ProjectInboxCard
                        key={item.uid}
                        item={item}
                        type={InboxTypeEnum.INVITATION_VOTING}
                    />
                ))}
            </div>
        );
    }
}
