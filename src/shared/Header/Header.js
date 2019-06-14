import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {getNavItems, getNavItem} from 'yii-steroids/reducers/navigation';
import Link from 'yii-steroids/ui/nav/Link';

import {html} from 'components';
import NavItemSchema from './../../types/NavItemSchema';

const bem = html.bem('page-header');

@connect(
    state => ({
        navItems: getNavItems(state, 'root'),
    })
)
export default class Header extends React.PureComponent {

    static propTypes = {
        navItems: PropTypes.arrayOf(NavItemSchema),
    };

    render() {
        return (
            <header className={bem.block()}>
                {this.props.navItems.map((navItem, index) => (
                    <Link
                        label={navItem.label}
                        to={navItem.url}
                        key={index}
                    />
                ))}
            </header>
        );
    }
}
