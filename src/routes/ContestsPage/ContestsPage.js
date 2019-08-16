import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import List from 'yii-steroids/ui/list/List';
import _orderBy from 'lodash/orderBy';

import {dal, html} from 'components';
import Preloader from 'shared/Preloader';
import ContestSchema from 'types/ContestSchema';
import ContestStateEnum from 'enums/ContestStateEnum';
import ContestStatusEnum from 'enums/ContestStatusEnum';
import ContestCard from 'shared/ContestCard';

import './ContestsPage.scss';
import ProjectStateEnum from 'enums/ProjectStateEnum';

const bem = html.bem('ContestsPage');

@dal.hoc2(
    props => ({
        url: `/api/v1/contests/${props.match.params.state}`,
        key: 'contests',
        collection: 'contests',
    })
)
export default class ContestsPage extends React.PureComponent{

    static propTypes = {
        items: PropTypes.arrayOf(ContestSchema),
    };

    render() {
        if (!this.props.contests) {
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
                                <List
                                    listId='ProjectsList'
                                    itemView={ContestCard}
                                    emptyText={__('No contests')}
                                    items={this.props.contests}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
