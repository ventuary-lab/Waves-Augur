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

const bem = html.bem('ProfileProjectsPage');

@dal.hoc(
    () => dal.getMyProjects()
        .then(items => ({items}))
)
@connect()
export default class ProfileProjectsPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(ProjectSchema),
    };

    render() {
        return (
            <div className={bem.block()}>
                <ActionButtonBlock
                    title={__('Add New Project')}
                    iconClass='Icon__new-project'
                    onClick={() => this.props.dispatch(openModal(ProjectWizardModal))}
                />
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
