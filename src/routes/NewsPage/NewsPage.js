import React from 'react';

import {html} from 'components';

import './NewsPage.scss';
import ProjectSchema from 'types/ProjectSchema';

const bem = html.bem('NewsPage');

export default class NewsPage extends React.PureComponent {

    static propTypes = {
        project: ProjectSchema,
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
