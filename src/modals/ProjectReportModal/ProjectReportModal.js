import React from 'react';
import Modal from 'yii-steroids/ui/modal/Modal';
import RadioListField from 'yii-steroids/ui/form/RadioListField';
import ProjectReportEnum from 'enums/ProjectReportEnum';
import Form from 'yii-steroids/ui/form/Form';
import Button from 'yii-steroids/ui/form/Button';

import ProjectSchema from 'types/ProjectSchema';
import ProjectReportReasonsEnum from 'enums/ProjectReportReasonsEnum';
import {dal as Dal, html} from 'components';
const dal = Dal();


import './ProjectReportModal.scss';

const FROM_ID = 'ProjectReportModal';
const bem = html.bem('ProjectReportModal');

export default class ProjectReportModal extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    render() {
        return (
            <Modal
                {...this.props.modalProps}
                className={bem.block()}
            >
                <Form
                    formId={FROM_ID}
                    onSubmit={values => {
                        return dal.reportProject(this.props.project.uid, {
                            reason: values.reason,
                            direction: ProjectReportEnum.NEGATIVE,
                        })
                            .then(() => this.props.onClose());
                    }}
                >
                    <div className={bem.element('title')}>
                        {__('Report the Project')}
                    </div>
                    <div className={bem.element('sub-title')}>
                        {__('Please choose a reason for delisting the project')}
                    </div>
                    <div className={bem.element('radio-list')}>
                        <RadioListField
                            attribute={'reason'}
                            items={ProjectReportReasonsEnum}
                        />
                    </div>
                    <div className={bem.element('action')}>
                        <Button
                            type='submit'
                            color='primary'
                            layoutClassName={bem.element('button')}
                        >
                            {__('Report')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        );
    }
}
