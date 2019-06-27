import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './Tags.scss';

const bem = html.bem('Tags');

export default class Tags extends React.PureComponent {

    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.string),
    };

    render() {
        return (
            <ul className={bem.block()}>
                {this.props.items.map((item, index) => (
                    <li
                        key={index}
                        className={bem.element('item')}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        );
    }
}
