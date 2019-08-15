import React from 'react';
import PropTypes from 'prop-types';

import {html, dal} from 'components';

import './CommunityPage.scss';
import ProjectSchema from 'types/ProjectSchema';
import List from 'yii-steroids/ui/list/List';
import UserCard from 'shared/UserCard';

const bem = html.bem('CommunityPage');

@dal.hoc2(
    () => ({
        url: '/api/v1/users',
        key: 'items',
    })
)
export default class CommunityPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(ProjectSchema),
    };

    render() {
        if (!this.props.items) {
            return null;
        }

        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col'}>
                            <div className={bem.element('inner')}>
                                <List
                                    listId='CommunityPage'
                                    itemView={UserCard}
                                    emptyText={__('No users')}
                                    items={this.props.items}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
