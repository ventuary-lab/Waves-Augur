import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';

import Tags from 'shared/Tags';
import SocialLinks from 'shared/SocialLinks';
import {html} from 'components';

import './CardTags.scss';

const bem = html.bem('CardTags');


export default class CardTags extends React.PureComponent {

    static propTypes = {
        tags: PropTypes.arrayOf(PropTypes.string),
        toRoute: PropTypes.string,
        toRouteParams: PropTypes.object,
        socials: PropTypes.object,
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
                    <Link
                        className={bem(bem.element('link'), 'read-more-link')}
                        toRoute={this.props.toRoute}
                        toRouteParams={this.props.toRouteParams}
                        label={__('Read More')}
                        noStyles
                    />
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
