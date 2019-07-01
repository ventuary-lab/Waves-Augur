import React from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';

import _get from 'lodash/get';
import {dal, html} from 'components';
import ProjectSchema from 'types/ProjectSchema';

import DonateForm from 'shared/DonateForm';
import UserCard from 'shared/UserCard';
import SocialLinks from 'shared/SocialLinks';
import './ProjectDetailsPage.scss';

const bem = html.bem('ProjectDetailsPage');

// @dal.hoc(
//     props => dal.getProject(_get(props, 'match.params.uid'))
//         .then(project => ({project}))
// )
export default class ProjectDetailsPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('form-block')}>
                    <DonateForm/>
                </div>
                <div className={bem.element('inner')}>
                    <div className={bem.element('leader-block')}>
                        <div className={bem.element('title')}>
                            {__('Leader')}
                        </div>

                        {/*<UserCard
                        item={this.props.project.author}
                    />*/}
                        <UserCard
                            item={{
                                profile: {
                                    name: 'Aleksei Pupyshev',
                                    title: 'Founder & CEO @Ventuary',
                                    tags: ['Consulting', 'RND', 'Analytics'],
                                    avatar: '',
                                    country: 'Russia',
                                }
                            }}
                        />
                    </div>
                    <div className={bem.element('content')}>
                        <div className={'row'}>
                            <div className={'col col_desk-reverse col_desk-count-5'}>
                                <div className={bem.element('links')}>
                                    <div className={bem.element('social-links')}>
                                        <SocialLinks
                                            urls={{
                                                url_twitter: '1',
                                                url_facebook: '1',
                                                url_linkedin: '1',
                                                url_instagram: '1',
                                                url_telegram: '1',
                                                url_website: '1',
                                            }}
                                        />
                                    </div>
                                    <a
                                        className={bem.element('share-link')}
                                        href={'javascript:void(0)'}
                                    >
                                        {__('Share Project')}
                                    </a>
                                </div>
                            </div>
                            <div className={'col col_desk-count-7'}>
                                <div className={bem.element('info')}>
                                    <div className={bem.element('title')}>
                                        {__('Expenses')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner.')}
                                    </p>
                                    <div className={bem.element('title')}>
                                        {__('Problem')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner. ')}
                                    </p>
                                    <div className={bem.element('title')}>
                                        {__('MVP')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner.')}
                                    </p>
                                    <div className={bem.element('title')}>
                                        {__('X-Factor')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner.')}
                                    </p>
                                    <div className={bem.element('title')}>
                                        {__('Large Scale Adoption')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner.')}
                                    </p>
                                    <div className={bem.element('title')}>
                                        {__('Impact On User')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner.')}
                                    </p>
                                    <div className={bem.element('title')}>
                                        {__('Impact On User Context')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner.')}
                                    </p>
                                    <div className={bem.element('title')}>
                                        {__('Code Validation')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner.')}
                                    </p>
                                    <div className={bem.element('title')}>
                                        {__('Impact On User Context')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner.')}
                                    </p>
                                    <div className={bem.element('title')}>
                                        {__('Legal Arrangements')}
                                    </div>
                                    <p className={bem.element('description')}>
                                        {__('Confidence and reliability The decentralized system guarantees the payment to the carrier regardless of IMMLA&rsquo;s financial condition, the same way it guarantees the delivery or insurance payment to the cargo owner.')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
