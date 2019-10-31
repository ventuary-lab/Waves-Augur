import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { isPhone } from 'yii-steroids/reducers/screen';

import Tags from 'shared/Tags';
import Hint from 'shared/Hint';
import projectAvatarStub from 'static/images/project-avatar-stub.png';
import ContestStatusEnum from 'enums/ContestStatusEnum';
import DalHelper from 'components/dal/DalHelper';

import ContestSchema from 'types/ContestSchema';
import './ContestSidebar.scss';
import Link from 'yii-steroids/ui/nav/Link';
import { openModal } from 'yii-steroids/actions/modal';
import ContestWizardModal from 'modals/ContestWizardModal';
import UserSchema from 'types/UserSchema';
import { getUser } from 'yii-steroids/reducers/auth';
import { dal, html } from 'components';
import { ReduxModalContext } from 'shared/Layout/context';

const bem = html.bem('ContestSidebar');

@connect(
    (state, props) => ({
        isPhone: isPhone(state),
        scope: DalHelper.getScope(props.contest, getUser(state))
    })
)
export default class ContestSidebar extends React.PureComponent {

    static propTypes = {
        contest: ContestSchema,
        user: UserSchema,
    };

    render() {
        const status = this.props.contest.status;

        return (
            <div className={bem.block()}>
                <img
                    className={bem.element('avatar')}
                    src={this.props.contest.logoUrl || projectAvatarStub}
                    alt={this.props.contest.name}
                />
                <div className={bem.element('inner')}>
                    <span className={bem.element('name')}>
                        {this.props.contest.name}
                    </span>
                    <span className={bem.element('description')}>
                        {this.props.contest.description}
                    </span>

                    <div className={bem.element('status')}>
                        <span>{__('Status')}:</span>
                        <span>
                            {ContestStatusEnum.getLabel(status)}
                        </span>
                    </div>
                    {this.props.contest.tags && this.props.contest.tags.length > 0 && (
                        <div className={bem.element('tags')}>
                            <Tags
                                items={this.props.contest.tags}
                            />
                        </div>
                    )}
                    <table className={bem.element('dates')}>
                        <tbody>
                            <tr>
                                <td>{__('End of registration period')}</td>
                                <td>
                                    {moment(this.props.contest.expireEntries).format('DD.MM.YYYY')}
                                </td>
                                <td>
                                    <Hint text={__('This is estimated date based on average block time (~1 min). Actuall time is {value} block', {
                                        value: Math.abs(dal.dateToHeight(this.props.contest.expireEntries))
                                    })}/>
                                </td>
                            </tr>
                            <tr>
                                <td>{__('Implementation Deadline')}</td>
                                <td>{moment(this.props.contest.expireImplementation).format('DD.MM.YYYY')}</td>
                                <td>
                                    <Hint text={__('This is estimated date based on average block time (~1 min). Actuall time is {value} block', {
                                        value: Math.abs(dal.dateToHeight(this.props.contest.expireImplementation))
                                    })}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={bem.element('reward')}>
                        <span>{__('Reward')}</span>
                        <span>
                            {this.props.contest.rewardWaves} 🔹
                        </span>
                    </div>

                    {this.props.scope.canEdit && (
                        <ReduxModalContext.Consumer>
                            {({ openLoginModal }) => (
                                <Link
                                    className={bem.element('edit')}
                                    onClick={() => {
                                        if (this.props.isPhone) {
                                            openLoginModal();
                                        } else {
                                            this.props.dispatch(openModal(ContestWizardModal, {
                                                contest: this.props.contest,
                                            }));
                                        }
                                    }}
                                    noStyles
                                >
                                    <svg className={bem.element('edit-icon')} width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <path d='M13.7725 3.14373C14.0758 2.84044 14.0758 2.33495 13.7725 2.04722L11.9528 0.227468C11.665 -0.0758228 11.1596 -0.0758228 10.8563 0.227468L9.42536 1.6506L12.3416 4.56687L13.7725 3.14373ZM0 11.0837V14H2.91626L11.5173 5.3912L8.60103 2.47493L0 11.0837Z' />
                                    </svg>
                                    {__('Edit contest')}
                                </Link>
                            )}
                        </ReduxModalContext.Consumer>
                    )}
                </div>
            </div>
        );
    }
}
