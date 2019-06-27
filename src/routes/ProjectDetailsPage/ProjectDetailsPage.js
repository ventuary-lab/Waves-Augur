import React from 'react';

import {html} from 'components';

import './ProjectDetailsPage.scss';
import ProjectSchema from 'types/ProjectSchema';

const bem = html.bem('ProjectDetailsPage');

export default class ProjectDetailsPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                ProjectDetailsPage
            </div>
        );
    }
}
