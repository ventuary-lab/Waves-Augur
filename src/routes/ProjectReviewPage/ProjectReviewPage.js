import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import Button from 'yii-steroids/ui/form/Button';

import {dal, html,} from 'components';
import ReviewBlock from './views/ReviewBlock';
import UserSchema from 'types/UserSchema';
import CopyToClipboard from 'shared/CopyToClipboard';

import ProjectSchema from 'types/ProjectSchema';
import './ProjectReviewPage.scss';

const bem = html.bem('ProjectReviewPage');

@dal.hoc(
    props => Promise.all([
        dal.getProject(_get(props, 'match.params.uid')),
        dal.getUser(_get(props, 'match.params.address'))
    ])
        .then(result => {

            if (_get(props, 'match.params.type') === 'vote') {
                return  dal.getUserVotings(result[1].address)
                    .then(votings => ({
                        review: votings.find(item => item.project.uid === result[0].uid),
                        project: result[0],
                        user: result[1]
                    }));
            }

            if (_get(props, 'match.params.type') === 'donate') {
                return  dal.getUserDonations(result[1].address)
                    .then(donations => ({
                        review: donations
                            .filter(item => item.project.uid === result[0].uid)
                            .find(item => item.reviewNumber === parseInt(_get(props, 'match.params.number'))),
                        project: result[0],
                        user: result[1],
                    }));
            }

            return null;
        })
)

export default class ProjectReviewPage extends React.PureComponent {

    static propTypes = {
        user: UserSchema,
        project: ProjectSchema,
        review: PropTypes.object,
    };

    render() {
        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col'}>
                            <div className={bem.element('inner')}>
                                <h3 className={bem.element('title')}>
                                    {__('Review')}
                                </h3>
                                <>
                                    {(!this.props.review || !this.props.project || !this.props.user) && (
                                        <div className={bem.element('loading')}>
                                            {__('Loading...')}
                                        </div>
                                    ) || (
                                        <>
                                            <div className={bem.element('review-block')}>
                                                <ReviewBlock
                                                    user={this.props.user}
                                                    project={this.props.project}
                                                    review={this.props.review}
                                                />
                                            </div>
                                            <div className={bem.element('action')}>
                                                <CopyToClipboard copyText={document.location.toString()}>
                                                    <Button
                                                        label={__('Share')}
                                                    />
                                                </CopyToClipboard>
                                            </div>
                                        </>
                                    )}
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

}
