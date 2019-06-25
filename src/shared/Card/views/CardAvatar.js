import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import ProjectStatusEnum from 'enums/ProjectStatusEnum';
import avatarStub from 'static/images/avatar-stub.png';
import coverStub from 'static/images/cover-stub.png';

import './CardAvatar.scss';

const bem = html.bem('CardAvatar');


export default class CardAvatar extends React.PureComponent {

    static propTypes = {
        duration: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
        logoUrl: PropTypes.string,
        coverUrl: PropTypes.string,
        activity: PropTypes.number,
        status: PropTypes.string,
    };

    render() {
        return (
            <div className={bem.block()}>
                <div
                    className={bem.element('header')}
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
                    {this.props.duration && (
                        <span className={bem.element('duration')}>
                            {this.props.duration}
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
        );
    }
}
