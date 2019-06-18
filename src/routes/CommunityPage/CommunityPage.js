import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './CommunityPage.scss';

const bem = html.bem('CommunityPage');

export default class CommunityPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col'}>
                            CommunityPage page
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
