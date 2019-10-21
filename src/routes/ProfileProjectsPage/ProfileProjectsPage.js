import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {openModal} from 'yii-steroids/actions/modal';

import ActionButtonBlock from 'shared/ActionButtonBlock';
import ProjectCard from 'shared/ProjectCard';

import {dal, html} from 'components';

import './ProfileProjectsPage.scss';
import ProjectWizardModal from 'modals/ProjectWizardModal';
import ProjectSchema from 'types/ProjectSchema';
import List from 'yii-steroids/ui/list/List';
import {ROUTE_PROJECTS_REDIRECT} from '../index';
import Link from 'yii-steroids/ui/nav/Link';
import {isPhone} from 'yii-steroids/reducers/screen';
import MessageModal from '../../modals/MessageModal';
import { ReduxModalContext } from 'shared/Layout/context';

const bem = html.bem('ProfileProjectsPage');

@dal.hoc2(
    props => ({
        url: `/api/v1/projects/author/${props.user.address}`,
        key: 'items',
        collection: 'users',
    })
)
@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
export default class ProfileProjectsPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(ProjectSchema),
        isMe: PropTypes.bool,
    };

    render() {
        return (
            <div className={bem.block()}>
                {this.props.isMe && (
                    <ReduxModalContext.Consumer>
                        {({ openLoginModal }) => (
                            <ActionButtonBlock
                                title={__('Add New Project')}
                                iconClass='Icon__new-project'
                                onClick={() => {
                                    if (this.props.isPhone) {
                                        openLoginModal();
                                    } else {
                                        this.props.dispatch(openModal(ProjectWizardModal));
                                    }
                                }}
                            />
                        )}
                    </ReduxModalContext.Consumer>
                ) || (
                    <Link
                        toRoute={ROUTE_PROJECTS_REDIRECT}
                        noStyles
                        className={bem.element('link-block')}
                    >
                        <ActionButtonBlock
                            title={__('Explore New Ideas')}
                            iconClass={'Icon__explore-ideas'}
                        />
                    </Link>
                )}
                <div className={bem.element('card-list')}>
                    <List
                        listId='ProfileProjectsPage'
                        itemView={ProjectCard}
                        emptyText={__('No projects')}
                        items={this.props.items}
                    />
                </div>
            </div>
        );
    }

}
