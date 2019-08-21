import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';

import {dal as Dal, html} from 'components';
const dal = Dal();
import Preloader from 'shared/Preloader';
import ProjectSchema from 'types/ProjectSchema';
import ProjectStateEnum from 'enums/ProjectStateEnum';
import ProjectCard from 'shared/ProjectCard';

import './ProjectsPage.scss';
import ProjectFeedCard from 'shared/ProjectFeedCard';
import FeedSchema from 'types/FeedSchema';

const bem = html.bem('ProjectsPage');

@dal.hoc2(
    props => ([
        props.match.params.state === ProjectStateEnum.FEED
            ? {
                url: '/api/v1/reviews/donations',
                key: 'donations',
                collection: 'reviewDonations',
            }
            : {
                url: `/api/v1/projects/${props.match.params.state}`,
                key: 'projects',
                collection: 'projects',
            }
    ])
)
export default class ProjectsPage extends React.PureComponent{

    static propTypes = {
        projects: PropTypes.arrayOf(ProjectSchema),
        donations: PropTypes.arrayOf(FeedSchema),
    };

    render() {
        if (!this.props.donations && !this.props.projects) {
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

        const isFeed = this.props.match.params.state === ProjectStateEnum.FEED;

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
                                {!isFeed && this.props.projects && (
                                    <List
                                        listId='ProjectsList'
                                        itemView={ProjectCard}
                                        emptyText={__('No projects')}
                                        items={this.props.projects}
                                    />
                                )}
                                {isFeed && this.props.donations && (
                                    <List
                                        listId='FeedList'
                                        itemView={ProjectFeedCard}
                                        emptyText={__('No feed')}
                                        items={this.props.donations}
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
