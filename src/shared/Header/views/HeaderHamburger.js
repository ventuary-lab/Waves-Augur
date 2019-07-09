import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import enhanceWithClickOutside from 'react-click-outside';

import {html} from 'components';
import NavItemSchema from 'types/NavItemSchema';
import {ROUTE_ROOT} from 'routes';

import './HeaderHamburger.scss';

const bem = html.bem('HeaderHamburger');

@connect(
    state => ({
        navItems: getNavItems(state, ROUTE_ROOT),
    })
)
@enhanceWithClickOutside
export default class HeaderHamburger extends React.PureComponent {

    static propTypes = {
        navItems: PropTypes.arrayOf(NavItemSchema)
    };

    constructor() {
        super(...arguments);

        this.state = {
            isMenuOpen: false,
        };
    }

    render() {
        return (
            <div className={bem.block()}>
                <button
                    className={bem.element('toggle', {active: this.state.isMenuOpen})}
                    onClick={() => this.setState({isMenuOpen: !this.state.isMenuOpen})}
                >
                    <div
                        className={bem.element('line')}
                        aria-hidden
                    />
                    <div
                        className={bem.element('line')}
                        aria-hidden
                    />
                    <div
                        className={bem.element('line')}
                        aria-hidden
                    />
                </button>
                <ul className={bem.element('list', {active: this.state.isMenuOpen})}>
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
                                onClick={() => this.setState({isMenuOpen: false})}
                                noStyles
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    handleClickOutside() {
        this.setState({isMenuOpen: false});
    }
}
