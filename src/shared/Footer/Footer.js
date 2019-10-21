import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isPhone } from 'yii-steroids/reducers/screen';
import { getNavItem, getNavUrl } from 'yii-steroids/reducers/navigation';
import { openModal } from 'yii-steroids/actions/modal';
import { getUser } from 'yii-steroids/reducers/auth';
import Link from 'yii-steroids/ui/nav/Link';
import { faTelegramPlane, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';

import { html } from 'components';
import SocialLinks from 'shared/SocialLinks';
import ProjectWizardModal from 'modals/ProjectWizardModal';
import ventuaryLogo from 'static/icons/dao-logo-bw.svg';
import { ROUTE_PROFILE_PROJECTS, ROUTE_PROJECTS, ROUTE_ROOT } from 'routes';
import heartImg from 'static/images/huge_heart.png';
import { ReduxModalContext } from 'shared/Layout/context';

import './Footer.scss';

const bem = html.bem('Footer');

// TODO replace page id when create project page will be reade
@connect(
    state => {
        const user = getUser(state);
        const item = getNavItem(state, ROUTE_PROFILE_PROJECTS);

        return {
            indexPageUrl: getNavUrl(state, ROUTE_ROOT),
            isPhone: isPhone(state),
            canAddProject: user && (item.roles || []).includes(user.role),
        };
    }
)
export default class Footer extends React.PureComponent {

    static propTypes = {
        indexPageUrl: PropTypes.string,
        isPhone: PropTypes.bool,
        canAddProject: PropTypes.bool,
    };

    constructor (props) {
        super(props);

        this.links = [
            { url: 'https://www.linkedin.com/company/ventuary', name: 'linkedin', icon: faLinkedinIn },
            { url: 'https://t.me/ventuary_dao', name: 'telegram', icon: faTelegramPlane },
            { url: 'https://twitter.com/ventuarydao', name: 'twitter', icon: faTwitter },
        ];
    }

    render() {
        const { links } = this;

        const heartIcon = (
            <img src={heartImg} className='heart-icon'/>
        );
        const socialLinks = links.map(link => (
            <a href={link.url}>
                <FontAwesomeIcon icon={link.icon}/>
            </a>
        ));

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
                                src={ventuaryLogo}
                                alt='ventuary dao'
                            />
                        </Link>
                        <div className={bem.element('socials')}>
                            <SocialLinks/>
                        </div>
                    </div>
                    <div className={bem.element('right')}>
                        <ul className={bem.element('helpers')}>
                            <li className={bem.element('helpers-item')}>
                                <strong className={bem.element('helpers-label')}>
                                    {__('Get started')}
                                </strong>
                                <ul className={bem.element('helper')}>
                                    {this.props.canAddProject && (
                                        <ReduxModalContext.Consumer>
                                            {({ openLoginModal }) => (
                                                <li className={bem.element('helper-item')}>
                                                    <Link
                                                        className={bem.element('helper-link')}
                                                        onClick={() => {
                                                            if (this.props.isPhone) {
                                                                openLoginModal();
                                                            } else {
                                                                this.props.dispatch(openModal(ProjectWizardModal));
                                                            }
                                                        }}
                                                        noStyles
                                                    >
                                                        {__('Add project')}
                                                    </Link>
                                                </li>
                                            )}
                                        </ReduxModalContext.Consumer>
                                    )}
                                    <li className={bem.element('helper-item')}>
                                        <Link
                                            className={bem.element('helper-link')}
                                            to={ROUTE_PROJECTS}
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
                    <div className={bem.element('author-text')}>
                        <div>
                            <div>{socialLinks}</div>
                            <div>
                                <div>© 2019 Ventuary DAO. Made with {heartIcon} </div>
                                <div>in Saint Petersburg. Powered by <span className='waves-sp'>waves</span>🔹</div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
