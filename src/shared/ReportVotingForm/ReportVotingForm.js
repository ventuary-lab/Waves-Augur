import React from 'react';
import Button from 'yii-steroids/ui/form/Button';

import {dal, html} from 'components';
import ProjectSchema from 'types/ProjectSchema';
import ProjectReportReasonsEnum from 'enums/ProjectReportReasonsEnum';

import './ReportVotingForm.scss';


const bem = html.bem('ReportVotingForm');

export default class ReportVotingForm extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('text')}>
                    <p>
                        {__('It was reported that this project {reason}', {
                            reason: ProjectReportReasonsEnum.getContext(this.props.project.lastReports[0].report.reason)
                        })}
                    </p>
                    <p>
                        {__('You can vote for delisting or not delisting the project. Anyway you need to send in the deposit 1 WAVES for your vote. If the community vote just like you the deposit will be returned to you.')}
                    </p>
                </div>
                <div className={bem.element('actions')}>
                    <Button
                        className={bem.element('action')}
                        color='danger'
                        onClick={() => this.reportProject('negative')}
                    >
                        {__('Delist the Project')}
                    </Button>
                    <Button
                        className={bem.element('action')}
                        color='primary'
                        onClick={() => this.reportProject('positive')}
                    >
                        {__('Do not Delist the Project')}
                    </Button>
                </div>
            </div>
        );
    }

    reportProject(direction) {
        const project = this.props.project;

        dal.reportProject(project.uid, {
            id: project.nextReportId,
            reason: project.lastReports[0].report.reason,
            direction: direction,
        });
    }
}
