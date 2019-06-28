import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import {getNavItems} from 'yii-steroids/reducers/navigation';

import {html} from 'components';
import NavItemSchema from 'types/NavItemSchema';
import {ROUTE_ROOT} from 'routes';

import './HeaderNav.scss';

const bem = html.bem('HeaderNav');

@connect(
    state => ({
        navItems: getNavItems(state, ROUTE_ROOT),
    })
)
export default class HeaderNav extends React.PureComponent {

    static propTypes = {
        navItems: PropTypes.arrayOf(NavItemSchema)
    };

    render() {
        return (
            <nav className={bem.block()}>
                <ul className={bem.element('list')}>
                    {this.props.navItems.filter(item => item.isNavVisible !== false).map(navItem => (
                        <li
                            key={navItem.id}
                            className={bem.element('item')}
                        >
                            <Link
                                className={bem.element('link', {
                                    'active': navItem.isActive,
                                })}
                                to={navItem.url}
                                label={navItem.label}
                                noStyles
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }
}
