import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import coverStub from '../../../static/images/cover-stub.png';
import avatarStub from '../../../static/images/avatar-stub.png';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';

import './CardInfo.scss';

const bem = html.bem('CardInfo');

export default class CardInfo extends React.PureComponent {

    static propTypes = {
        daysLeft: PropTypes.number,
        logoUrl: PropTypes.string,
        coverUrl: PropTypes.string,
        activity: PropTypes.number,
        status: PropTypes.string,


        title: PropTypes.string,
        description: PropTypes.string,
        country: PropTypes.string,
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('column-left')}>
                    <div
                        className={bem.element('cover')}
                        style={{
                            backgroundImage: `url(${this.props.coverUrl ? this.props.coverUrl : coverStub})`
                        }}
                    >
                        <img
                            className={bem.element('avatar')}
                            src={this.props.imageUrl || avatarStub}
                            alt='avatar'
                        />
                    </div>
                    <div className={bem.element('info')}>
                        {this.props.daysLeft && (
                            <span className={bem.element('days-left')}>
                                {this.props.daysLeft} {__('days left')}
                            </span>
                        )}
                        {this.props.activity && (
                            <span className={bem.element('activity')}>
                                {this.props.activity}
                            </span>
                        )}
                        {this.props.status && (
                            <span className={bem.element('status')}>
                                {ProjectStatusEnum.getLabel(this.props.status)}
                            </span>
                        )}
                    </div>
                </div>
                <div className={bem.element('column-right')}>
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
            </div>
        );
    }
}
