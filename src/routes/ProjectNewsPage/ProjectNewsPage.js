import React from 'react';
import _ from 'lodash';
import {html, resource} from 'components';

import ProjectSchema from 'types/ProjectSchema';
import './ProjectNewsPage.scss';

const bem = html.bem('ProjectNewsPage');

export default class ProjectNewsPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
    };

    componentDidMount() {
        if (this.getTwitterName()) {
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
    }

    render() {
        if (!this.getTwitterName()) {
            return null;
        }

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
        let { url_twitter: twitter } = _.get(this.props, 'project.socials', {}); 

        if (!twitter) {
            return null;
        }
        const twitterPrefix = 'https://twitter.com/';

        if (twitter.indexOf(twitterPrefix) !== -1) {
            twitter = twitter.slice(twitterPrefix.length);
        }

        const regex = /^\@?[A-Za-z0-9_]{1,16}$/;
        const matches = twitter.match(regex);

        if (!matches) {
            return null;
        }

        twitter = matches[0];

        if (twitter.includes('@')) {
            twitter = twitter.slice(1);
        }

        return twitter;
    }
}
