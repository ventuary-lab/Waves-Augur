import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getNavUrl} from 'yii-steroids/reducers/navigation';
import Link from 'yii-steroids/ui/nav/Link';
import Form from 'yii-steroids/ui/form/Form';
import InputField from 'yii-steroids/ui/form/InputField';

import {html} from 'components';
import InputSearchView from 'shared/Header/views/InputSearchView';
import {ROUTE_ROOT} from 'routes';
import HeaderNav from './views/HeaderNav';
import HeaderProfile from './views/HeaderProfile';
import logoSvg from 'static/icons/logo.svg';

import './Header.scss';

const bem = html.bem('Header');

@connect(
    state => ({
        indexPageUrl: getNavUrl(state, ROUTE_ROOT),
    })
)
export default class Header extends React.PureComponent {

    static propTypes = {
        indexPageUrl: PropTypes.string,
    };

    render() {
        return (
            <header className={bem.block()}>
                <div className={bem.element('inner')}>
                    <Link
                        className={bem.element('logo')}
                        to={this.props.indexPageUrl}
                        noStyles
                    >
                        <img
                            className={bem.element('logo-image')}
                            src={logoSvg}
                            alt='Ventuary DAO'
                        />
                    </Link>
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
            </header>
        );
    }

}
