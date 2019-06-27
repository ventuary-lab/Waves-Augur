import React from 'react';
// import PropTypes from 'prop-types';

import {html} from 'components';

import './ProjectFeedPage.scss';

const bem = html.bem('ProjectFeedPage');

export default class ProjectFeedPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                ProjectFeedPage
            </div>
        );
    }
}
