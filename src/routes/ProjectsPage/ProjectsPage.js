import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';

import {dal, html} from 'components';
import ProjectSchema from 'types/ProjectSchema';
import ProjectStateEnum from 'enums/ProjectStateEnum';
import ProjectCard from 'shared/ProjectCard';

import './ProjectsPage.scss';


const bem = html.bem('ProjectsPage');

export default class ProjectsPage extends React.PureComponent{

    static propTypes = {
        items: PropTypes.arrayOf(ProjectSchema),
    };

    constructor() {
        super(...arguments);

        this.state = {
            projects: null,
        };
    }

    componentDidMount() {
        this.getProjects(this.props.match.params.state);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.state !== this.props.match.params.state) {
            this.getProjects(nextProps.match.params.state);
        }
    }


    getProjects(projectsState) {
        dal.getProjects()
            .then(items => {
                this.setState({
                    projects: items.filter(item => ProjectStateEnum.getState(item.status) === projectsState)
                });
            });
    }

    render() {
        if (!this.state.projects) {
            return null;
        }

        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col'}>
                            <div className={bem.element('inner')}>
                                <div className={bem.element('nav-container')}>
                                    <div className={bem.element('nav')}>
                                        {ProjectStateEnum.getKeys().map(item => {
                                            const isActive = this.props.match.params.state === item;

                                            return (
                                                <Link
                                                    key={item}
                                                    className={bem.element('nav-item', {
                                                        'is-active': isActive,
                                                    })}
                                                    to={`/projects/${item}`}
                                                    noStyles
                                                >
                                                    <div className={bem.element('nav-icon')}>
                                                        <span className={`Icon ${isActive 
                                                            ? ProjectStateEnum.getCssClass(item) + '_green' 
                                                            : ProjectStateEnum.getCssClass(item)}`}
                                                        />
                                                    </div>
                                                    {ProjectStateEnum.getLabel(item)}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                <List
                                    listId='ProjectsList'
                                    itemView={ProjectCard}
                                    emptyText={__('No projects')}
                                    items={this.state.projects}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
