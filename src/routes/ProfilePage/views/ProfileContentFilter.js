import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import _get from 'lodash-es/get';

import {html} from 'components';
import Nav from 'ui/nav/Nav';

import './ProfileContentFilter.scss';

const bem = html.bem('ProfileContentFilter');

@connect()
export default class ProfileContentFilter extends React.PureComponent {

    static propTypes = {
        navItems: PropTypes.array,
        title: PropTypes.string,
        isCurrentCompany: PropTypes.bool,
        navigation: PropTypes.bool,
    };

    render() {
        return (
            <div className={bem.block()}>
                {this.renderNav()}
                {this.props.children}
            </div>
        );
    }

    renderNav() {
        if (!this.props.navItems || this.props.navItems.length === 0) {
            return null;
        }

        return (
            <>
                <Nav
                    layout='tabs'
                    activeTab={_get(this.props.navItems.find(item => item.isActive), 'id')}
                    onChange={id => {
                        const item = this.props.navItems.find(item => item.id === id);
                        // Timeout for fix setState() call in Nav component
                        setTimeout(() => this.props.dispatch(push(item.url)));
                    }}
                    items={this.props.navItems.map(item => ({
                        id: item.id,
                        label: item.label,
                        url: item.url,
                    }))}
                />
            </>
        );
    }
}
