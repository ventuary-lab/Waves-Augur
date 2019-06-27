import React from 'react';
// import PropTypes from 'prop-types';

import {html} from 'components';

import './ProjectDetailsPage.scss';

const bem = html.bem('ProjectDetailsPage');

export default class ProjectDetailsPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                ProjectDetailsPage
            </div>
        );
    }
}
