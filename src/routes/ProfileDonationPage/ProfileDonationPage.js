import React from 'react';
import PropTypes from 'prop-types';
import Link from 'yii-steroids/ui/nav/Link';

import {html} from 'components';

import {ROUTE_PROJECTS_REDIRECT} from 'routes';
import ActionButtonBlock from 'shared/ActionButtonBlock';

import './ProfileDonationPage.scss';

const bem = html.bem('ProfileDonationPage');

export default class ProfileDonationPage extends React.PureComponent {

    static propTypes = {
        items: PropTypes.array,
    };

    render() {
        return (
            <div className={bem.block()}>
                <Link
                    toRoute={ROUTE_PROJECTS_REDIRECT}
                    noStyles
                    className={bem.element('link-block')}
                >
                    <ActionButtonBlock
                        title={__('Explore New Ideas')}
                        iconClass={'Icon__explore-ideas'}
                    />
                </Link>
                <div className={bem.element('card-list')}>
                    DonationPage
                </div>
            </div>
        );
    }
}
