import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import Button from 'yii-steroids/ui/form/Button';

import {html} from 'components';
import Tags from 'shared/Tags';
import ProjectProgress from 'shared/ProjectProgress';
import projectAvatarStub from 'static/images/project-avatar-stub.png';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import ProjectSchema from 'types/ProjectSchema';
import './ProjectSidebar.scss';
import Link from 'yii-steroids/ui/nav/Link';
import {openModal} from 'yii-steroids/actions/modal';
import ProjectWizardModal from 'modals/ProjectWizardModal';
import UserSchema from 'types/UserSchema';

const bem = html.bem('ProjectSidebar');

@connect()
export default class ProjectSidebar extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
        user: UserSchema,
    };

    render() {
        const status = this.props.project.status;

        return (
            <div className={bem.block()}>
                <img
                    className={bem.element('avatar')}
                    src={this.props.project.logoUrl || projectAvatarStub}
                    alt={this.props.project.name}
                />
                <div className={bem.element('inner')}>
                    <span className={bem.element('name')}>
                        {this.props.project.name}
                    </span>
                    <span className={bem.element('description')}>
                        {this.props.project.description}
                    </span>

                    <div className={bem.element('progress')}>
                        <ProjectProgress
                            targetWaves={this.props.project.targetWaves}
                            positiveBalance={this.props.project.positiveBalance}
                            negativeBalance={this.props.project.negativeBalance}
                        />
                    </div>
                    <div className={bem.element('status')}>
                        <span>{__('Status')}:</span>
                        <span>
                            {ProjectStatusEnum.getLabel(status)}
                        </span>
                    </div>
                    {this.props.project.tags && this.props.project.tags.length > 0 && (
                        <div className={bem.element('tags')}>
                            <Tags
                                items={this.props.project.tags}
                            />
                        </div>
                    )}
                    <table className={bem.element('crowdfunding')}>
                        <tbody>
                            <tr>
                                <td>{__('Crowdfunding')}</td>
                                <td>
                                    {moment(this.props.project.expireVoting).format('DD.MM.YYYY')}
                                </td>
                            </tr>
                            <tr>
                                <td>{__('Finish')}</td>
                                <td>{moment(this.props.project.expireCrowd).format('DD.MM.YYYY')}</td>
                            </tr>
                        </tbody>
                    </table>
                    {(this.props.project.canVote || this.props.project.canDonate) && (
                        <div className={bem.element('action')}>
                            <Button
                                label={status === ProjectStatusEnum.VOTING ? __('Vote') : __('Donate')}
                                onClick={() => {
                                    window.scrollTo(0, 200);
                                    const el = document.querySelector('textarea[name=review]');
                                    el && el.focus();
                                }}
                            />
                        </div>
                    )}
                    {this.props.project.canEdit && (
                        <Link
                            label={__('Edit project')}
                            onClick={() => this.props.dispatch(openModal(ProjectWizardModal, {
                                project: this.props.project,
                            }))}
                        />
                    )}
                </div>
            </div>
        );
    }
}
