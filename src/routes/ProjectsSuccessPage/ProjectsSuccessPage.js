import React from 'react';
import PropTypes from 'prop-types';
import List from 'yii-steroids/ui/list/List';

import ProjectCard from 'shared/ProjectCard';
import ProjectSchema from 'types/ProjectSchema';
import {html} from 'components';

import './ProjectsSuccessPage.scss';

const bem = html.bem('ProjectsSuccessPage');

export default class ProjectsSuccessPage extends React.PureComponent {

    static propTypes = {
        projects: PropTypes.arrayOf(ProjectSchema),
    };

    render() {
        if (!this.props.projects) {
            return null;
        }

        return (
            <section className={bem.block()}>
                <List
                    listId='ProjectsSuccessPage'
                    itemView={ProjectCard}
                    emptyText={__('No projects')}
                    items={this.props.projects}
                />
            </section>
        );
    }
}
