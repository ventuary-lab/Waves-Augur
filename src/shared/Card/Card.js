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

    };

    render() {
        const LeftComponent = _get(this.props, 'left.component');
        // const CenterComponent = _get(this.props, 'center.component');
        const RightComponent = _get(this.props, 'right.component');

        return (
            <div className={bem.block()}>
                <div className={bem.element('column-left')}>
                    {LeftComponent && (
                        <LeftComponent {...this.props.left.componentProps}/>
                    )}
                </div>
                <div className={bem.element('column-right')}>
                    {RightComponent && (
                        <RightComponent {...this.props.right.componentProps}/>
                    )}
                </div>
            </div>
        );
    }
}
