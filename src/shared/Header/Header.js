import React from 'react';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getNavItems, getNavItem} from 'reducers/navigation';
import Link from 'ui/nav/Link';
import Form from 'ui/form/Form';
import InputField from 'ui/form/InputField';
import {html} from 'components';
import ProfileBlock from 'shared/ProfileBlock';
import HeaderNav from './views/HeaderNav';
import NavItemSchema from './../../types/NavItemSchema';
import RoutesEnum from '../../enums/RoutesEnum';
import user from '../../static/data/user';
import InputFieldSearchView from 'ui/form/InputField/InputFieldSearchView';
import InputFieldHamburgerSearchView from 'ui/form/InputField/InputFieldHamburgerSearchView';

import './Header.scss';

const bem = html.bem('Header');
const FORM_ID = 'search';

@connect(
    state => ({
        navItems: getNavItems(state, RoutesEnum.MAIN),
        inboxPageNavItem: getNavItem(state, RoutesEnum.PROFILE_INBOX),
        profilePageNavItem: getNavItem(state, RoutesEnum.PROFILE),
    })
)
export default class Header extends React.PureComponent {

    static propTypes = {
        navItems: PropTypes.arrayOf(NavItemSchema),
        inboxPageNavItem: NavItemSchema,
        profilePageNavItem: NavItemSchema,
    };

    constructor() {
        super(...arguments);

        this.toggleMenu = this.toggleMenu.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);

        this.state = {
            isMenuOpen: false,
        }
    }

    render() {
        const navItems = this.props.navItems.filter(item => ![RoutesEnum.PROFILE, RoutesEnum.PROFILE_INBOX, RoutesEnum.TEST].includes(item.id));

        return (
            <header className={bem.block()}>
                <div className={bem.element('inner')}>
                    <div className={bem.element('profile')}>
                        <ProfileBlock
                            user={user}
                            menuItems={[].concat(this.props.inboxPageNavItem, this.props.profilePageNavItem)}
                        />
                    </div>
                    <div className={bem.element('logo')}>
                        <span className='Icon Icon__logo'/>
                    </div>
                    <div className={bem.element('nav')}>
                        <HeaderNav navItems={navItems}/>
                    </div>
                    <div className={bem.element('form')}>
                        <Form formId={FORM_ID}>
                            <InputField
                                attribute='search'
                                placeholder={__('Search')}
                                view={InputFieldSearchView}
                            />
                        </Form>
                    </div>
                    <button
                        className={bem(bem.element('menu-toggle'), 'material-icons')}
                        onClick={this.toggleMenu}
                    >
                        {this.state.isMenuOpen ? 'close' : 'menu'}
                    </button>
                    {this.renderMenu()}
                </div>
            </header>
        );
    }

    toggleMenu() {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen,
        })
    }

    renderMenu() {
        const navItems = this.props.navItems.filter(item => ![RoutesEnum.PROFILE, RoutesEnum.PROFILE_INBOX].includes(item.id));

        return (
            <div className={bem.element('menu', {
                hidden: !this.state.isMenuOpen,
            })}>
                <ul className={bem.element('menu-list', 'profile')}>
                    {[].concat(this.props.inboxPageNavItem, this.props.profilePageNavItem).map(menuItem => (
                        <li
                            className={bem.element('menu-item')}
                            key={menuItem.id}
                        >
                            <Link
                                className={bem.element('menu-link', {active: menuItem.isActive})}
                                to={menuItem.url}
                                label={menuItem.title}
                                onClick={() => this.onMenuClick(menuItem.url)}
                            />
                        </li>
                    ))}
                    <li className={bem.element('menu-item')}>
                        <button
                            className={bem.element('menu-link', 'logout')}
                            onClick={() => console.log('logout')}
                        >
                            Log Out
                        </button>
                    </li>
                </ul>
                <ul className={bem.element('menu-list', 'nav')}>
                    {navItems.map(navItem => (
                        <li
                            className={bem.element('menu-item')}
                            key={navItem.id}
                        >
                            <Link
                                className={bem.element('menu-link', {active: navItem.isActive})}
                                to={navItem.url}
                                label={navItem.title}
                                onClick={() => this.onMenuClick(navItem.url)}
                            />
                        </li>
                    ))}
                </ul>
                <div className={bem.element('menu-form')}>
                    <Form formId={FORM_ID}>
                        <InputField
                            attribute='search'
                            placeholder={__('Search')}
                            view={InputFieldHamburgerSearchView}
                        />
                    </Form>
                </div>
            </div>
        )
    }

    onMenuClick(url) {
        this.setState({isMenuOpen: false}, () => this.props.dispatch(push(url)))
    }
}
