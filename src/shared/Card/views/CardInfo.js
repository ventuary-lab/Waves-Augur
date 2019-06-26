import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './CardInfo.scss';

const bem = html.bem('CardInfo');


export default class CardInfo extends React.PureComponent {

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        country: PropTypes.string,
    };

    render() {
        return (
            <div className={bem.block()}>

                {this.props.title && (
                    <span className={bem.element('title')}>
                        {this.props.title}
                    </span>
                )}
                {this.props.description && (
                    <p className={bem.element('description')}>
                        {this.props.description}
                    </p>
                )}
                {this.props.country && (
                    <div className={bem.element('country')}>
                        <span className={'MaterialIcon'}>location_on</span>
                        &nbsp;
                        <span>{this.props.country}</span>
                    </div>
                )}
            </div>
        );
    }
}
