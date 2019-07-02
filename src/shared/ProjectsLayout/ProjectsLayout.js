import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _get from 'lodash-es/get';
import Link from 'yii-steroids/ui/nav/Link';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import {getUser} from 'yii-steroids/reducers/auth';

import {html, dal} from 'components';

import ProjectSchema from 'types/ProjectSchema';
import routes from 'routes';

import {ROUTE_PROJECTS} from 'routes';

import './ProjectsLayout.scss';

const bem = html.bem('ProjectsLayout');

@dal.hoc(
    () => dal.getProjects()
        .then(items => ({items}))
)
@connect(
    (state) => ({
        user: getUser(state),
        routeId: _get(getCurrentRoute(state), 'id'),
        profileNavItems: getNavItems(state, ROUTE_PROJECTS),
    })
)
export default class ProjectsLayout extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(ProjectSchema),
    };

    render() {

        if (!this.props.items) {
            return null;
        }
        console.log(this.props);


        const ContentComponent = _get(routes, ['items', ROUTE_PROJECTS, 'items', this.props.routeId, 'component']);

        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col'}>
                            <div className={bem.element('nav-container')}>
                                <div className={bem.element('nav')}>
                                    {this.props.profileNavItems
                                        .filter(item => item.roles.includes(this.props.user.role))
                                        .map(item => (
                                            <Link
                                                key={item.id}
                                                className={bem.element('nav-item', {
                                                    'is-active': item.isActive,
                                                })}
                                                toRoute={item.id}
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
                            </div>

                            <div className={bem.element('content')}>
                                {ContentComponent && (
                                    <ContentComponent
                                        projects={this.props.items}
                                    />
                                )}
                            </div>

                            {/*<div className={bem.element('inner')}>
                                <List
                                    listId='ProjectsPage'
                                    itemView={ProjectCard}
                                    emptyText={__('No projects')}
                                    items={this.props.items}
                                />
                            </div>*/}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
