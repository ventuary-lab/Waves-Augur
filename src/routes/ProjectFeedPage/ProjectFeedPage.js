import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash-es/isEqual';

import { dal as DalClass, html} from 'components';
const dal = DalClass();

import './ProjectFeedPage.scss';
import ProjectSchema from 'types/ProjectSchema';
import FeedSchema from 'types/FeedSchema';
import List from 'yii-steroids/ui/list/List';
import FeedCard from 'shared/FeedCard';

const bem = html.bem('ProjectFeedPage');

export default class ProjectFeedPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
        items: PropTypes.arrayOf(FeedSchema),
    };

    constructor() {
        super(...arguments);

        this.state = {
            items: null,
        };
    }

    componentDidMount() {
        this.getProjectFeed();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.project && nextProps.project && !_isEqual(this.props.project, nextProps.project)) {
            this.getProjectFeed();
        }
    }

    getProjectFeed() {
        dal.getProjectFeed(this.props.project.uid)
            .then(items => this.setState({items}));
    }

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('card-list')}>
                    <List
                        listId='ProjectFeedPage'
                        itemView={FeedCard}
                        itemProps={{
                            uid: this.props.project.uid,
                        }}
                        emptyText={__('No items')}
                        items={this.state.items}
                    />
                </div>
            </div>
        );
    }
}
