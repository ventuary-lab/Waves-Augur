import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import {getUser} from 'yii-steroids/reducers/auth';
import {getCurrentRoute} from 'yii-steroids/reducers/routing';
import {addCover, removeCover} from 'actions/layout';
import _get from 'lodash/get';

import {dal as Dal, html} from 'components';
const dal = Dal();
import {ROUTE_CONTEST} from 'routes';
import ContestSidebar from './views/ContestSidebar';
import NavItemSchema from 'types/NavItemSchema';
import UserSchema from 'types/UserSchema';
import ContestStatusEnum from 'enums/ContestStatusEnum';
import routes from 'routes';

import './ContestLayout.scss';
import Link from 'yii-steroids/ui/nav/Link';
import ContestSchema from 'types/ContestSchema';

import ActionButtonBlock from '../ActionButtonBlock';
import {openModal} from 'yii-steroids/actions/modal';
import ParticipationContestModal from 'modals/ParticipationContestModal';
import ProjectCard from '../ProjectCard';

const bem = html.bem('ContestLayout');

@connect(
    (state) => ({
        user: getUser(state),
        routeId: _get(getCurrentRoute(state), 'id'),
        contestNavItems: getNavItems(state, ROUTE_CONTEST),
    })
)
export default class ContestLayout extends React.PureComponent {

    static propTypes = {
        user: UserSchema,
        routeId: PropTypes.string,
        contestNavItems: PropTypes.arrayOf(NavItemSchema),
        contest: ContestSchema,
    };

    constructor() {
        super(...arguments);

        this.state = {
            contest: null,
        };

        this.getContest = this.getContest.bind(this);
    }

    componentWillMount() {
        this.getContest();
    }

    componentWillUnmount() {
        this.props.dispatch(removeCover);
    }

    getContest() {
        dal.getContest(_get(this.props, 'match.params.uid'))
            .then(contest => {
                this.props.dispatch(addCover(contest.coverUrl));
                this.setState({contest});
            });
    }

    render() {
        if (!this.state.contest) {

            return null;
        }

        const ContentComponent = _get(routes, ['items', ROUTE_CONTEST, 'items', this.props.routeId, 'component']);

        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col col_tablet-count-4'}>
                            <div className={bem.element('sidebar')}>
                                <ContestSidebar
                                    contest={this.state.contest}
                                    user={this.props.user}
                                />
                            </div>
                        </div>
                        <div className='col col_tablet-count-8'>
                            <div className={bem.element('nav-container')}>
                                <div className={bem.element('nav')}>
                                    {this.props.contestNavItems
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
                            </div>
                            {this.state.contest.status !== ContestStatusEnum.COMPLETED && (
                                <div className={bem.element('card-to-action')}>
                                    <ActionButtonBlock
                                        title={__('Participate')}
                                        iconClass={'Icon__new-project'}
                                        onClick={() => this.props.dispatch(openModal(ParticipationContestModal, {
                                            contest: this.state.contest,
                                        }))}
                                    />
                                </div>
                            )}

                            <div className={bem.element('content')}>
                                {ContentComponent && (
                                    <ContentComponent
                                        contest={this.state.contest}
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
