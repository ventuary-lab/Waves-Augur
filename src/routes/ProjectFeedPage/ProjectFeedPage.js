import React from 'react';
// import PropTypes from 'prop-types';

import {html} from 'components';
import VotingForm from 'shared/VotingForm';

import './ProjectFeedPage.scss';

const bem = html.bem('ProjectFeedPage');

export default class ProjectFeedPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('form-block')}>
                    <VotingForm/>
                </div>

                ProjectFeedPage

            </div>
        );
    }
}
