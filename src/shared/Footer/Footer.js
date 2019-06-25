import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {html} from 'components';
import SocialLinks from 'shared/SocialLinks';
import Link from 'yii-steroids/ui/nav/Link';
import {ROUTE_ROOT} from 'routes';
import { getNavUrl } from 'yii-steroids/reducers/navigation';

import './Footer.scss';

const bem = html.bem('Footer');

// TODO replace page id when create project page will be reade
@connect(
    state => ({
        createProjectPageUrl: getNavUrl(state, ROUTE_ROOT),
        findProjectPageUrl: getNavUrl(state, ROUTE_ROOT),
        indexPageUrl: getNavUrl(state, ROUTE_ROOT),
    })
)
export default class Footer extends React.PureComponent {

    static propTypes = {
        createProjectPageUrl: PropTypes.string,
        findProjectPageUrl: PropTypes.string,
        indexPageUrl: PropTypes.string,
    };

    render() {
        return (
            <footer className={bem.block()}>
                <div className={bem.element('inner')}>
                    <div className={bem.element('left')}>
                        <Link
                            className={bem.element('logo')}
                            to={this.props.indexPageUrl}
                            noStyles
                        >
                            <img
                                className={bem.element('logo-image')}
                                src='static/icons/ventuary-logo-white.svg'
                                alt='ventuary dao'
                            />
                        </Link>
                        <div className={bem.element('socials')}>
                            <SocialLinks
                                items={[
                                    {
                                        id: 'twitter',
                                        link: ''
                                    },
                                    {
                                        id: 'facebook',
                                        link: ''
                                    },
                                    {
                                        id: 'instagram',
                                        link: ''
                                    },
                                    {
                                        id: 'telegram',
                                        link: ''
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    <div className={bem.element('right')}>
                        <ul className={bem.element('helpers')}>
                            <li className={bem.element('helpers-item')}>
                                <strong className={bem.element('helpers-label')}>
                                    {__('Get started')}
                                </strong>
                                <ul className={bem.element('helper')}>
                                    <li className={bem.element('helper-item')}>
                                        <Link
                                            className={bem.element('helper-link')}
                                            to={this.props.createProjectPageUrl}
                                            noStyles
                                        >
                                            {__('Add project')}
                                        </Link>
                                    </li>
                                    <li className={bem.element('helper-item')}>
                                        <Link
                                            className={bem.element('helper-link')}
                                            to={this.props.findProjectPageUrl}
                                            noStyles
                                        >
                                            {__('Find project')}
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className={bem.element('helpers-item')}>
                                <strong className={bem.element('helpers-label')}>
                                    {__('Technology')}
                                </strong>
                                <ul className={bem.element('helper')}>
                                    <li className={bem.element('helper-item')}>
                                        <a
                                            className={bem.element('helper-link')}
                                            target='_blank'
                                            href='https://github.com/AlekseiPupyshev'
                                        >
                                            GitHub
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className={bem.element('helpers-item')}>
                                <strong className={bem.element('helpers-label')}>
                                    {__('Media')}
                                </strong>
                                <ul className={bem.element('helper')}>
                                    <li className={bem.element('helper-item')}>
                                        <a
                                            className={bem.element('helper-link')}
                                            target='_blank'
                                            href='https://t.me/adventuary'
                                        >
                                            {__('Contact')}
                                        </a>
                                    </li>
                                    <li className={bem.element('helper-item')}>
                                        <a
                                            className={bem.element('helper-link')}
                                            target='_blank'
                                            href='https://drive.google.com/file/d/1UB4NjUb5yDA__IV9bMSh-40JPMqkb4ZG/view'
                                        >
                                            {__('PDF')}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
}
