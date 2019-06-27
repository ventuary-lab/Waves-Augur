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
        currentWaves: PropTypes.number,
        againstWaves: PropTypes.number,
        targetWaves: PropTypes.number,
        expireVoting: PropTypes.string,
        expireCrowd: PropTypes.string,
        expireWhale: PropTypes.string,
    };

    render() {
        const isNew = this.props.currentWaves === 0;
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
                </div>
                <div className={bem.element('actions')}>
                    {isNew && (
                        <Link
                            className={bem.element('link')}
                            toRoute={ROUTE_PROJECT_FEED}
                            toRouteParams={{
                                address: this.props.address
                            }}
                            label={'Voting'}
                            noStyles
                        />
                    ) || (
                        <Link
                            className={bem.element('link')}
                            toRoute={ROUTE_PROJECT_DETAILS}
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
