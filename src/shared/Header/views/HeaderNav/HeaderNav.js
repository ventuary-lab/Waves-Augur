import React from 'react';
import PropTypes from 'prop-types';
import Link from 'ui/nav/Link';

import {html} from 'components';
import NavItemSchema from '../../../../types/NavItemSchema';

import './HeaderNav.scss';

const bem = html.bem('HeaderNav');

export default class HeaderNav extends React.PureComponent {

    static propTypes = {
        navItems: PropTypes.arrayOf(NavItemSchema)
    };

    render() {
        return (
            <nav className={bem.block()}>
                <ul className={bem.element('list')}>
                    {this.props.navItems.map(navItem => (
                        <li
                            className={bem.element('item')}
                            key={navItem.id}
                        >
                            <Link
                                className={bem.element('link', {
                                    'active': navItem.isActive,
                                })}
                                to={navItem.url}
                                label={navItem.title}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        )
    }
}