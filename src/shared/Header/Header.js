import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import { NavLink } from 'react-router-dom';

import {html} from 'components';
import NavItemSchema from './../../types/NavItemSchema';
import RoutesEnum from '../../enums/RoutesEnum';

const bem = html.bem('Header');

@connect(
    state => ({
        navItems: getNavItems(state, RoutesEnum.MAIN),
    })
)
export default class Header extends React.PureComponent {

    static propTypes = {
        navItems: PropTypes.arrayOf(NavItemSchema),
    };

    render() {
        console.log(this.props.navItems);
        return (
            <header className={bem.block()}>
                {this.props.navItems.map((navItem, index) => (
                    <NavLink
                        to={navItem.url}
                        key={index}
                    >
                        {navItem.label}
                    </NavLink>
                ))}
            </header>
        );
    }
}
