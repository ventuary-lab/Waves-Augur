import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { html } from 'components';
import ProjectSchema from 'types/ProjectSchema';
import { isPhone } from 'yii-steroids/reducers/screen';
import RightSide from './RightSide';

import UserCard from 'shared/UserCard';
import ProjectPreviewDetails from 'shared/ProjectPreviewDetails';

import './ProjectDetailsPage.scss';
import ProjectContentEnum from 'enums/ProjectContentEnum';

const COMPONENT_NAME = 'ProjectDetailsPage';

const bem = html.bem(COMPONENT_NAME);


@connect(
    state => ({
        currentUserAddress: _.get(state, 'auth.user.address', ''),
        isPhone: isPhone(state)
    })
)

export default class ProjectDetailsPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    constructor (props) {
        super(props);
    }

    render() {
        const isAuthor = this.props.currentUserAddress === _.get(this.props, 'project.author.address', null);

        return (
            <div className={bem.block()}>
                <ProjectPreviewDetails previews={this.props.project.previews || []}/>
                <div className={bem.element('leader-block')}>
                    <div className={bem.element('title')}>
                        {__('Leader')}
                    </div>
                    <UserCard item={this.props.project.author}/>
                </div>
                <div className={bem.element('content')}>
                    <div className={'row'}>
                        <RightSide
                            socials={this.props.project.socials}
                            project={this.props.project}
                            parentName={COMPONENT_NAME}
                            isAuthor={isAuthor}
                            isPhone={this.props.isPhone}
                        />
                        <div className={'col col_desk-count-7'}>
                            <div className={bem.element('info')}>
                                {ProjectContentEnum.getKeys()
                                    .filter(attribute => !!this.props.project.contents[attribute])
                                    .map(attribute => (
                                        <div key={attribute}>
                                            <div className={bem.element('title')}>
                                                {ProjectContentEnum.getLabel(attribute)}
                                            </div>
                                            <div className={bem.element('description')}>
                                                {this.props.project.contents[attribute].split('\n').map((item, index) => (
                                                    <p key={index}>
                                                        {item}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
