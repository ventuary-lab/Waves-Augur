import React from 'react';
import PropTypes from 'prop-types';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';

import {html} from 'components';

import './ProfileContentFilter.scss';

const bem = html.bem('ProfileContentFilter');

@connect()
export default class ProfileContentFilter extends React.PureComponent {

    static propTypes = {
        navItems: PropTypes.array,
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
            <div className={bem.element('nav-container')}>
                <div className={bem.element('nav')}>
                    {this.props.navItems.map(item => (
                        <span
                            key={item.id}
                            className={bem.element('nav-item', {
                                'is-active': item.isActive,
                            })}
                            onClick={() => this.props.dispatch(push(item.url))}
                        >
                            <div className={bem.element('nav-icon')}>
                                <span className={`Icon ${item.isActive ? item.icon + '_green' : item.icon}`}/>
                            </div>
                            {item.label}
                        </span>
                    ))}
                </div>
            </div>
        );
    }
}
