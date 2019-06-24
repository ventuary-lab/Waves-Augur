import React from 'react';
import SvgIcon from 'components/global/common/SvgIcon';

import {
    tinyRect
} from 'ui/icon/index';

import { html } from 'components';
const bem: any = html.bem('ProgressLine');

const ProgressLine: React.FC<{ index: number }> = ({ index }) => {
    const lines = ['line-first', 'line-second'];
    const dots = Array(3).fill(1);

    return (
        <div className={bem.block()}>
            <div>
                {lines.map((line: string, lineIndex: number) => {
                    let computedLine = '';
                    if (index === 1 && lineIndex === 0 || index === 2) computedLine = 'passed-line';

                    return (
                    <div key={line} className={bem.element(`${line} ${computedLine}`)}></div>
                )})}
            </div>
            <div className={`${bem.element('dots-grid')} progress-step-${index}`}>
                {dots.map((dot: number, dotIndex: number) => {
                    return (
                        <SvgIcon className={index >= dotIndex ? 'passed-dot' : ''} icon={tinyRect} />
                    )
                })}
            </div>
        </div>
    )
}

export default ProgressLine;