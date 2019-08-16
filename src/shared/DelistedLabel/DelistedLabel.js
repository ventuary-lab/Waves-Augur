import React from 'react';
import PropTypes from 'prop-types';
import ProjectReportReasonsEnum from 'enums/ProjectReportReasonsEnum';

import {html} from 'components';
import './DelistedLabel.scss';

const bem = html.bem('DelistedLabel');

export default class DelistedLabel extends React.PureComponent {

    static propTypes = {
        reason: PropTypes.string,
        noMobileTooltip: PropTypes.bool,
    };

    render() {
        return (
            <div className={bem.block({'no-mobile-tooltip': this.props.noMobileTooltip})}>
                <span className={bem.element('label')}>
                    {__('delisted')}
                </span>
                <div className={bem.element('icon')}>
                    <span className={'Icon Icon__question-in-circle'}/>
                    <div className={bem.element('tooltip-container')}>
                        <div className={bem.element('tooltip')}>
                            {__('Community delisted the project because it was reported  that it {reason}.', {
                                reason: ProjectReportReasonsEnum.getContext(this.props.reason)
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
