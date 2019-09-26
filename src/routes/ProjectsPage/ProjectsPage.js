import React from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';

import {dal, html} from 'components';
import Preloader from 'shared/Preloader';
import ProjectSchema from 'types/ProjectSchema';
import ProjectStateEnum from 'enums/ProjectStateEnum';
import ProjectCard from 'shared/ProjectCard';

import './ProjectsPage.scss';
import ProjectFeedCard from 'shared/ProjectFeedCard';
import FeedSchema from 'types/FeedSchema';

const bem = html.bem('ProjectsPage');

export default class ProjectsPage extends React.PureComponent{

    static propTypes = {
        projects: PropTypes.arrayOf(ProjectSchema),
        donations: PropTypes.arrayOf(FeedSchema),
    };

    constructor(props) {
        super(props);

        this._getLayout = this._getLayout.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._loadData = this._loadData.bind(this);
        this._handleDataToStateConcat = this._handleDataToStateConcat.bind(this);

        this.isFeed = this.props.match.params.state === ProjectStateEnum.FEED;

        this.requestConfig = (
            this.isFeed ? {
                url: '/api/v1/reviews/donations',
                key: 'donations',
                collection: 'reviewDonations',
            } : {
                url: `/api/v1/projects/${props.match.params.state}`,
                key: 'projects',
                collection: 'projects',
            }
        );

        this.state = {
            currentPage: 0,
            isLoading: false,
            hasMore: false,
            donations: [],
            projects: []
        };
    }

    async _loadMore () {
        await this._loadData();
    }

    _handleDataToStateConcat (prevState, data, key) {
        return {
            ...prevState,
            [key]: [...prevState[key], ...data],
            hasMore: true,
        };
    }

    async _loadData () {
        const { isFeed } = this;
        const { isLoading } = this.state;

        if (isLoading) {
            return;
        }

        this.setState({ isLoading: true });

        const response = await axios.get(this.requestConfig.url, {
            params: {
                page: this.state.currentPage
            }
        });


        this.setState(prevState => ({ ...prevState, isLoading: false, currentPage: prevState.currentPage + 1 }));

        const { data } = response;

        if (data.length === 0) {
            this.setState({ hasMore: false });
            return;
        }

        this.setState(prevState => this._handleDataToStateConcat(prevState, data, isFeed ? 'donations' : 'projects'));
    }

    async componentDidMount () {
        await this._loadData();
    }

    render() {
        const { hasMore, currentPage, donations, projects } = this.state;

        const loader = (
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
        )

        if (!donations && !projects) {
            return loader;
        }

        return (
            <InfiniteScroll
                pageStart={currentPage}
                loadMore={this._loadMore}
                hasMore={hasMore}
                loader={loader}>
                {this._getLayout()}
            </InfiniteScroll>
        );
    }

    _getLayout () {
        const { isFeed } = this;
        const { projects, donations } = this.state;

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
                                {!isFeed && projects && (
                                    <List
                                        listId='ProjectsList'
                                        itemView={ProjectCard}
                                        emptyText={__('No projects')}
                                        items={projects}
                                    />
                                )}
                                {isFeed && donations && (
                                    <List
                                        listId='FeedList'
                                        itemView={ProjectFeedCard}
                                        emptyText={__('No feed')}
                                        items={donations}
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
