import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import SocialLinksSchema from 'types/SocialLinksSchema';
import SocialEnum from 'enums/SocialEnum';

import './SocialLinks.scss';

const bem = html.bem('SocialLinks');

export default class SocialLinks extends React.PureComponent {

    static propTypes = {
        items: SocialLinksSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                {this.props.items.map(item => (
                    <a
                        key={item.id}
                        href={item.link}
                        target={'_blank'}
                        className={bem.element('item')}
                    >
                        <span className={SocialEnum.getCssClass(item.id)}/>
                    </a>
                ))}
            </div>
        );
    }
}