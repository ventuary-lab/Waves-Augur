import React from 'react';

import {html} from 'components';
import ProjectSchema from 'types/ProjectSchema';
import CopyToClipboard from 'shared/CopyToClipboard';

import UserCard from 'shared/UserCard';
import SocialLinks from 'shared/SocialLinks';
import './ProjectDetailsPage.scss';
import ProjectContentEnum from 'enums/ProjectContentEnum';

const bem = html.bem('ProjectDetailsPage');

export default class ProjectDetailsPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('leader-block')}>
                    <div className={bem.element('title')}>
                        {__('Leader')}
                    </div>
                    <UserCard item={this.props.project.author}/>
                </div>
                <div className={bem.element('content')}>
                    <div className={'row'}>
                        <div className={'col col_desk-reverse col_desk-count-5'}>
                            <div className={bem.element('links')}>
                                <div className={bem.element('social-links')}>
                                    <SocialLinks
                                        urls={this.props.project.socials}
                                    />
                                </div>
                                <CopyToClipboard copyText={document.location.toString()}>
                                    <button className={bem.element('share-link')}>{__('Share Project')}</button>
                                </CopyToClipboard>
                            </div>
                        </div>
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
