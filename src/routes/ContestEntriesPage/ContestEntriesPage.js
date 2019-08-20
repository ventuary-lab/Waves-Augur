import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash-es/isEqual';

import {dal as Dal, html} from 'components';
const dal = Dal();

import './ContestEntriesPage.scss';
import ContestSchema from 'types/ContestSchema';
import ProjectSchema from 'types/ProjectSchema';
import List from 'yii-steroids/ui/list/List';
import ProjectCard from 'shared/ProjectCard';

const bem = html.bem('ContestEntriesPage');

export default class ContestEntriesPage extends React.PureComponent {

    static propTypes = {
        contest: ContestSchema,
        items: PropTypes.arrayOf(ProjectSchema),
    };

    constructor() {
        super(...arguments);

        this.state = {
            items: null,
        };
    }

    componentDidMount() {
        this.getContestEntries();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.contest && nextProps.contest && !_isEqual(this.props.contest, nextProps.contest)) {
            this.getContestEntries();
        }
    }

    getContestEntries() {
        dal.getContestEntries(this.props.contest.uid)
            .then(items => this.setState({items}));
    }

    render() {
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
                        items={this.state.items}
                    />
                </div>
            </div>
        );
    }
}
