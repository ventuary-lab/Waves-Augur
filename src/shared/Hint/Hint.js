import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from 'shared/Tooltip';
import {html} from 'components';

import './Hint.scss';

const bem = html.bem('Hint');

export default class Hint extends React.PureComponent {

    static propTypes = {
        text: PropTypes.string,
        adaptive: PropTypes.bool,
    };

    render() {
        return (
            <div className={bem.block({adaptive: this.props.adaptive})}>
                <div className={bem.element('icon')}>
                    <span className={'Icon Icon__question-in-circle'}/>
                    {this.props.text && (
                        <div className={bem.element('tooltip')}>
                            <Tooltip
                                adaptive={this.props.adaptive}
                            >
                                {this.props.text}
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
