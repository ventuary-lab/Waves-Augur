import React from 'react';

import {html} from 'components';

import './IndexPage.scss';

const bem = html.bem('IndexPage');

export default class IndexPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <section className={bem.block()}>
                Main page
            </section>
        );
    }
}
