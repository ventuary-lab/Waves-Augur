import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { isPhone } from 'yii-steroids/reducers/screen';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';

import { html } from 'components';
import Preloader from 'shared/Preloader';
import ProjectSchema from 'types/ProjectSchema';
import ProjectStateEnum from 'enums/ProjectStateEnum';
import ProjectCard from 'shared/ProjectCard';
import { Loader } from 'ui/anims';

import './ProjectsPage.scss';
import ProjectFeedCard from 'shared/ProjectFeedCard';
import FeedSchema from 'types/FeedSchema';

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
        isPhone: PropTypes.boolean
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

        this.cancelActionEnum = {
            withRetry: 'withRetry'
        };
        this.loader = <Loader />;

        this.state = {
            ...this._getInitialState()
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
        // Pages are zero based
        return {
            currentPage: 0,
            isLoading: false,
            hasMore: false,
            donations: [],
            projects: []
        };
    }

    async _loadData (requestConfig, isFeed, currentPage = this.state.currentPage) {
        const { isLoading } = this.state;

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

            this._loadData(this._getRequestConfig(), this._checkIsFeed(), 0);
        }
    }

    async componentDidMount () {
        await this._loadData(this._getRequestConfig(), this._checkIsFeed());
    }

    render() {
        const { hasMore, currentPage, donations, projects, isLoading } = this.state;

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

        if (!donations && !projects && isLoading) {
            return loader;
        }

        return (
            <InfiniteScroll
                pageStart={currentPage}
                loadMore={this._loadMore}
                hasMore={hasMore}
                initialLoad={false}
                loader={this.loader}>
                {this._getLayout()}
            </InfiniteScroll>
        );
    }

    _getLayout () {
        const { projects, donations, isLoading } = this.state;
        const isFeed = this._checkIsFeed();
        const initialLoad = _.get(donations, 'length', 0) === 0 && _.get(projects, 'length', 0) === 0;
        const shouldRenderProjects = !initialLoad && !isFeed && projects;
        const shouldRenderDonations = !initialLoad && isFeed && donations;

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
                                {shouldRenderProjects && (
                                    <List
                                        listId='ProjectsList'
                                        itemView={ProjectCard}
                                        emptyText={__('No projects')}
                                        items={projects}
                                    />
                                )}
                                {shouldRenderDonations && (
                                    <List
                                        listId='FeedList'
                                        itemView={ProjectFeedCard}
                                        emptyText={__('No feed')}
                                        items={donations}
                                    />
                                )}
                                {initialLoad && this.loader}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );

    }
}
