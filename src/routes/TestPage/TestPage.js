import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import ProfileSidebar from 'shared/ProfileSidebar';
import data from 'static/data/profile-sidebar';

import './TestPage.scss';

const bem = html.bem('TestPage');

export default class TestPage extends React.PureComponent {

    static propTypes = {

    };

    render() {

        return (
            <section className={bem.block()}>
                <div className={bem.element('image-line')}/>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col col_count-12 col_tablet-count-4 col_desk-count-3'}>
                            <ProfileSidebar
                                {...data.user}
                            />
                        </div>
                    </div>
                </div>
                <div className={bem.element('image-line')}/>
                <div className={'wrapper'}>
                    <div className={'row'}>
                        <div className={'col col_count-12 col_tablet-count-4 col_desk-count-3'}>
                            <ProfileSidebar
                                {...data.project}
                                isProject={true}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
