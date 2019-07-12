import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ProjectInboxCard from 'shared/ProjectInboxCard';
import InboxTypeEnum from 'enums/InboxTypeEnum';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import ProjectSchema from 'types/ProjectSchema';

import {dal, html} from 'components';
import './ProfileInboxPage.scss';
import {getUser} from 'yii-steroids/reducers/auth';

const bem = html.bem('ProfileInboxPage');


@connect(
    state => ({
        user: getUser(state),
    })
)
@dal.hoc(
    (props) => dal.getProjects()
        .then(items => {
            return {
                items: items
                    .filter(item => item.status === ProjectStatusEnum.VOTING && !item.isImVoted && item.isVotingAvailable && item.author.address !== props.user.address),

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
