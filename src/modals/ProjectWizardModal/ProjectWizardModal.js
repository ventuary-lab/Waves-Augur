import React from 'react';
import Modal from 'yii-steroids/ui/modal/Modal';

import {html} from 'components';

import ProjectWizard from './views/ProjectWizard';


import './ProjectWizardModal.scss';
import ProjectSchema from 'types/ProjectSchema';

const bem = html.bem('ProjectWizardModal');

export default class ProjectWizardModal extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <ProjectWizard
                    project={this.props.project}
                    onClose={this.props.onClose}
                />
            </Modal>
        );
    }
}
