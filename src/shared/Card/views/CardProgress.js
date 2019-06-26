import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import './CardProgress.scss';

const bem = html.bem('CardProgress');


export default class CardProgress extends React.PureComponent {

    static propTypes = {
        currentWaves: PropTypes.number,
        againstWaves: PropTypes.number,
        targetWaves: PropTypes.number,
        status: PropTypes.oneOf(ProjectStatusEnum),
    };

    render() {
        const isNew = this.props.currentWaves === 0;
        const percent = this.props.currentWaves * 100 / this.props.targetWaves;

        return (
            <div className={bem.block()}>
                <div className={bem.element('status-icon')}>
                    {this.props.status === ProjectStatusEnum.GRANT && (
                        <span className={'Icon Icon__grant'}/>
                    )}
                    {this.props.status === ProjectStatusEnum.CROWDFUND && (
                        <span className={'Icon Icon__crowdfunded'}/>
                    )}

                    {this.props.status === ProjectStatusEnum.VOTING && (
                        <>
                            {isNew
                                ? <span className={'Icon Icon__new'}/>
                                : <span className={'Icon Icon__process Icon__process_green'}/>
                            }
                        </>
                    )}

                </div>
                <div className={bem.element('info')}>
                    <div className={bem.element('progress')}>
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
                    </div>
                </div>
                <div className={bem.element('actions')}>
                    {isNew && (
                        <span>
                            {__('Voting')}
                        </span>
                    ) || (
                        <span>
                            {__('ReadMore')}
                        </span>
                    )}
                </div>
            </div>
        );
    }
}
