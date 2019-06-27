import React from 'react';
// import PropTypes from 'prop-types';

import {html} from 'components';

import './ProjectNewsPage.scss';

const bem = html.bem('ProjectNewsPage');

export default class ProjectNewsPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <div className={bem.block()}>
                ProjectNewsPage
            </div>
        );
    }
}
