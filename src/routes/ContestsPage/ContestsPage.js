import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';
import _orderBy from 'lodash/orderBy';

import {dal as Dal, html} from 'components';
const dal = Dal();
import Preloader from 'shared/Preloader';
import ContestSchema from 'types/ContestSchema';
import ContestStateEnum from 'enums/ContestStateEnum';
import ContestStatusEnum from 'enums/ContestStatusEnum';
import ContestCard from 'shared/ContestCard';

import './ContestsPage.scss';

const bem = html.bem('ContestsPage');

export default class ContestsPage extends React.PureComponent{

    static propTypes = {
        items: PropTypes.arrayOf(ContestSchema),
    };

    constructor() {
        super(...arguments);

        this.state = {
            contests: null,
            isLoading: false
        };
    }

    componentDidMount() {
        this.getContests(this.props.match.params.state);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.state !== this.props.match.params.state) {
            this.getContests(nextProps.match.params.state);
        }
    }

    getContests(contestsState) {
        this.setState({
            isLoading: true,
        });
        dal.getContests()
            .then(contests => {
                switch (contestsState) {
                    case ContestStateEnum.FEATURED: //TODO
                        // contests = contests.filter(item => item.status === ProjectStatusEnum.CROWDFUND);
                        // contests = _orderBy(contests, 'positiveBalance', 'desc');

                        break;
                    case ContestStateEnum.NEW:
                        contests = contests.filter(item => item.status === ContestStatusEnum.OPEN);
                        contests = _orderBy(contests, 'createTime', 'asc');
                        break;
                    case ContestStateEnum.FINISHED:
                        contests = contests.filter(item => item.status === ContestStatusEnum.COMPLETED);
                        break;
                }
                this.setState({
                    contests,
                    isLoading: false,
                });
            });
    }

    render() {
        if (!this.state.contests) {
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
                                        {ContestStateEnum.getKeys().map(item => {
                                            const isActive = this.props.match.params.state === item;

                                            return (
                                                <Link
                                                    key={item}
                                                    className={bem.element('nav-item', {
                                                        'is-active': isActive,
                                                    })}
                                                    to={`/contests/${item}`}
                                                    noStyles
                                                >
                                                    <div className={bem.element('nav-icon')}>
                                                        <span className={`Icon ${isActive 
                                                            ? ContestStateEnum.getCssClass(item) + '_green' 
                                                            : ContestStateEnum.getCssClass(item)}`}
                                                        />
                                                    </div>
                                                    {ContestStateEnum.getLabel(item)}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                                {this.state.contests && (
                                    <>
                                        {!this.state.isLoading && (
                                            <List
                                                listId='ProjectsList'
                                                itemView={ContestCard}
                                                emptyText={__('No contests')}
                                                items={this.state.contests}
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
