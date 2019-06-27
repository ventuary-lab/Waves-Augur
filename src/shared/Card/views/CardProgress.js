import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';

import {ROUTE_PROJECT_FEED} from 'routes';
import {html} from 'components';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import ProjectProgress from 'shared/ProjectProgress';

import './CardProgress.scss';

const bem = html.bem('CardProgress');


export default class CardProgress extends React.PureComponent {

    static propTypes = {
        address: PropTypes.string,
        currentWaves: PropTypes.number,
        againstWaves: PropTypes.number,
        targetWaves: PropTypes.number,
        expireVoting: PropTypes.string,
        expireCrowd: PropTypes.string,
        expireWhale: PropTypes.string,
    };

    render() {
        const isNew = this.props.currentWaves === 0;
        // const percent = this.props.currentWaves * 100 / this.props.targetWaves;
        const status = ProjectStatusEnum.getStatus(this.props);

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

                </div>
                <div className={bem.element('info')}>
                    <ProjectProgress
                        currentWaves={this.props.currentWaves}
                        targetWaves={this.props.targetWaves}
                        againstWaves={this.props.againstWaves}
                    />

                    {/*<div className={bem.element('progress')}>
                        <div className={bem.element('progress-info')}>
                            <span className={bem.element('current-waves')}>
                                {this.props.currentWaves || 0} W
                            </span>
                            <span className={bem.element('against-waves')}>
                                {this.props.againstWaves || 0} W {__('against')}
                            </span>
                            <span className={bem.element('percent')}>
                                {percent}%
                            </span>
                        </div>
                        <div className={bem.element('progress-line-container')}>
                            <div
                                className={bem.element('progress-line')}
                                style={{width: `${percent}%`}}
                            />
                        </div>
                    </div>
                    <div className={bem.element('target-waves')}>
                        {this.props.targetWaves} W <span>{__('target sum')}</span>
                    </div>*/}
                </div>
                <div className={bem.element('actions')}>
                    {isNew && (
                        <span>
                            {__('Voting')}
                        </span>
                    ) || (
                        <Link
                            toRoute={ROUTE_PROJECT_FEED}
                            toRouteParams={{
                                address: this.props.address
                            }}
                            label={'Read More'}
                            noStyles
                        />
                    )}
                </div>
            </div>
        );
    }
}
