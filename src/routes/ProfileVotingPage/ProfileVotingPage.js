import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';

import ActionButtonBlock from 'shared/ActionButtonBlock';
import {html} from 'components';
import {ROUTE_PROJECTS_REDIRECT} from 'routes';

import './ProfileVotingPage.scss';

const bem = html.bem('ProfileVotingPage');

export default class ProfileVotingPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.array,
    };

    render() {
        return (
            <div className={bem.block()}>
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
                <div className={bem.element('card-list')}>
                    VotingPage
                </div>
            </div>
        );
    }
}
