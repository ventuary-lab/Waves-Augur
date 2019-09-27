import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';

import { html } from 'components';
import Preloader from 'shared/Preloader';
import ProjectSchema from 'types/ProjectSchema';
import ProjectStateEnum from 'enums/ProjectStateEnum';
import ProjectCard from 'shared/ProjectCard';

import './ProjectsPage.scss';
import ProjectFeedCard from 'shared/ProjectFeedCard';
import FeedSchema from 'types/FeedSchema';
import { isPhone } from 'yii-steroids/reducers/screen';

const bem = html.bem('ProjectsPage');

@connect(
    state => ({
        isPhone: isPhone(state),
    })
)
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
        this._getInitialState = this._getInitialState.bind(this);
        this._handleDataToStateConcat = this._handleDataToStateConcat.bind(this);
        this.cancelToken = axios.CancelToken;
        this.tokenSource = this.cancelToken.source();

        this.state = {
            ...this._getInitialState()
        };

        this.cancelActionEnum = {
            withRetry: 'withRetry'
        };
    }

    async _loadMore () {
        await this._loadData(this._getRequestConfig(), this._checkIsFeed());
    }

    _handleDataToStateConcat (prevState, data, key) {
        return {
            ...prevState,
            [key]: [...prevState[key], ...data],
            hasMore: true,
        };
    }

    _getRequestConfig (props = this.props) {
        return (
            this._checkIsFeed(props) ? {
                url: '/api/v1/reviews/donations',
                key: 'donations',
                collection: 'reviewDonations',
            } : {
                url: `/api/v1/projects/${props.match.params.state}`,
                key: 'projects',
                collection: 'projects',
            }
        );
    }

    _checkIsFeed (props = this.props) {
        return props.match.params.state === ProjectStateEnum.FEED;
    }

    _getInitialState () {
        return {
            currentPage: 0,
            isLoading: false,
            hasMore: false,
            donations: [],
            projects: []
        };
    }

    async _loadData (requestConfig, isFeed) {
        const { isLoading, currentPage } = this.state;

        if (isLoading) {
            return;
        }

        this.setState({ isLoading: true });

        let response;

        try {
            response = await axios.get(requestConfig.url, {
                cancelToken: this.tokenSource.token,
                params: {
                    page: currentPage
                }
            });

            this.setState({ isLoading: false });

            this.setState(prevState => ({ ...prevState, isLoading: false, currentPage: prevState.currentPage + 1 }));

            const { data } = response;

            if (data.length === 0) {
                this.setState({ hasMore: false });
                return;
            }

            this.setState(prevState => this._handleDataToStateConcat(prevState, data, isFeed ? 'donations' : 'projects'));
        } catch (err) {
            const isCancelled = axios.isCancel(err);
            if (isCancelled) {
                console.log('Request canceled', err.message);
            };

            this.tokenSource = this.cancelToken.source();

            this.setState({ isLoading: false });

            if (isCancelled && this.cancelActionEnum.withRetry === err.message) {
                this._loadMore();
            }
        };
    }

    componentDidUpdate(newProps) {
        if (this.props.match.params.state !== newProps.match.params.state) {
            if (this.state.isLoading) {
                this.tokenSource.cancel(this.cancelActionEnum.withRetry);
            }

            const newState = this._getInitialState();

            this.setState(newState);

            if (this.state.currentPage === 0) { 
                this._loadData(this._getRequestConfig(), this._checkIsFeed());
            }
        }
    }

    async componentDidMount () {
        await this._loadData(this._getRequestConfig(), this._checkIsFeed());
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
        );

        if (!donations && !projects) {
            return loader;
        }

        return (
            <InfiniteScroll
                pageStart={currentPage}
                loadMore={this._loadMore}
                hasMore={hasMore}
                initialLoad={false}
                loader={loader}>
                {this._getLayout()}
            </InfiniteScroll>
        );
    }

    _getLayout () {
        const { projects, donations } = this.state;
        const isFeed = this._checkIsFeed();

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
