import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'ui/nav/Link';
import Button from 'ui/form/Button';

import {html} from 'components';
import NavItemSchema from 'types/NavItemSchema';

import './ProfileBlock.scss';

const bem = html.bem('ProfileBlock');

@connect()
export default class ProfileBlock extends React.PureComponent {

    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            avatar: PropTypes.string,
            balance: PropTypes.number,
        }),
        menuItems: PropTypes.arrayOf(NavItemSchema)
    };

    constructor() {
        super(...arguments);

        this.toggleMenu = this.toggleMenu.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);

        this.state = {
            isMenuOpen: false,
        }
    }

    // TODO: logout
    render() {
        return (
            <div className={bem.block()}>
                <img
                    className={bem.element('avatar')}
                    src={this.props.user.avatar || '/images/avatar-stub.png'}
                    alt={this.props.user.name}
                />
                <div className={bem.element('inner')}>
                    <div className={bem.element('balance')}>
                        {this.props.user.balance}
                    </div>
                    <div className={bem.element('info')}>
                        <div className={bem.element('name')}>
                            {this.props.user.name}
                        </div>
                        <button
                            className={bem(bem.element('menu-toggle'), 'MaterialIcon')}
                            onClick={this.toggleMenu}
                        >
                            {this.state.isMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                        </button>
                        <ul className={bem.element('menu', {
                            hidden: !this.state.isMenuOpen
                        })}>
                            {this.props.menuItems.map(menuItem => (
                                <li
                                    className={bem.element('menu-item')}
                                    key={menuItem.id}
                                >
                                    <Link
                                        className={bem.element('menu-link', {
                                            active: menuItem.isActive,
                                        })}
                                        to={menuItem.url}
                                        label={menuItem.title}
                                        onClick={() => this.onMenuClick(menuItem.url)}
                                    />
                                </li>
                            ))}
                            <li className={bem.element('menu-item')}>
                                <Button
                                    className={bem.element('menu-link', 'logout')}
                                    onClick={() => console.log('logout')}
                                    label={__('Log Out')}
                                />
                            </li>
                        </ul>
                    </div>
                </div>
                <Link
                    className={bem.element('notification')}
                    to={'/'}
                >
                    <span className={bem(bem.element('notification-icon'), 'MaterialIcon')}>notifications</span>
                </Link>
            </div>
        );
    }

    toggleMenu() {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen,
        })
    }

    onMenuClick(url) {
        this.setState({isMenuOpen: false}, () => this.props.dispatch(push(url)))
    }
}