import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './CampaignsPage.scss';

const bem = html.bem('CampaignsPage');

export default class CampaignsPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <section className={bem.block()}>
                CampaignsPage page
            </section>
        );
    }
}
