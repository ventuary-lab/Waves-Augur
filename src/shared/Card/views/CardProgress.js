import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';

import {html} from 'components';
import {ROUTE_PROJECT_FEED, ROUTE_PROJECT_DETAILS} from 'routes';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import ProjectProgress from 'shared/ProjectProgress';

import './CardProgress.scss';

const bem = html.bem('CardProgress');


export default class CardProgress extends React.PureComponent {

    static propTypes = {
        address: PropTypes.string,
        status: PropTypes.string,
        targetWaves: PropTypes.number,
        positiveBalance: PropTypes.number,
        negativeBalance: PropTypes.number,
        expireVoting: PropTypes.string,
        expireCrowd: PropTypes.string,
        expireWhale: PropTypes.string,
    };

    render() {
        const isNew = this.props.positiveBalance === 0;
        const status = this.props.status;

        return (
            <div className={bem.block()}>
                <div className={bem.element('status-icon')}>
                    {status === ProjectStatusEnum.GRANT && (
                        <span className={'Icon Icon__grant'}/>
                    )}
                    {status === ProjectStatusEnum.CROWDFUND && (
                        <span className={'Icon Icon__crowdfunded'}/>
                    )}

                    {status === ProjectStatusEnum.VOTING && (
                        <>
                            {isNew
                                ? <span className={'Icon Icon__new'}/>
                                : <span className={'Icon Icon__process Icon__process_green'}/>
                            }
                        </>
                    )}
                    {status === ProjectStatusEnum.WAITING_GRANT && (
                        <>
                            {this.props.positiveBalance >= this.props.negativeBalance
                                ? <span className={'Icon Icon__crowdfunded-positive'}/>
                                : <span className={'Icon Icon__crowdfunded-negative'}/>
                            }
                        </>
                    )}
                </div>
                <div className={bem.element('info')}>
                    <ProjectProgress
                        targetWaves={this.props.targetWaves}
                        positiveBalance={this.props.positiveBalance}
                        negativeBalance={this.props.negativeBalance}
                    />
                </div>
                <div className={bem.element('actions')}>
                    <Link
                        className={bem(bem.element('link'), 'read-more-link')}
                        toRoute={ROUTE_PROJECT_DETAILS}
                        toRouteParams={{
                            uid: this.props.uid
                        }}
                        label={__('Read More')}
                        noStyles
                    />
                </div>
            </div>
        );
    }
}
