import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';
import _orderBy from 'lodash/orderBy';

import {dal, html} from 'components';
import Preloader from 'shared/Preloader';
import ProjectSchema from 'types/ProjectSchema';
import ProjectStateEnum from 'enums/ProjectStateEnum';
import ProjectCard from 'shared/ProjectCard';

import './ProjectsPage.scss';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import ProjectFeedCard from 'shared/ProjectFeedCard';

const bem = html.bem('ProjectsPage');

export default class ProjectsPage extends React.PureComponent{

    static propTypes = {
        items: PropTypes.arrayOf(ProjectSchema),
    };

    constructor() {
        super(...arguments);

        this.state = {
            projects: null,
            feed: null,
            isLoading: false
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
        if (projectsState === ProjectStateEnum.FEED) {
            this.setState({
                isLoading: true,
            });

            dal.getProjectsDonations()
                .then(feed => {
                    this.setState({
                        projects: null,
                        feed,
                        isLoading: false,
                    });
                });
        } else {
            this.setState({
                isLoading: true,
            });
            dal.getProjects()
                .then(projects => {
                    switch (projectsState) {
                        case ProjectStateEnum.FEATURED:
                            projects = projects.filter(item => item.status === ProjectStatusEnum.CROWDFUND);
                            projects = _orderBy(projects, 'positiveBalance', 'desc');
                            break;
                        case ProjectStateEnum.NEW:
                            projects = projects.filter(item => item.status === ProjectStatusEnum.CROWDFUND);
                            projects = _orderBy(projects, 'createTime', 'asc');
                            break;
                        case ProjectStateEnum.FINISHED:
                            projects = projects.filter(item => item.positiveBalance > 0 && [ProjectStatusEnum.WAITING_GRANT, ProjectStatusEnum.GRANT].includes(item.status));
                            projects = _orderBy(projects, 'positiveBalance', 'desc');
                            break;
                    }
                    this.setState({
                        projects,
                        feed: null,
                        isLoading: false,
                    });
                });
        }
    }

    render() {
        if (!this.state.projects && !this.state.feed) {
            return (
                <section className={bem.block()}>
                    <div className={'wrapper'}>
                        <div className={'row'}>
                            <div className={'col'}>
                                <div className={bem.element('inner')}>
                                    <Preloader/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            );
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
                                {this.state.projects && (
                                    <>
                                        {!this.state.isLoading && (
                                            <List
                                                listId='ProjectsList'
                                                itemView={ProjectCard}
                                                emptyText={__('No projects')}
                                                items={this.state.projects}
                                            />
                                        ) || (
                                            <Preloader/>
                                        )}
                                    </>
                                )}
                                {this.state.feed && (
                                    <>
                                        {!this.state.isLoading && (
                                            <List
                                                listId='FeedList'
                                                itemView={ProjectFeedCard}
                                                emptyText={__('No feed')}
                                                items={this.state.feed}
                                            />
                                        ) || (
                                            <Preloader/>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
