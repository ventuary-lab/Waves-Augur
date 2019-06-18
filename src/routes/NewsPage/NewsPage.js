import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './NewsPage.scss';

const bem = html.bem('NewsPage');

export default class NewsPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col'}>
                            NewsPage page
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
