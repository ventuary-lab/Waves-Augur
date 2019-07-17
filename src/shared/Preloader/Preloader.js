import React from 'react';

import {html} from 'components';

import './Preloader.scss';

const bem = html.bem('Preloader');

export default class Preloader extends React.PureComponent {

    render() {
        return (
            <div className={bem.block()}>
                <span>{__('Loading...')}</span>
            </div>
        );
    }
}
