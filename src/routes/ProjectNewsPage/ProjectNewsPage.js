import React from 'react';

import {html, resource} from 'components';

import ProjectSchema from 'types/ProjectSchema';
import './ProjectNewsPage.scss';

const bem = html.bem('ProjectNewsPage');

export default class ProjectNewsPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    componentDidMount() {
        resource.loadTwitterWidget().then(twttr => {
            twttr.widgets.createTimeline(
                {
                    sourceType: 'profile',
                    screenName: this.getTwitterName(),
                },
                this.refs.twitter
            );
        });
    }

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('twitter')}>
                    <a
                        ref='twitter'
                        className='twitter-timeline'
                        data-tweet-limit={7}
                        data-chrome='nofooter'
                        data-link-color='#0368ff'
                        href={this.props.project.socials.url_twitter}
                    >
                        {`Tweets by @${this.getTwitterName()}`}
                    </a>
                </div>
            </div>
        );
    }

    getTwitterName() {
        return this.props.project.socials.url_twitter.match(/\/[A-Za-z0-9]+$/)[0].substring(1);
    }
}
