import React from 'react';
import PropTypes from 'prop-types';
import AssetIcon from 'ui/global/AssetIcon';

import { html } from 'components';

import './ProjectProgress.scss';

const bem = html.bem('ProjectProgress');

export default class ProjectProgress extends React.PureComponent {
    static propTypes = {
        targetWaves: PropTypes.number,
        positiveBalance: PropTypes.number,
        negativeBalance: PropTypes.number,
    };

    render() {
        const percent = Math.floor(
            Math.max(0, Math.min(100, (100 * this.props.positiveBalance) / this.props.targetWaves))
        );

        return (
            <div className={bem.block()}>
                <div className={bem.element('progress')}>
                    <div className={bem.element('progress-info')}>
                        <span className={bem.element('current-waves')}>
                            <span>{this.props.positiveBalance || 0}</span>
                            <AssetIcon />
                        </span>
                        <span className={bem.element('against-waves')}>
                            <span>{this.props.negativeBalance || 0}</span>
                            <AssetIcon />
                            <span>{__('against')}</span>
                        </span>
                        <span className={bem.element('percent')}>{percent}%</span>
                    </div>
                    <div className={bem.element('progress-line-container')}>
                        <div
                            className={bem.element('progress-line')}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>
                <div className={bem.element('target-waves')}>
                    <div>
                        <span>{this.props.targetWaves}</span>
                        <AssetIcon />
                    </div>
                    <span>{__('target sum')}</span>
                </div>
            </div>
        );
    }
}
