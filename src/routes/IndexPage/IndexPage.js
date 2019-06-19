import React from 'react';

import {html} from 'components';
import Button from 'ui/form/Button';
import Link from 'ui/nav/Link';

import './IndexPage.scss';

const bem = html.bem('IndexPage');

export default class IndexPage extends React.PureComponent {

    static propTypes = {};

    render() {
        return (
            <>
                <div className={bem.block()}>
                    <section className={bem.element('hero')}>
                        <div className={bem.element('hero-inner')}>
                            <div className={bem.element('hero-info')}>
                                <h1 className={bem.element('hero-title')}>{__('Rethink crowdfunding and grants!')}</h1>
                                <div className={bem.element('hero-text')}>
                                    <p className={bem.element('hero-annotation')}>
                                        {__('Ventuary-DAO - flexible decentralized autonomous organization leveraging the wisdom of the crowds and patronage of grant makers to benefit innovators and community.')}
                                    </p>
                                    <p className={bem.element('hero-annotation')}>
                                        {__('The Ventuary\'s Mission: To blaze a new path in organization for the betterment of its members, existing simultaneously nowhere and everywhere and operating solely with the steadfast iron will of unstoppable code.')}
                                    </p>
                                </div>
                                <div className={bem.element('hero-actions')}>
                                    <Button
                                        className={bem.element('hero-action', 'primary')}
                                        label={__('Add project')}
                                        onClick={() => console.log('add project')}
                                    />
                                    <Link
                                        className={bem.element('hero-action', 'secondary')}
                                        label={__('Find project')}
                                    />
                                </div>
                            </div>
                            <div
                                className={bem.element('hero-image')}
                                aria-hidden
                            >
                                <img
                                    src='static/images/landing-hero.svg'
                                    alt='Ventuary-DAO'
                                />
                            </div>
                        </div>
                    </section>
                    <section className={bem.element('features')}>
                        <h2 className={bem.element('subtitle')}>
                            {__('Key features of Ventuary-DAO')}
                        </h2>
                        <ul className={bem.element('features-list')}>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Community')}</span>
                                <img
                                    src='static/images/landing-community.svg'
                                    alt='community'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Rewards')}</span>
                                <img
                                    src='static/images/landing-rewards.svg'
                                    alt='Rewards'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Crowdfunding')}</span>
                                <img
                                    src='static/images/landing-rocket.svg'
                                    alt='Crowdfunding'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Votings')}</span>
                                <img
                                    src='static/images/landign-voting.svg'
                                    alt='Votings'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Decentralization')}</span>
                                <img
                                    src='static/images/landing-decentralization.svg'
                                    alt='Decentralization'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Reviews')}</span>
                                <img
                                    src='static/images/landing-reviews.svg'
                                    alt='Reviews'
                                />
                            </li>
                        </ul>
                    </section>
                    <section className={bem.element('process')}>
                        <h2 className={bem.element('subtitle')}>
                            {__('How it works')}
                        </h2>
                        <ul className={bem.element('features-list')}>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Proposal')}</span>
                                <img
                                    src='static/icons/landing-rocket-big.svg'
                                    alt='Proposal'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Voting')}</span>
                                <img
                                    src='static/icons/landign-voting-big.svg'
                                    alt='Voting'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Crowdfunding')}</span>
                                <img
                                    src='static/icons/landing-crowdfunding-big.svg'
                                    alt='Crowdfunding'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Grant')}</span>
                                <img
                                    src='static/icons/landing-grant-big.svg'
                                    alt='Grant'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Gainings')}</span>
                                <img
                                    src='static/icons/landing-gainings-big.svg'
                                    alt='Gainings'
                                />
                            </li>
                            <li className={bem.element('features-item')}>
                                <span className={bem.element('features-label')}>{__('Launch')}</span>
                                <img
                                    src='/images/landing- rocket-big-launch.svg'
                                    alt='Launch'
                                />
                            </li>
                        </ul>
                    </section>
                    <section className={bem.element('partners')}>
                        <h2 className={bem.element('subtitle')}>
                            {__('Partners')}
                        </h2>
                        <ul className={bem.element('partners-list')}>
                            <li className={bem.element('partners-item')}>
                                <img
                                    src='static/icons/landing-waves-logo.svg'
                                    alt='waves'
                                />
                            </li>
                            <li className={bem.element('partners-item')}>
                                <img
                                    src='static/icons/landing-tradisys-logo.svg'
                                    alt='tradisys'
                                />
                            </li>
                            <li className={bem.element('partners-item')}>
                                <img
                                    src='static/icons/landing-blockdata-logo.png'
                                    alt='blockdata'
                                />
                            </li>
                            <li className={bem.element('partners-item')}>
                                <img
                                    src='static/icons/landing-waves-labs-logo.svg'
                                    alt='waves-labs'
                                />
                            </li>
                        </ul>
                    </section>
                </div>
            </>
        );
    }
}
