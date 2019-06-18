import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import SocialLinks from 'shared/SocialLinks';

import './Footer.scss';

const bem = html.bem('Footer');

export default class Footer extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <footer className={bem.block()}>
                <div className={bem.element('inner')}>
                    <div className={bem.element('info')}>
                        <div className={bem.element('company')}>
                            <strong className={bem.element('company-name')}>ventuary</strong>
                            <div className={bem.element('address')}>
                                © Ventuary Inc.<br/>
                                251 Little Falls Drive,<br/>
                                Wilmington, New Castle Country,<br/>
                                Delaware USA <br/>
                                19808-1674
                            </div>
                        </div>
                        <ul className={bem.element('helpers')}>
                            <li className={bem.element('helpers-item')}>
                                <strong className={bem.element('helpers-label')}>
                                    {__('Get started')}
                                </strong>
                                <ul className={bem.element('helper')}>
                                    <li className={bem.element('helper-item')}>
                                        <a
                                            className={bem.element('helper-link')}
                                            href='javascript:void(0);'
                                        >
                                            {__('Join as a customer')}
                                        </a>
                                    </li>
                                    <li className={bem.element('helper-item')}>
                                        <a
                                            className={bem.element('helper-link')}
                                            href='javascript:void(0);'
                                        >
                                            {__('Join as a analyst')}
                                        </a>
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
                                            href='javascript:void(0);'
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
                                            href='javascript:void(0);'
                                        >
                                            {__('Contact')}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
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
            </footer>
        );
    }
}
