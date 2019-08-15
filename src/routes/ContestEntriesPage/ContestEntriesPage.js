import React from 'react';
import PropTypes from 'prop-types';

import {dal, html} from 'components';

import './ContestEntriesPage.scss';
import ContestSchema from 'types/ContestSchema';
import ProjectSchema from 'types/ProjectSchema';
import List from 'yii-steroids/ui/list/List';
import ProjectCard from 'shared/ProjectCard';

const bem = html.bem('ContestEntriesPage');

@dal.hoc2(
    props => ({
        url: `/api/v1/contests/${props.contest.uid}/projects`,
        key: 'items',
    })
)
export default class ContestEntriesPage extends React.PureComponent {

    static propTypes = {
        contest: ContestSchema,
        items: PropTypes.arrayOf(ProjectSchema),
    };

    render() {
        if (this.props.isLoading) {
            return null;
        }

        return (
            <div className={bem.block()}>
                <div className={bem.element('card-list')}>
                    <List
                        listId='ContestEntriesPage'
                        itemView={ProjectCard}
                        itemProps={{
                            contestUid: this.props.contest.uid, //todo
                        }}
                        emptyText={__('No items')}
                        items={this.props.items}
                    />
                </div>
            </div>
        );
    }
}
