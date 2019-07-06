import React from 'react';
import PropTypes from 'prop-types';

import Tags from 'shared/Tags';
import SocialLinks from 'shared/SocialLinks';
import {html} from 'components';

import './CardTags.scss';
import UserSchema from 'types/UserSchema';
import Link from 'yii-steroids/ui/nav/Link';
import UserRole from 'enums/UserRole';
import {ROUTE_USER_DONATION, ROUTE_USER_GRANTS} from 'routes';

const bem = html.bem('CardTags');


export default class CardTags extends React.PureComponent {

    static propTypes = {
        user: UserSchema,
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('tags')}>
                    {this.props.user.tags && this.props.user.tags.length > 0 && (
                        <Tags
                            items={this.props.user.tags}
                        />
                    )}
                </div>
                <div className={bem.element('actions')}>
                    <Link
                        toRoute={this.props.user.role === UserRole.WHALE ? ROUTE_USER_GRANTS : ROUTE_USER_DONATION}
                        toRouteParams={{
                            address: this.props.user.address,
                        }}
                        className={bem.element('link')}
                        noStyles
                    >
                        {__('Read More')}
                    </Link>
                    <div className={bem.element('socials')}>
                        <SocialLinks
                            urls={this.props.user.socials}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
