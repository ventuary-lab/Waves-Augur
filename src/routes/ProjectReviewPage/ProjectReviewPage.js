import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import Button from 'yii-steroids/ui/form/Button';

import { dal as DalClass, html} from 'components';
const dal = DalClass();

import ReviewBlock from './views/ReviewBlock';
import UserSchema from 'types/UserSchema';
import CopyToClipboard from 'shared/CopyToClipboard';
import FeedTypeEnum from 'enums/FeedTypeEnum';

import ProjectSchema from 'types/ProjectSchema';
import './ProjectReviewPage.scss';

const bem = html.bem('ProjectReviewPage');

@dal.hoc2(
    props => ([
        {
            url: `/api/v1/projects/${_get(props, 'match.params.uid')}`,
            key: 'project',
            collection: 'projects',
        },
        {
            url: `/api/v1/users/${_get(props, 'match.params.address')}`,
            key: 'user',
            collection: 'users',
        },
        _get(props, 'match.params.type') === FeedTypeEnum.DONATE && {
            url: `/api/v1/reviews/donations/${_get(props, 'match.params.uid')}_${_get(props, 'match.params.address')}_${_get(props, 'match.params.number')}`,
            key: 'review',
            collection: 'reviewDonations',
        },
        _get(props, 'match.params.type') === FeedTypeEnum.VOTE && {
            url: `/api/v1/reviews/votings/${_get(props, 'match.params.uid')}_${_get(props, 'match.params.address')}`,
            key: 'review',
            collection: 'reviewVotings',
        },
        _get(props, 'match.params.type') === FeedTypeEnum.WHALE && {
            url: `/api/v1/reviews/whales/${_get(props, 'match.params.uid')}_${_get(props, 'match.params.address')}`,
            key: 'review',
            collection: 'reviewWhales',
        },
    ].filter(Boolean))
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
