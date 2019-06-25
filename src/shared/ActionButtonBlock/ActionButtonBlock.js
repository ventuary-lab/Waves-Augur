import React from 'react';
import PropTypes from 'prop-types';
import _isFunction from 'lodash-es/isFunction';

import {html} from 'components';

import './ActionButtonBlock.scss';

const bem = html.bem('ActionButtonBlock');

export default class ActionButtonBlock extends React.PureComponent {

    static propTypes = {
        title: PropTypes.string,
        iconClass: PropTypes.string,
        handleClick: PropTypes.func,
    };

    render() {
        return (
            <div
                className={bem.block()}
                onClick={_isFunction(this.props.handleClick) ? this.props.handleClick : null}
            >
                <div className={bem.element('container')}>
                    <div className={bem.element('inner')}>
                        <div className={bem.element('icon')}>
                            <span className={`Icon ${this.props.iconClass}`}/>
                        </div>
                        <span className={bem.element('title')}>
                            {this.props.title}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
