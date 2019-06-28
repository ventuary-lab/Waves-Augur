import React from 'react';

import {html} from 'components';
import './ProjectDetailsPage.scss';

import ProjectSchema from 'types/ProjectSchema';
import DonateForm from 'shared/DonateForm';

const bem = html.bem('ProjectDetailsPage');

export default class ProjectDetailsPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('form-block')}>
                    <DonateForm/>
                </div>
            </div>

        );
    }
}
