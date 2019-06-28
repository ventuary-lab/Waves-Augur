import React from 'react';
import PropTypes from 'prop-types';

import {html, dal} from 'components';

import './ProjectsPage.scss';
import ProjectSchema from 'types/ProjectSchema';
import List from 'yii-steroids/ui/list/List';
import ProjectCard from 'shared/ProjectCard';

const bem = html.bem('ProjectsPage');

@dal.hoc(
    () => dal.getProjects()
        .then(items => ({items}))
)
export default class ProjectsPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(ProjectSchema),
    };

    render() {
        if (!this.props.items) {
            return null;
        }

        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col'}>
                            <List
                                listId='ProjectsPage'
                                itemView={ProjectCard}
                                emptyText={__('No projects')}
                                items={this.props.items}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
