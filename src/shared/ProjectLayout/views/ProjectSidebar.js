import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import Button from 'yii-steroids/ui/form/Button';
import {isPhone} from 'yii-steroids/reducers/screen';
import {getUser} from 'yii-steroids/reducers/auth';
import _get from 'lodash-es/get';

import {html, dal} from 'components';
import DalHelper from 'components/dal/DalHelper';
import Tags from 'shared/Tags';
import ProjectProgress from 'shared/ProjectProgress';
import projectAvatarStub from 'static/images/project-avatar-stub.png';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import ProjectReportModal from 'modals/ProjectReportModal';

import ProjectSchema from 'types/ProjectSchema';
import './ProjectSidebar.scss';
import Link from 'yii-steroids/ui/nav/Link';
import {openModal} from 'yii-steroids/actions/modal';
import ProjectWizardModal from 'modals/ProjectWizardModal';
import MessageModal from 'modals/MessageModal';
import UserSchema from 'types/UserSchema';

const bem = html.bem('ProjectSidebar');

@connect(
    (state, props) => ({
        isPhone: isPhone(state),
        scope: DalHelper.getScope(props.project, getUser(state))
    })
)
export default class ProjectSidebar extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
        user: UserSchema,
    };

    render() {
        const status = this.props.project.status;

        return (
            <div className={bem.block({
                contest: !!this.props.project.contest,
                contestWinner: !!this.props.project.contestWinner,
            })}>

                {this.props.project.contest && (
                    <div className={bem.element('ribbons')}>
                        <div className={bem.element('ribbon')}>
                            {__('contest')}
                        </div>
                        {this.props.project.contestWinner && (
                            <div className={bem.element('ribbon', 'winner')}>
                                {__('winner')}
                            </div>
                        )}
                    </div>
                )}
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
                                <td>{__('Crowdfunding ends')}</td>
                                <td>
                                    {moment(this.props.project.expireVoting).format('DD.MM.YYYY')}
                                </td>
                            </tr>
                            <tr>
                                <td>{__('Demo day')}</td>
                                <td>{moment(this.props.project.expireCrowd).format('DD.MM.YYYY')}</td>
                            </tr>
                        </tbody>
                    </table>
                    {(this.props.scope.canContestWinner) && (
                        <div className={bem.element('action')}>
                            <Button
                                label={__('Choose as a Winner')}
                                onClick={() => {
                                    if (this.props.isPhone) {
                                        this.props.dispatch(openModal(MessageModal, {
                                            icon: 'Icon__log-in-from-pc',
                                            title: __('Log in from PC'),
                                            color: 'success',
                                            description: __('This functionality is currently only available in the desktop version of Ventuary DAO. Sorry for the inconvenience.'),
                                        }));
                                    } else {
                                        dal.chooseProjectAsContestWinner(this.props.project.uid, this.props.project.contest);
                                    }
                                }}
                            />
                        </div>
                    )}

                    {(this.props.scope.canVote || this.props.scope.canDonate) && (
                        <div className={bem.element('action')}>
                            <Button
                                label={status === ProjectStatusEnum.VOTING ? __('Vote') : __('Donate')}
                                onClick={() => {
                                    if (this.props.isPhone) {
                                        this.props.dispatch(openModal(MessageModal, {
                                            icon: 'Icon__log-in-from-pc',
                                            title: __('Log in from PC'),
                                            color: 'success',
                                            description: __('This functionality is currently only available in the desktop version of Ventuary DAO. Sorry for the inconvenience.'),
                                        }));
                                    } else {
                                        window.scrollTo(0, 200);
                                        const el = document.querySelector('textarea[name=review]');
                                        el && el.focus();
                                    }
                                }}
                            />
                        </div>
                    )}

                    {this.props.scope.canEdit && (
                        <Link
                            className={bem.element('edit')}
                            onClick={() => {
                                if (this.props.isPhone) {
                                    this.props.dispatch(openModal(MessageModal, {
                                        icon: 'Icon__log-in-from-pc',
                                        title: __('Log in from PC'),
                                        color: 'success',
                                        description: __('This functionality is currently only available in the desktop version of Ventuary DAO. Sorry for the inconvenience.'),
                                    }));
                                } else {
                                    this.props.dispatch(openModal(ProjectWizardModal, {
                                        project: this.props.project,
                                    }));
                                }
                            }}
                            noStyles
                        >
                            <svg className={bem.element('edit-icon')} width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M13.7725 3.14373C14.0758 2.84044 14.0758 2.33495 13.7725 2.04722L11.9528 0.227468C11.665 -0.0758228 11.1596 -0.0758228 10.8563 0.227468L9.42536 1.6506L12.3416 4.56687L13.7725 3.14373ZM0 11.0837V14H2.91626L11.5173 5.3912L8.60103 2.47493L0 11.0837Z' />
                            </svg>
                            {__('Edit profile')}
                        </Link>
                    )}

                    {_get(this.props, 'user.address') && (
                        <span
                            className={bem.element('report')}
                            onClick={() => this.props.dispatch(openModal(ProjectReportModal, {
                                project: this.props.project,
                            }))}
                        >
                            <div className={bem.element('report-icon')}>
                                <span className={'MaterialIcon'}>
                                    block
                                </span>
                            </div>
                            {__('Report')}
                        </span>
                    )}

                </div>
            </div>
        );
    }
}
