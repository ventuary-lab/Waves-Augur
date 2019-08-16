import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import {getUser} from 'yii-steroids/reducers/auth';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import {addCover, removeCover} from 'actions/layout';
import _get from 'lodash/get';

import {dal, html} from 'components';
import {ROUTE_PROJECT, ROUTE_PROJECTS_REDIRECT, ROUTE_CONTEST_ENTRIES} from 'routes';
import ProjectSidebar from './views/ProjectSidebar';
import NavItemSchema from 'types/NavItemSchema';
import UserSchema from 'types/UserSchema';
import routes from 'routes';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import ProjectReportReasonsEnum from 'enums/ProjectReportReasonsEnum';

import './ProjectLayout.scss';
import Link from 'yii-steroids/ui/nav/Link';
import ProjectSchema from 'types/ProjectSchema';
import VotingForm from 'shared/VotingForm';
import DonateForm from 'shared/DonateForm';
import GrantForm from 'shared/GrantForm';
import ReportVotingForm from 'shared/ReportVotingForm';

import ActionButtonBlock from '../ActionButtonBlock';

const bem = html.bem('ProjectLayout');

@connect(
    (state) => ({
        user: getUser(state),
        routeId: _get(getCurrentRoute(state), 'id'),
        profileNavItems: getNavItems(state, ROUTE_PROJECT),
    })
)
export default class ProjectLayout extends React.PureComponent {

    static propTypes = {
        user: UserSchema,
        routeId: PropTypes.string,
        profileNavItems: PropTypes.arrayOf(NavItemSchema),
        project: ProjectSchema,
    };

    constructor() {
        super(...arguments);

        this.state = {
            project: null,
        };

        this.getProject = this.getProject.bind(this);
    }

    componentWillMount() {
        this.getProject();
    }

    componentWillUnmount() {
        this.props.dispatch(removeCover);
    }

    getProject() {
        dal.getProject(_get(this.props, 'match.params.uid'))
            .then(project => {
                this.setState({project});
                this.props.dispatch(addCover(project.coverUrl));
            });
    }

    render() {
        if (!this.state.project) {
            return null;
        }

        const ContentComponent = _get(routes, ['items', ROUTE_PROJECT, 'items', this.props.routeId, 'component']);

        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col col_tablet-count-4'}>
                            <div className={bem.element('sidebar')}>
                                <ProjectSidebar
                                    project={this.state.project}
                                    user={this.props.user}
                                />
                            </div>
                        </div>
                        <div className='col col_tablet-count-8'>
                            <div className={bem.element('nav-container')}>
                                <div className={bem.element('nav')}>
                                    {this.props.profileNavItems
                                        .filter(item => item.isNavVisible !== false)
                                        .filter(item => item.roles.includes(this.props.user && this.props.user.role || null))
                                        .map(item => (
                                            <Link
                                                key={item.id}
                                                className={bem.element('nav-item', {
                                                    'is-active': item.isActive,
                                                })}
                                                toRoute={item.id}
                                                toRouteParams={{
                                                    uid: this.props.match.params.uid,
                                                }}
                                                noStyles
                                            >
                                                <div className={bem.element('nav-icon')}>
                                                    <span className={`Icon ${item.isActive ? item.icon + '_green' : item.icon}`}/>
                                                </div>
                                                {item.label}
                                            </Link>
                                        ))
                                    }
                                </div>
                                {_get(this.state, 'project.contest') && (
                                    <Link
                                        className={bem.element('link-to-contest')}
                                        toRoute={ROUTE_CONTEST_ENTRIES}
                                        toRouteParams={{
                                            uid: this.state.project.contest
                                        }}
                                        label={__('View all projects for the contest')}
                                        noStyles
                                    />
                                )}
                            </div>
                            <div className={bem.element('form')}>
                                {this.state.project.canVote && (
                                    <VotingForm project={this.state.project}/>
                                )}
                                {this.state.project.canDonate && (
                                    <DonateForm
                                        project={this.state.project}
                                        onComplete={this.getProject}
                                    />
                                )}
                                {this.state.project.canWhale && (
                                    <GrantForm project={this.state.project}/>
                                )}
                            </div>
                            {!this.state.project.canReportVoting &&
                            !this.state.project.canVote &&
                            !this.state.project.canDonate &&
                            !this.state.project.canWhale &&
                            this.state.project.status !== ProjectStatusEnum.MODERATION && (
                                <Link
                                    toRoute={ROUTE_PROJECTS_REDIRECT}
                                    noStyles
                                    className={bem.element('link-block')}
                                >
                                    <ActionButtonBlock
                                        title={__('Explore New Ideas')}
                                        iconClass={'Icon__explore-ideas'}
                                    />
                                </Link>
                            )}

                            {this.state.project.canReportVoting && (
                                <ReportVotingForm
                                    project={this.state.project}
                                />
                            )}

                            {this.state.project.status === ProjectStatusEnum.MODERATION &&
                            _get(this.state.project, 'author.address') === this.props.user.address && (
                                <div className={bem.element('moderation-text')}>
                                    <p>
                                        {__('It was reported that your project {reason}. Please, wait while users are voting.', {
                                            reason: ProjectReportReasonsEnum.getContext(this.state.project.lastReports[0].report.reason)
                                        })}
                                    </p>
                                    <p>
                                        {__('If community delist your project, it will not be seen on Projects page anymore. But all of its donations will be still available.')}
                                    </p>
                                    <p>
                                        {__('If community do not delist your project, the project will look as usual.')}
                                    </p>
                                </div>
                            )}
                            <div className={bem.element('content')}>
                                {ContentComponent && (
                                    <ContentComponent
                                        project={this.state.project}
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
