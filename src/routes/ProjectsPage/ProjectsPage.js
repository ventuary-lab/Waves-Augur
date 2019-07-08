import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';
import _orderBy from 'lodash/orderBy';

import {dal, html} from 'components';
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
                projects: null,
                feed: dal.getProjectsDonations(),
            });
        } else {
            dal.getProjects()
                .then(items => {
                    items = items.filter(item => item.status !== ProjectStatusEnum.VOTING);

                    switch (projectsState) {
                        case ProjectStateEnum.FEATURED:
                            items = _orderBy(items, 'positiveBalance', 'desc');
                            break;
                        case ProjectStateEnum.NEW:
                            items = _orderBy(items, 'createTime', 'asc');
                            break;
                        case ProjectStateEnum.FINISHED:
                            items = items.filter(item => item.positiveBalance > 0 && [ProjectStatusEnum.WAITING_GRANT, ProjectStatusEnum.GRANT].includes(item.status));
                            items = _orderBy(items, 'positiveBalance', 'desc');
                            break;
                    }
                    this.setState({
                        projects: items.filter(item => ProjectStateEnum.getState(item.status) === projectsState),
                        feed: null,
                    });
                });
        }
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
                                {this.state.projects && (
                                    <List
                                        listId='ProjectsList'
                                        itemView={ProjectCard}
                                        emptyText={__('No projects')}
                                        items={this.state.projects}
                                    />
                                )}
                                {this.state.feed && (
                                    <List
                                        listId='FeedList'
                                        itemView={ProjectFeedCard}
                                        emptyText={__('No feed')}
                                        items={this.state.feed}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
