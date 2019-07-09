import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash-es/get';

import {html} from 'components';

import './Card.scss';

const bem = html.bem('Card');


export default class Card extends React.PureComponent {

    static propTypes = {
        left: PropTypes.shape({
            component: PropTypes.func,
            componentProps: PropTypes.object,
        }),
        right: PropTypes.shape({
            component: PropTypes.func,
            componentProps: PropTypes.object,
        }),
        onClick: PropTypes.func,

    };

    render() {
        const LeftComponent = _get(this.props, 'left.component');
        const RightComponent = _get(this.props, 'right.component');

        return (
            <div
                className={bem.block()}
                onClick={this.props.onClick || null}
            >
                {_get(this.props, 'left.component') && (
                    <div className={bem.element('column-left')}>
                        {LeftComponent && (
                            <LeftComponent {...this.props.left.componentProps}/>
                        )}
                    </div>
                )}
                <div className={bem.element('column-right')}>
                    {RightComponent && (
                        <RightComponent {...this.props.right.componentProps}/>
                    )}
                </div>
            </div>
        );
    }
}
