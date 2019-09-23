import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getNavUrl} from 'yii-steroids/reducers/navigation';
import Link from 'yii-steroids/ui/nav/Link';
import Form from 'yii-steroids/ui/form/Form';
import InputField from 'yii-steroids/ui/form/InputField';
import enhanceWithClickOutside from 'react-click-outside';

import {html} from 'components';
import InputSearchView from 'shared/Header/views/InputSearchView';
import {ROUTE_ROOT} from 'routes';
import HeaderNav from './views/HeaderNav';
import HeaderProfile from './views/HeaderProfile';
import HeaderHamburger from './views/HeaderHamburger';
import HeaderMobileMenu from './views/HeaderMobileMenu';
import logoSvg from 'static/icons/dao-logo-white.svg';

import './Header.scss';

const bem = html.bem('Header');

@connect(
    state => ({
        indexPageUrl: getNavUrl(state, ROUTE_ROOT),
    })
)
@enhanceWithClickOutside
export default class Header extends React.PureComponent {

    static propTypes = {
        indexPageUrl: PropTypes.string,
    };

    constructor() {
        super(...arguments);

        this.state = {
            isMenuOpen: false,
        };

        this.closeMenu = this.closeMenu.bind(this);
    }

    render() {
        return (
            <>
                <div className={bem.element('placeholder')}></div>
                <header className={bem.block()}>
                    <div className={bem.element('inner')}>
                        <div className={bem.element('hamburger')}>
                            <HeaderHamburger
                                onClick={() => this.setState({isMenuOpen: !this.state.isMenuOpen})}
                                isActive={this.state.isMenuOpen}
                            />
                        </div>
                        <a  
                            href={this.props.indexPageUrl}
                            className={bem.element('logo')}
                            noStyles>
                            <img
                                className={bem.element('logo-image')}
                                src={logoSvg}
                                alt='Ventuary DAO'
                            />
                        </a>
                        <div className={bem.element('nav')}>
                            <HeaderNav/>
                        </div>
                        <div className={bem.element('form')}>
                            <Form formId='HeaderSearch'>
                                <InputField
                                    layoutClassName={bem.element('search')}
                                    attribute='search'
                                    placeholder={__('Search')}
                                    view={InputSearchView}
                                />
                            </Form>
                        </div>
                        <div className={bem.element('profile')}>
                            <HeaderProfile/>
                        </div>
                    </div>
                    <div className={bem.element('menu', {active: this.state.isMenuOpen})}>
                        <HeaderMobileMenu
                            onClose={this.closeMenu}
                        />
                    </div>
                </header>
            </>
        );
    }

    handleClickOutside() {
        this.closeMenu();
    }

    closeMenu() {
        this.setState({isMenuOpen: false});
    }
}
