import React from 'react';
import PropTypes from 'prop-types';

import ActionButtonBlock from 'shared/ActionButtonBlock';

import {html} from 'components';

import './ProfileVotingPage.scss';

const bem = html.bem('ProfileVotingPage');

export default class ProfileVotingPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.array,
    };

    render() {
        return (
            <div className={bem.block()}>
                <ActionButtonBlock
                    title={__('Explore New Ideas')}
                    iconClass={'Icon__explore-ideas'}
                />
            </div>
        );
    }
}
