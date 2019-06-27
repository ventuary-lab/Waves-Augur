import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

import './ProjectsPage.scss';

const bem = html.bem('ProjectsPage');

export default class ProjectsPage extends React.PureComponent {

    static propTypes = {

    };

    render() {
        return (
            <section className={bem.block()}>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col'}>
                            ProjectsPage
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
