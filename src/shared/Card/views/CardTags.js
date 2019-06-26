import React from 'react';
import PropTypes from 'prop-types';

import Tags from 'shared/Tags';
import SocialLinks from 'shared/SocialLinks';
import {html} from 'components';

import './CardTags.scss';

const bem = html.bem('CardTags');


export default class CardTags extends React.PureComponent {

    static propTypes = {
        tags: PropTypes.arrayOf(PropTypes.string),
        socials: PropTypes.shape({
            url_twitter: PropTypes.string,
            url_facebook: PropTypes.string,
            url_linkedin: PropTypes.string,
            url_instagram: PropTypes.string,
            url_telegram: PropTypes.string,
            url_website: PropTypes.string,
        }),
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('tags')}>
                    {this.props.tags && this.props.tags.length > 0 && (
                        <Tags
                            items={this.props.tags}
                        />
                    )}
                </div>
                <div className={bem.element('actions')}>
                    <span className={bem.element('link')}>
                        {__('ReadMore')}
                    </span>
                    <div className={bem.element('socials')}>
                        <SocialLinks
                            urls={this.props.socials}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
