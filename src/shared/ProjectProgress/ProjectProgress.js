import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './ProjectProgress.scss';

const bem = html.bem('ProjectProgress');

export default class ProjectProgress extends React.PureComponent {

    static propTypes = {
        targetWaves: PropTypes.number,
        currentWaves: PropTypes.number,
        againstWaves: PropTypes.number,
    };

    render() {
        const percent = Math.max(0, Math.min(100, 100 * this.props.currentWaves / this.props.targetWaves));

        return (
            <div className={bem.block()}>
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
        );
    }
}
