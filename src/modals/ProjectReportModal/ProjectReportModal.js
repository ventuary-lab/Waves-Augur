import React from 'react';
import Modal from 'yii-steroids/ui/modal/Modal';
import RadioListField from 'yii-steroids/ui/form/RadioListField';
import ProjectReportEnum from 'enums/ProjectReportEnum';
import Form from 'yii-steroids/ui/form/Form';
import Button from 'yii-steroids/ui/form/Button';

import ProjectSchema from 'types/ProjectSchema';
import ProjectReportReasonsEnum from 'enums/ProjectReportReasonsEnum';
import {html, dal} from 'components';

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
                <div className={bem.element('title')}>
                    {__('Report the Project')}
                </div>
                <div className={bem.element('sub-title')}>
                    {__('Please choose a reason for delisting the project')}
                </div>
                <Form
                    formId={FROM_ID}
                    onSubmit={values => {
                        return  dal.reportProject(this.props.project.uid, {
                            id: this.props.project.nextReportId,
                            reason: values.reason,
                            direction: ProjectReportEnum.NEGATIVE,
                        });
                    }}
                    onComplete={() => this.props.onClose()}
                >
                    <div className={bem.element('radio-list')}>
                        <RadioListField
                            attribute={'reason'}
                            items={ProjectReportReasonsEnum}
                        />
                    </div>
                    <div className={bem.element('text')}>
                        <p>
                            {__('ATTENTION: you have to send in 1 WAVES as the deposit for perorting.')}
                        </p>
                        <p>
                            {__('If the community agree with your report  the deposit will be returned to you with a premium')}
                        </p>
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
