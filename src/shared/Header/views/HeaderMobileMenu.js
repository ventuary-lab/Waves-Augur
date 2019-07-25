import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';
import {getNavItems} from 'yii-steroids/reducers/navigation';
import InputField from 'yii-steroids/ui/form/InputField';
import Form from 'yii-steroids/ui/form/Form';

import {html} from 'components';
import InputFieldHamburgerSearchView from './InputFieldHamburgerSearchView';
import NavItemSchema from 'types/NavItemSchema';
import {ROUTE_ROOT} from 'routes';

import './HeaderMobileMenu.scss';

const bem = html.bem('HeaderMobileMenu');

@connect(
    state => ({
        navItems: getNavItems(state, ROUTE_ROOT),
    })
)
export default class HeaderMobileMenu extends React.PureComponent {

    static propTypes = {
        navItems: PropTypes.arrayOf(NavItemSchema),
        onClose: PropTypes.func,
    };

    render() {
        return (
            <div className={bem.block()}>
                <ul className={bem.element('list')}>
                    {this.props.navItems.filter(item => item.isNavVisible !== false).map(navItem => (
                        <li
                            key={navItem.id}
                            className={bem.element('item')}
                        >
                            {navItem.externalLink && (
                                <a
                                    className={bem.element('link', {
                                        'active': navItem.isActive,
                                    })}
                                    href={navItem.externalLink}
                                    target='_blank'
                                    onClick={this.props.onClose}
                                >
                                    <span className={'ButtonView__label'}>
                                        {navItem.label}
                                    </span>
                                </a>
                            ) || (
                                <Link
                                    className={bem.element('link', {
                                        'active': navItem.isActive,
                                    })}
                                    to={navItem.url}
                                    label={navItem.label}
                                    onClick={this.props.onClose}
                                    noStyles
                                />
                            )}
                        </li>
                    ))}
                </ul>
                <div className={bem.element('form')}>
                    <Form formId='HeaderMenuSearch'>
                        <InputField
                            attribute='search'
                            placeholder={__('Search')}
                            view={InputFieldHamburgerSearchView}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}
