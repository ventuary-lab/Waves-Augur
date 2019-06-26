import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import SocialEnum from 'enums/SocialEnum';

import './SocialLinks.scss';

const bem = html.bem('SocialLinks');

export default class SocialLinks extends React.PureComponent {

    static propTypes = {
        urls: PropTypes.object,
    };

    render() {
        return (
            <div className={bem.block()}>
                {Object.keys(this.props.urls || {})
                    .filter(name => !!this.props.urls[name])
                    .map(name => (
                        <a
                            key={name}
                            href={this.props.urls[name]}
                            target='_blank'
                            className={bem.element('item')}
                            title={SocialEnum.getLabel(name.replace('url_', ''))}
                        >
                            <span className={SocialEnum.getCssClass(name.replace('url_', ''))}/>
                        </a>
                    ))
                }
            </div>
        );
    }
}
