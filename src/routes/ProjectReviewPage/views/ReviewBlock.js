import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import ProjectSchema from 'types/ProjectSchema';
import UserSchema from 'types/UserSchema';
import CardReview from 'shared/Card/views/CardReview';
import ProjectCard from 'shared/ProjectCard';

import './ReviewBlock.scss';

const bem = html.bem('ReviewBlock');

export default class ReviewBlock extends React.PureComponent {

    static propTypes = {
        user: UserSchema,
        project: ProjectSchema,
        review: PropTypes.object,
    };

    render() {

        return (
            <div className={bem.block()}>
                <div className={bem.element('review')}>
                    <CardReview
                        {...this.props.review}
                        user={this.props.user}
                        isReviewPage={true}
                    />
                </div>
                <div className={bem.element('project')}>
                    <ProjectCard
                        item={this.props.project}
                        isReviewPage={true}
                    />
                </div>
            </div>
        );
    }

}
