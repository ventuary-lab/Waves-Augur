import React from 'react';
import { connect } from 'react-redux';

import { html } from 'components';
import Button from 'yii-steroids/ui/form/Button';
import Link from 'yii-steroids/ui/nav/Link';
import { openModal } from 'yii-steroids/actions/modal';

import './IndexPage.scss';
import ProjectWizardModal from 'modals/ProjectWizardModal';

const bem = html.bem('IndexPage');

@connect()
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
                                    <button
                                        className={bem.element('hero-action', 'primary')}
                                        onClick={() => this.props.dispatch(openModal(ProjectWizardModal))}
                                    >
                                        {__('Add project')}
                                    </button>
                                    <a
                                        className={bem.element('hero-action', 'secondary')}
                                    >
                                        {__('Find project')}
                                    </a>
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
                    <section className={bem(bem.element('features'), 'section')}>
                        <div className={bem.element('features-inner')}>
                            <h2 className={bem(bem.element('features-title'), 'section__title')}>
                                {__('Key features of Ventuary-DAO')}
                            </h2>
                            <ul className={bem.element('features-list')}>
                                <li className={bem.element('features-item')}>
                                    <span className={bem.element('features-label')}>{__('Community')}</span>
                                    <span
                                        className={bem(bem.element('features-icon'), 'Icon Icon__community')}
                                        aria-hidden
                                    />
                                </li>
                                <li className={bem.element('features-item')}>
                                    <span className={bem.element('features-label')}>{__('Rewards')}</span>
                                    <span
                                        className={bem(bem.element('features-icon'), 'Icon Icon__rewards')}
                                        aria-hidden
                                    />
                                </li>
                                <li className={bem.element('features-item')}>
                                    <span className={bem.element('features-label')}>{__('Crowdfunding')}</span>
                                    <span
                                        className={bem(bem.element('features-icon'), 'Icon Icon__rocket-graph-main')}
                                        aria-hidden
                                    />
                                </li>
                                <li className={bem.element('features-item')}>
                                    <span className={bem.element('features-label')}>{__('Votings')}</span>
                                    <span
                                        className={bem(bem.element('features-icon'), 'Icon Icon__voting-graph')}
                                        aria-hidden
                                    />
                                </li>
                                <li className={bem.element('features-item')}>
                                    <span className={bem.element('features-label')}>{__('Decentralization')}</span>
                                    <span
                                        className={bem(bem.element('features-icon'), 'Icon Icon__decentralization')}
                                        aria-hidden
                                    />
                                </li>
                                <li className={bem.element('features-item')}>
                                    <span className={bem.element('features-label')}>{__('Reviews')}</span>
                                    <span
                                        className={bem(bem.element('features-icon'), 'Icon Icon__reviews')}
                                        aria-hidden
                                    />
                                </li>
                            </ul>
                        </div>
                    </section>
                    <section className={bem.element('process section')}>
                        <div className={bem.element('process-inner')}>
                            <h2 className={bem(bem.element('process-title'), 'section__title')}>
                                {__('How it works')}
                            </h2>
                            <ul className={bem.element('process-list')}>
                                <li className={bem.element('process-item')}>
                                    <span className={bem.element('process-label')}>{__('Proposal')}</span>
                                    <span
                                        className={bem(bem.element('process-icon'), 'Icon Icon__rocket-graph-big')}
                                        aria-hidden
                                    />
                                    <span className={bem(bem.element('process-icon'), 'Icon Icon__arrow')} style={{position: 'absolute'}}></span>
                                </li>
                                <li className={bem.element('process-item')}>
                                    <span className={bem.element('process-label')}>{__('Voting')}</span>
                                    <span
                                        className={bem(bem.element('process-icon'), 'Icon Icon__voting-graph-big')}
                                        aria-hidden
                                    />
                                </li>
                                <li className={bem.element('process-item')}>
                                    <span className={bem.element('process-label')}>{__('Crowdfunding')}</span>
                                    <span
                                        className={bem(bem.element('process-icon'), 'Icon Icon__crowdfunding-big')}
                                        aria-hidden
                                    />
                                </li>
                                <li className={bem.element('process-item')}>
                                    <span className={bem.element('process-label')}>{__('Grant')}</span>
                                    <span
                                        className={bem(bem.element('process-icon'), 'Icon Icon__grant-big')}
                                        aria-hidden
                                    />
                                </li>
                                <li className={bem.element('process-item')}>
                                    <span className={bem.element('process-label')}>{__('Gainings')}</span>
                                    <span
                                        className={bem(bem.element('process-icon'), 'Icon Icon__gainings-big')}
                                        aria-hidden
                                    />
                                </li>
                                <li className={bem.element('process-item')}>
                                    <span className={bem.element('process-label')}>{__('Launch')}</span>
                                    <span
                                        className={bem(bem.element('process-icon'), 'Icon Icon__rocket-graph')}
                                        aria-hidden
                                    />
                                </li>
                            </ul>
                        </div>
                    </section>
                    <section className={bem(bem.element('partners'), 'section')}>
                        <div className={bem.element('partners-inner')}>
                            <h2 className={bem(bem.element('partners-title'), 'section__title')}>
                                {__('Partners')}
                            </h2>
                            <ul className={bem.element('partners-list')}>
                                <li className={bem.element('partners-item')}>
                                    <a
                                        className={bem.element('partners-link')}
                                        target='_blank'
                                        href='https://wavesplatform.com/'
                                    >
                                        <img
                                            className={bem.element('partners-logo', 'waves')}
                                            src='static/icons/landing-waves-logo.svg'
                                            alt='waves'
                                        />
                                    </a>
                                </li>
                                <li className={bem.element('partners-item')}>
                                    <a
                                        className={bem.element('partners-link')}
                                        target='_blank'
                                        href='https://www.tradisys.com/'
                                    >
                                        <img
                                            className={bem.element('partners-logo', 'tradisvs')}
                                            src='static/icons/landing-tradisys-logo.svg'
                                            alt='tradisys'
                                        />
                                    </a>
                                </li>
                                <li className={bem.element('partners-item')}>
                                    <a
                                        className={bem.element('partners-link')}
                                        target='_blank'
                                        href='https://www.blockdata.tech/'
                                    >
                                        <img
                                            className={bem.element('partners-logo', 'blockdata')}
                                            src='static/icons/landing-blockdata-logo.png'
                                            alt='blockdata'
                                        />
                                    </a>
                                </li>
                                <li className={bem.element('partners-item')}>
                                    <a
                                        className={bem.element('partners-link')}
                                        target='_blank'
                                        href='https://waveslabs.com/grants'
                                    >
                                        <img
                                            className={bem.element('partners-logo', 'waves-labs')}
                                            src='static/icons/landing-waves-labs-logo.svg'
                                            alt='waves-labs'
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </>
        );
    }
}
