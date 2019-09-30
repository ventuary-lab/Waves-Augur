import React from 'react';
import { html } from 'components';

const bem = html.bem('EntityPageLayout');

import './index.scss';


class EntityPageLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        <div className={bem.element('root')}>
            <div></div>
        </div>
    }
}


export default EntityPageLayout;