import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import {getUser} from 'yii-steroids/reducers/auth';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import {addCover, removeCover} from 'actions/layout';
import _get from 'lodash/get';

import { dal as DalClass, html} from 'components';
const dal = DalClass();

import {ROUTE_PROJECT, ROUTE_PROJECTS_REDIRECT, ROUTE_CONTEST_ENTRIES} from 'routes';
import ProjectSidebar from './views/ProjectSidebar';
import NavItemSchema from 'types/NavItemSchema';
import UserSchema from 'types/UserSchema';
import routes from 'routes';

import './ProjectLayout.scss';
import Link from 'yii-steroids/ui/nav/Link';
import ProjectSchema from 'types/ProjectSchema';
import VotingForm from 'shared/VotingForm';
import DonateForm from 'shared/DonateForm';
import GrantForm from 'shared/GrantForm';

import ActionButtonBlock from '../ActionButtonBlock';

const bem = html.bem('ProjectLayout');

@dal.hoc2(
    props => ({
        url: `/api/v1/projects/${_get(props, 'match.params.uid')}`,
        key: 'project',
        collection: 'projects',
    })
)
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
    }

    componentWillMount() {
        this.props.dispatch(addCover(this.props.coverUrl));
    }

    componentWillUnmount() {
        this.props.dispatch(removeCover);
    }

    render() {
        if (!this.props.project) {
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
                                    project={this.props.project}
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
                                            uid: this.props.project.contest
                                        }}
                                        label={__('View all projects for the contest')}
                                        noStyles
                                    />
                                )}
                            </div>
                            <div className={bem.element('form')}>
                                {this.props.project.canVote && (
                                    <VotingForm project={this.props.project}/>
                                )}
                                {this.props.project.canDonate && (
                                    <DonateForm
                                        project={this.props.project}
                                        onComplete={this.getProject}
                                    />
                                )}
                                {this.props.project.canWhale && (
                                    <GrantForm project={this.props.project}/>
                                )}
                            </div>
                            {!this.props.project.canVote && !this.props.project.canDonate && !this.props.project.canWhale && (
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
                            <div className={bem.element('content')}>
                                {ContentComponent && (
                                    <ContentComponent
                                        project={this.props.project}
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
